import { useState, useEffect } from "react";
import { useChainId, useConfig, useAccount, useWriteContract, useReadContract } from "wagmi";
import { useAtom } from "jotai";
import Image from "next/image";

export default function MintModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [numTokens, setNumTokens] = useState(0)
    const { isConnected, address } = useAccount()
    const config = useConfig()
    const chainId = useChainId()

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(false)

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        setMessage(false)
    }

    async function mintGluttons() {

    }

    return (
        <div className="">
            {/*<button
                onClick={openModal}
                className={cls(styles.backColor, "px-4 py-2 text-white rounded hover:bg-red-600")}
            >
                Abrir Modal
            </button>*/}
            <div className="mintanotherglutton">
                      <button className="mintbuttondiv glutton" onClick={openModal}>
                        <div className="text-block-2">MINT</div>
                      </button>
                    </div>
            
            


            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center text-center justify-center">
                    <div className={"mx-8 p-6 rounded-lg shadow-lg w-96 transform transition-transform scale-95 hover:scale-100 bg-black bg-opacity-50"}>
                        <p className='text-md md:text-xl font-[family-name:var(--font-hogfish)]'>
                            Mint GlutOns
                        </p>
                            {message == true &&(<>
                            <Image src={"/assets/ClaimCAVA.jpg"} width={500} height={500} alt="Claimed Cava" />
                            <button
                                onClick={closeModal}
                                className={"py-1 px-2 my-4 rounded hover:bg-red-600"}
                            >
                                <p>Close</p>

                            </button>
                            </>
                            )}
                            {!loading && message == false &&(<><p className='my-3 text-md md:text-xl font-[family-name:var(--font-hogfish)]'>
                                HERO CAN CLAIM
                            </p>
                            
                            <p className='text-xs md:text-md font-[family-name:var(--font-pressura)]'>
                                {numTokens} CavaNFTs
                            </p></>)}
                            {!loading && message == false && (<><div>
                                <button
                                    onClick={mintGluttons}
                                    className={"px-3 py-2 my-4 rounded hover:bg-red-600"}
                                >
                                    <p>Claim Cava NFTs</p>

                                </button>
                            </div>
                            <button
                                onClick={closeModal}
                                className={"py-1 px-2 my-4 rounded hover:bg-red-600"}
                            >
                                <p>Close</p>

                            </button></>
                        )}
                        {loading &&
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