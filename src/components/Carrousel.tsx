"use client"

import Image from "next/image";
import { useAccount, useReadContract, useChainId, useConfig, useBlockNumber } from "wagmi";
import { useEffect, useState } from "react";
import axios from "axios";
import { GluttonsABI } from "@/components/engine/GluttonsABI";
import { GluttonsCurtis, Gluttons } from "@/components/engine/Constants";
import { readContract, waitForTransactionReceipt } from "@wagmi/core"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/swiper-bundle.css'
import { Tokens, CurrentToken } from "./engine/atoms";
import { useAtom } from "jotai";
import { GetTokens } from "./engine/GetTokens";

export default function Carrousel() {

    interface Token {
        id: string
        url: string
        status: boolean
    }

    const [error, setError] = useState('');
    const [currentToken, setCurrentToken] = useAtom(CurrentToken)
    const [tokensAtom, setTokenAtom] = useAtom(Tokens)
    const [tokens, setTokens] = useState<Token[]>([])
    const { address, isConnected } = useAccount()
    const chainId = useChainId()
    const config = useConfig()
    const { data: blockNumber } = useBlockNumber({ watch: true })

    const { data: alivePetCount, refetch } = useReadContract({
        abi: GluttonsABI,
        address: gluttonAddress() as `0x${string}`,
        functionName: 'getAlivePetCount',
    })

    const { data: lastReaperCall, refetch: reaper } = useReadContract({
        abi: GluttonsABI,
        address: gluttonAddress() as `0x${string}`,
        functionName: 'getlastReaperCall',
    })

    useEffect(() => {
        if (isConnected && address != undefined) {
            getGluttons()
            getURI()
        }
    }, [isConnected, chainId, address])

    useEffect(() => {
        getGluttons()
    }, [alivePetCount])

    useEffect(() => {
        refetch()
        reaper()

    }, [blockNumber])

    useEffect(() => {

        getURI()
        setCurrentToken({ id: "", url: "", status: false })

    }, [tokens.length, lastReaperCall])

    function gluttonAddress() {
        let gluttonadr = ""
        if (chainId == 33111) {
            gluttonadr = GluttonsCurtis
        } else {
            gluttonadr = Gluttons
        }
        return gluttonadr
    }

    async function getGluttons() {

        let tokensArr: Token[] = []

        try {
            const data1 = await GetTokens(chainId, address as `0x${string}`)

            for (let i = 0; i < data1.length; i++) {
                let info: Token = {
                    id: data1[i].tokenID as string,
                    url: "",
                    status: false
                }
                tokensArr.push(info)
            }
            setTokens(tokensArr)
        } catch(e) {
            console.error(e)
        }
    }

    async function getURI() {
        let adrr = ""
        if (chainId == 33111) {
            adrr = GluttonsCurtis
        } else {
            adrr = Gluttons
        }

        const urlArr: Token[] = []

        try {

            for (let i = 0; i < tokens.length; i++) {
                const result = await readContract(config, {
                    abi: GluttonsABI,
                    address: adrr as `0x${string}`,
                    functionName: 'tokenURI',
                    args: [Number(tokens[i].id)]
                })

                const options = {
                    method: 'GET',
                    url: result as string,
                    headers: { accept: '*/*' }
                };

                axios
                    .request(options)
                    .then(res => {
                        let data1 = res.data
                        let info: Token = {
                            id: tokens[i].id,
                            url: data1.image,
                            status: false
                        }
                        urlArr.push(info)
                    })
                    .catch(err => console.error(err));

            }
            setTokenAtom(urlArr)

        } catch (e) {
            console.error(e)
        }
    }

    return (
        <>

            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={1}
                slidesPerView={4}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 4,
                    },
                }}
                navigation={true}
                pagination={true}

                className="mySwiper"
            >
                {
                    tokensAtom.map((data, index) => (

                        <SwiperSlide className="cursor-pointer" key={index} onClick={() => {
                            currentToken.status = false
                            data.status = true
                            setCurrentToken(data)
                        }}>


                            <img
                                src={"https://" + data.url}
                                alt={`Slide ${index}`}
                                className={data.status ? "w-full h-full object-cover border-4 border-solid border-blue-600 rounded-full" : "w-full h-full object-cover"}
                            />


                        </SwiperSlide>
                    ))}
            </Swiper>

        </>
    );
}