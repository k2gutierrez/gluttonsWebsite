import os
import time
import json
import logging
from web3 import Web3, exceptions
from dotenv import load_dotenv
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

# --- Configuration Setup ---
load_dotenv()

# Environment variables
WEB3_PROVIDER = os.getenv('WEB3_PROVIDER_URL')
CONTRACT_ADDRESS = os.getenv('CONTRACT_ADDRESS')
ORACLE_PRIVATE_KEY = os.getenv('ORACLE_PRIVATE_KEY')
MIN_ETH_BALANCE = float(os.getenv('MIN_ETH_BALANCE', 0.01))  # Minimum ETH balance threshold
ALERT_WEBHOOK = os.getenv('ALERT_WEBHOOK_URL')

# Transaction parameters
GAS_LIMIT_MULTIPLIER = 1.5
MAX_FEE_PER_GAS_MULTIPLIER = 1.3
PRIORITY_FEE_MULTIPLIER = 1.2
RETRY_ATTEMPTS = 3

# Initialize Web3
w3 = Web3(Web3.HTTPProvider(WEB3_PROVIDER))
assert w3.is_connected(), "Failed to connect to Ethereum node"

# Load contract ABI
with open('GluttonsABI.json') as f:
    contract_abi = json.load(f)
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=contract_abi)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('oracle_service.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('DailyGameOracle')

# --- Helper Functions ---
def send_alert(message):
    """Send critical alerts to monitoring system"""
    logger.critical(message)
    # Implementation for Slack/Telegram/Discord webhook would go here
    # Example: requests.post(ALERT_WEBHOOK, json={"text": message})

def check_eth_balance():
    """Verify sufficient ETH balance for transactions"""
    account = w3.eth.account.from_key(ORACLE_PRIVATE_KEY)
    balance = w3.eth.get_balance(account.address)
    balance_eth = w3.from_wei(balance, 'ether') # ether
    
    if balance_eth < MIN_ETH_BALANCE:
        message = (f"Low ETH balance: {balance_eth:.6f} ETH. "
                   f"Minimum required: {MIN_ETH_BALANCE} ETH")
        send_alert(message)
        return False
    return True

def get_dynamic_gas_params():
    """Calculate optimal EIP-1559 gas parameters"""
    base_fee = w3.eth.get_block('latest').baseFeePerGas
    max_priority = int(w3.eth.max_priority_fee * PRIORITY_FEE_MULTIPLIER)
    max_fee = int(base_fee * MAX_FEE_PER_GAS_MULTIPLIER) + max_priority
    return {
        'maxPriorityFeePerGas': max_priority,
        'maxFeePerGas': max_fee,
        'type': 2  # EIP-1559 transaction
    }

# --- Core Oracle Functionality ---
@retry(
    stop=stop_after_attempt(RETRY_ATTEMPTS),
    wait=wait_exponential(multiplier=1, min=4, max=60),
    retry=retry_if_exception_type((exceptions.TransactionNotFound, exceptions.TimeExhausted)),
    reraise=True
)
def perform_daily_update():
    """Execute daily update with robust error handling"""
    try:
        # 1. Check preconditions
        if not check_eth_balance():
            return False

        # 2. Check if 24 hours have passed
        last_update = contract.functions.getlastReaperCall().call()
        print("last update: ", last_update)
        current_time = int(time.time())

        print("current time: ", current_time)
        
        if current_time < last_update + 120:  # 86400 seconds = 24 hours      120 seconds = 2 min
            logger.info("Update not required - too early")
            return False

        # 3. Estimate gas
        gas_estimate = contract.functions.executeReaper().estimate_gas({
            'from': w3.eth.account.from_key(ORACLE_PRIVATE_KEY).address
        })
        gas_limit = int(gas_estimate * GAS_LIMIT_MULTIPLIER)

        # 4. Build transaction
        gas_params = get_dynamic_gas_params()
        account = w3.eth.account.from_key(ORACLE_PRIVATE_KEY)
        nonce = w3.eth.get_transaction_count(account.address)
        
        tx = contract.functions.executeReaper().build_transaction({
            'chainId': 33111, # w3.eth.chain_id
            'gas': gas_limit,
            'nonce': nonce,
            **gas_params
        })

        # 5. Sign and send transaction
        signed_tx = w3.eth.account.sign_transaction(tx, ORACLE_PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        
        # 6. Wait for confirmation
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
        
        if receipt.status == 1:
            logger.info(f"Update successful! TX: {tx_hash.hex()}")
            return True
        else:
            logger.error(f"Transaction failed: {tx_hash.hex()}")
            return False

    except exceptions.ContractLogicError as e:
        logger.error(f"Contract error: {str(e)}")
        return False
    except ValueError as e:
        if 'nonce too low' in str(e).lower():
            logger.warning("Nonce error - possible transaction collision")
        else:
            logger.exception("Value error in transaction")
        return False
    except Exception as e:
        logger.exception(f"Unexpected error: {str(e)}")
        send_alert(f"Critical oracle failure: {str(e)}")
        return False

# --- Health Monitoring ---
def health_check():
    """Comprehensive system health check"""
    checks = {
        'blockchain_connection': w3.is_connected(),
        'contract_accessible': contract.functions.getlastReaperCall().call() > 0,
        'eth_balance': check_eth_balance(),
        'oracle_authorized': contract.functions.getOracle().call() == 
                             w3.eth.account.from_key(ORACLE_PRIVATE_KEY).address
    }
    
    status = all(checks.values())
    print("status: ", status)
    if not status:
        failed = [k for k, v in checks.items() if not v]
        logger.warning(f"Health check failed: {', '.join(failed)}")
        send_alert(f"Oracle health check failed: {', '.join(failed)}")
    
    return status

# --- Main Execution ---
if __name__ == "__main__":
    logger.info("Starting DailyGame Oracle Service")
    
    # Initial health check
    if not health_check():
        send_alert("Oracle failed initial health check - service halted")
        exit(1)
    
    # Main loop
    while health_check() == True:
        try:
            # Run at 00:00 UTC every day
            current_utc = time.gmtime()
            print("tm_hour: ", current_utc.tm_hour)
            print("tm_min: ", current_utc.tm_min)
            # if current_utc.tm_hour == 0 and current_utc.tm_min < 5:
            logger.info("Attempting daily update")
            if perform_daily_update():
                logger.info("Daily update completed successfully")
            else:
                logger.warning("Daily update failed")
            
            # Hourly health check
            if current_utc.tm_min == 0:
                health_check()
            
            time.sleep(60)  # Check every minute
            
        except KeyboardInterrupt:
            logger.info("Service stopped by user")
            break
        except Exception as e:
            logger.exception(f"Critical runtime error: {str(e)}")
            send_alert(f"Oracle runtime crash: {str(e)}")
            time.sleep(300)  # Wait before restarting