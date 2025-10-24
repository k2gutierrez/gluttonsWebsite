// Works in both a Webapp (browser) or Node.js:
import { SequenceIndexer } from '@0xsequence/indexer'
import { Gluttons, GluttonsCurtis, GluttonsFood, GluttonsFoodCurtis } from './Constants'

export async function GetTokens(chainId: number, address: `0x${string}`) {
    let url = ""
    let contract = ""

    if (chainId == 33111) {
        url = "https://apechain-testnet-indexer.sequence.app"// curtis
        contract = GluttonsCurtis
    } else if (chainId == 33139) {
        url = "https://apechain-indexer.sequence.app" // apechain
        contract = Gluttons
    }

    const client = new SequenceIndexer(url, process.env.SEQUENCER)

    const omitMetadata = true;

    // Fetch token balances details for any wallet
    const result = await client.getTokenBalancesDetails({
        omitMetadata: true,
        filter: {
            contractWhitelist: [
                contract
            ],
            accountAddresses: [
                address
            ],
            omitNativeBalances: false,
        }
    });

    console.log('Result:', result.balances);
    return result.balances
    
}

export async function GetTokensFood(chainId: number, address: `0x${string}`) {
    let url = ""
    let contract = ""

    if (chainId == 33111) {
        url = "https://apechain-testnet-indexer.sequence.app"// curtis
        contract = GluttonsFoodCurtis
    } else if (chainId == 33139) {
        url = "https://apechain-indexer.sequence.app" // apechain
        contract = GluttonsFood
    }

    const client = new SequenceIndexer(url, process.env.SEQUENCER)

    const omitMetadata = true;

    // Fetch token balances details for any wallet
    const result = await client.getTokenBalancesDetails({
        omitMetadata: true,
        filter: {
            contractWhitelist: [
                contract
            ],
            accountAddresses: [
                address
            ],
            omitNativeBalances: false,
        }
    });

    console.log('Result:', result.balances);
    return result.balances
    
}