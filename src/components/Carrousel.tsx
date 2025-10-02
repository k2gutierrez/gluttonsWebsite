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
import { Tokens, CurrentToken } from "./engine/atoms";
import { useAtom } from "jotai";
import * as base64js from 'base64-js';
import { Base64 } from 'js-base64';

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

    }, [blockNumber])

    useEffect(() => {

        getURI()

    }, [tokens.length])

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

        const gluttons_curtis = `https://api-curtis.reservoir.tools/users/${address}/tokens/v10?contract=${GluttonsCurtis}&sortDirection=asc&limit=200`
        const gluttons_ape = `https://api-apechain.reservoir.tools/users/${address}/tokens/v10?contract=${Gluttons}&sortDirection=asc&limit=200`
        //api-apechain
        let adrr = ""
        if (chainId == 33111) {
            adrr = gluttons_curtis
        } else {
            adrr = gluttons_ape
        }

        let tokensArr: Token[] = []

        const options = {
            method: 'GET',
            url: adrr,
            headers: { accept: '*/*', 'x-api-key': process.env.NEXT_PUBLIC_RESERVOIR }
        };

        axios
            .request(options)
            .then(res => {
                let data1 = res.data
                for (let i = 0; i < data1.tokens.length; i++) {
                    let info: Token = {
                        id: data1.tokens[i].token.tokenId,
                        url: "",
                        status: false
                    }
                    tokensArr.push(info)
                }
                setTokens(tokensArr)
            })
            .catch(err => console.error(err));
    }

    async function getURI() {
        let adrr = ""
        if (chainId == 33111) {
            adrr = GluttonsCurtis
        } else {
            adrr = Gluttons
        }

        const urlArr: Token[] = []

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
    }

    return (
        <>
            <div className="w-full max-w-6xl mx-auto px-4 py-8">
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
                        
                        <SwiperSlide className="" key={index} onClick={() => {
                                    currentToken.status = false
                                    data.status = true
                                    setCurrentToken(data)
                                }}>
                            <div className="h-28 w-28 overflow-hidden rounded-lg shadow-lg p-4">
                                
                                    <img
                                        src={"https://" + data.url}
                                        alt={`Slide ${index}`}
                                        className={data.status ? "w-full h-full object-cover border-4 border-solid border-blue-600 rounded-full" : "w-full h-full object-cover"}
                                    />
                            
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </>
    );
}