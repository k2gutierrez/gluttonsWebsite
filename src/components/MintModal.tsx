import { useEffect, useState } from "react";
import { useChainId, useConfig, useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { GluttonsCurtis, Gluttons } from "./engine/Constants";
import { GluttonsABI } from "./engine/GluttonsABI";
import Image from "next/image";
import { parseEther } from "viem";

export default function MintModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [numTokens, setNumTokens] = useState<string>("0")
    const [confirmed, setConfirmed] = useState(false)
    const { isConnected, address } = useAccount()
    const chainId = useChainId()
    const {data: hash , writeContract } = useWriteContract()
    const { isSuccess: isConfirmed, isError, isLoading } = useWaitForTransactionReceipt({ hash });

    const [message, setMessage] = useState(false)

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        setMessage(false)
        setConfirmed(false)
        setNumTokens("0")
    }

    const { data: petPrice, refetch } = useReadContract({
        abi: GluttonsABI,
        address: gluttonAddress() as `0x${string}`,
        functionName: 'getPetPrice',
        args: [Number(numTokens)],
    })

    function gluttonAddress() {
        let gluttonadr = ""
        if (chainId == 33111) {
            gluttonadr = GluttonsCurtis
        } else {
            gluttonadr = Gluttons
        }
        return gluttonadr
    }

    useEffect(() => {
        if (petPrice != undefined) {
            refetch()
        }

    }, [numTokens])

    useEffect(() => {
        if (isConfirmed) {
            setConfirmed(true)
        }
    }, [isConfirmed])

    const mintGlutton = () => {
        if (numTokens == "" || numTokens == "0"){
            return
        }
        
        writeContract({
            abi: GluttonsABI,
            address: gluttonAddress() as `0x${string}`,
            functionName: "mintPet",
            args: [Number(numTokens)],
            value: petPrice as bigint
        })
    }

    return (
        <div className="">
            {/*<button
                onClick={openModal}
                className={cls(styles.backColor, "px-4 py-2 text-white rounded hover:bg-red-600")}
            >
                Abrir Modal
            </button>*/}

            <button className="mintbuttondiv glutton" onClick={openModal}>
                <div className="text-block-2 p-2">MINT</div>
            </button>


            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center text-center justify-center">
                    <div className={"mx-8 p-6 rounded-lg shadow-lg w-96 transform transition-transform scale-95 hover:scale-100 bg-black bg-opacity-70"}>
                        <p className='text-md md:text-xl font-[family-name:var(--font-hogfish)]'>
                            Mint GlutOns
                        </p>
                        {confirmed && (<>
                            <p className='text-md md:text-xl text-blue-400 font-[family-name:var(--font-hogfish)]'>MINT SUCCESSFUL!</p>
                            <button
                                onClick={closeModal}
                                className={"py-1 px-2 my-4 rounded hover:bg-blue-600 border border-solid border-blue-400"}
                            >
                                <p>Close</p>

                            </button>
                        </>
                        )}
                        {!confirmed && !isLoading && (<><div className="">
                            <input type="number" value={numTokens} className="text-center text-black" onChange={(e) => setNumTokens((e.target.value))} />
                            <button
                                onClick={mintGlutton}
                                className={"px-3 py-2 my-4 rounded hover:bg-blue-600 border border-solid border-blue-400"}
                            >
                                <p>Mint GluttONS</p>

                            </button>
                        </div>
                            <button
                                onClick={closeModal}
                                className={"py-1 px-2 my-4 rounded hover:bg-red-600"}
                            >
                                <p>Close</p>

                            </button></>
                        )}
                        {isLoading &&
                            (
                                <div className="flex justify-center items-center">
                                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )
                        }
                    </div>
                </div>
            )}

        </div>
    );
}