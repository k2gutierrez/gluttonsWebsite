"use client"

import { useAccount, useChainId, useReadContract, useWriteContract, useBlockNumber, useWatchContractEvent } from "wagmi";
import { useEffect, useState } from "react";
import { GluttonsABI } from "@/components/engine/GluttonsABI";
import { GluttonsFoodABI } from "@/components/engine/GluttonsFoodABI";
import { GluttonsCurtis, GluttonsFood, Gluttons, GluttonsFoodCurtis } from "@/components/engine/Constants";
import Carrousel from "@/components/Carrousel";
import { useAtom } from "jotai";
import { CurrentToken } from "@/components/engine/atoms";
import axios from "axios";
import Header from "@/components/Header";
import MintModal from "@/components/MintModal";

export default function Dashboard() {

  const { writeContract } = useWriteContract()
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  let petFed: boolean = false
  let petTimesFed: number = 0
  const { data: blockNumber } = useBlockNumber({ watch: true })
  const [currentToken, setCurrentToken] = useAtom(CurrentToken)
  const [buttonClick, setButtonClick] = useState(false)
  const [tokens, setTokens] = useState<number[]>([])
  let tVotes: number = 0
  let voteChecked = false

  const { data: gameStatus, refetch: gluttonsGameStatus } = useReadContract({
    abi: GluttonsABI,
    address: gluttonAddress() as `0x${string}`,
    functionName: 'getGameActiveStatus',
  })

  const { data: foodSupply, refetch: sup } = useReadContract({
    abi: GluttonsFoodABI,
    address: gluttonFoodAddress() as `0x${string}`,
    functionName: 'totalSupply',
  })

  const { data: vote, refetch: hasVote } = useReadContract({
    abi: GluttonsABI,
    address: gluttonAddress() as `0x${string}`,
    functionName: 'checkIdTokenHasVoted',
    args: [Number(currentToken.id)],
  })

  if (vote == true) {
    voteChecked = true
  }

  useEffect(() => {
    if (currentToken.id == "") {
      setButtonClick(false)
    } else {
      setButtonClick(true)
    }
  }, [currentToken.id])

  useEffect(() => {
    r1()
    r2()
    r3()
    sup()
    Totalvotes()
    hasVote()
    gluttonsGameStatus()
  }, [blockNumber])

  useEffect(() => {
    refetch()

  }, [currentToken.id, foodSupply])

  function gluttonAddress() {
    let gluttonadr = GluttonsCurtis
    if (chainId == 33111) {
      gluttonadr = GluttonsCurtis
    } else {
      gluttonadr = Gluttons
    }
    return gluttonadr
  }

  function gluttonFoodAddress() {
    let gluttonadr = ""
    if (chainId == 33111) {
      gluttonadr = GluttonsFoodCurtis
    } else {
      gluttonadr = GluttonsFood
    }
    return gluttonadr
  }

  const { data: pool, refetch: r1 } = useReadContract({
    abi: GluttonsABI,
    address: gluttonAddress() as `0x${string}`,
    functionName: 'getTotalPrizePool',
  })

  const realPool = String((Number(pool) / 1000000000000000000).toFixed(2))

  const { data: alivePetCount, refetch: r2 } = useReadContract({
    abi: GluttonsABI,
    address: gluttonAddress() as `0x${string}`,
    functionName: 'getAlivePetCount',
  })

  const { data: totalMinted, refetch: r3 } = useReadContract({
    abi: GluttonsABI,
    address: gluttonAddress() as `0x${string}`,
    functionName: 'getTotalMinted',
  })

  interface Pet {
    fed: boolean,
    alive: boolean,
    timesFed: number,
    claim: boolean
  }

  const { data: petInfo, refetch } = useReadContract({
    abi: GluttonsABI,
    address: gluttonAddress() as `0x${string}`,
    functionName: 'getPetInfo',
    args: [Number(currentToken.id)],

  })

  if (petInfo != undefined) {
    const { fed, alive, timesFed, claim } = petInfo as Pet
    petFed = fed
    petTimesFed = Number(timesFed)
  }

  const { data: totalVotes, refetch: Totalvotes } = useReadContract({
    abi: GluttonsABI,
    address: gluttonAddress() as `0x${string}`,
    functionName: 'getTotalVotes',
  })

  if (totalVotes != undefined) {
    tVotes = Number(totalVotes)
  }

  const { data: foodWeekPrice } = useReadContract({
    abi: GluttonsFoodABI,
    address: gluttonFoodAddress() as `0x${string}`,
    functionName: 'getFoodPrice7Pack',
  })

  const { data: foodMonthPrice } = useReadContract({
    abi: GluttonsFoodABI,
    address: gluttonFoodAddress() as `0x${string}`,
    functionName: 'getFoodPrice30Pack',
  })

  useEffect(() => {
    getGluttonsFood()
  }, [foodSupply])

  useEffect(() => {
    if (gameStatus) {
      getGluttonsFood()
    }
  }, [gameStatus])

  const mintWeek = () => {
    writeContract({
      abi: GluttonsABI,
      address: gluttonAddress() as `0x${string}`,
      functionName: "buyFoodPackWeek",
      args: [address],
      value: foodWeekPrice as bigint,
    })
  }

  const mintMonth = () => {
    writeContract({
      abi: GluttonsABI,
      address: gluttonAddress() as `0x${string}`,
      functionName: "buyFoodPackMonth",
      args: [address],
      value: foodMonthPrice as bigint,
    })
  }

  const castVoteTrue = () => {
    writeContract({
      abi: GluttonsABI,
      address: gluttonAddress() as `0x${string}`,
      functionName: "castVote",
      args: [true, Number(currentToken.id)],
    })
    hasVote()
  }

  const feedGlutton = () => {
    writeContract({
      abi: GluttonsABI,
      address: gluttonAddress() as `0x${string}`,
      functionName: "feedPet",
      args: [address, Number(currentToken.id), tokens[0]],
    })

  }

  async function getGluttonsFood() {

    const gluttons_curtis = `https://api-curtis.reservoir.tools/users/${address}/tokens/v10?contract=${GluttonsFoodCurtis}&sortDirection=asc&limit=200`
    const gluttons_ape = `https://api-apechain.reservoir.tools/users/${address}/tokens/v10?contract=${GluttonsFood}&sortDirection=asc&limit=200`
    //api-apechain
    let adrr = ""
    if (chainId == 33111) {
      adrr = gluttons_curtis
    } else {
      adrr = gluttons_ape
    }

    const options = {
      method: 'GET',
      url: adrr,
      headers: { accept: '*/*', 'x-api-key': process.env.NEXT_PUBLIC_RESERVOIR }
    };

    axios
      .request(options)
      .then(res => {
        let tokensArr: number[] = []
        let data1 = res.data
        for (let i = 0; i < data1.tokens.length; i++) {
          tokensArr.push(data1.tokens[i].token.tokenId)
        }
        setTokens(tokensArr)
      })
      .catch(err => console.error(err));
  }

  return (
    // Body container: full screen, hidden overflow, dark background
    <main className="relative min-h-screen w-full overflow-hidden bg-[#08121a] font-sans text-white">
      {/* Background Image Wrapper: Uses -z-10 to sit behind content */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Each image is absolutely positioned, mimicking the original layers */}
        <img src="/images/TesoroCompleto.png" loading="lazy" alt="" className="absolute inset-0 w-full h-full object-contain object-bottom opacity-50 md:opacity-100" />
        <img src="/images/LeftStoneTexture.png" loading="lazy" alt="" className="absolute bottom-0 left-0 w-full h-full object-fill opacity-30 md:opacity-100" />
        <img src="/images/RightStoneTexture.png" loading="lazy" alt="" className="absolute bottom-0 right-0 w-full h-full object-fill opacity-30 md:opacity-100" />
        <img src="/images/FondoGluttons.png" loading="lazy" alt="" className="absolute inset-0 w-full h-full object-cover" />
      </div>

      <Header />

      {/* Main Game Wrapper: Relative, scrolls on mobile, padded from top for header */}
      <div className="relative w-full h-screen overflow-y-auto px-2 pb-8 pt-24 md:px-4 lg:px-8 lg:pt-28">
        
        {gameStatus === true ? (
          <div className="max-w-7xl mx-auto flex flex-col gap-4 md:gap-6">
            {/* Section 1: Title and 3-step plan */}
            <section className="flex flex-col items-center text-center gap-3 md:gap-4">
              <h1 className="text-3xl md:text-5xl font-bold uppercase text-shadow-lg text-blue-300">FEED OR BURN</h1>
              <p className="text-base md:text-xl text-gray-200">
                Feed your Glutt-On today. <br className="md:hidden" />Miss it, and you're out.
              </p>
              <div className="flex justify-center gap-2 md:gap-4">
                {['1. BUY FOOD', '2. FEED', '3. REPEAT'].map((text) => (
                  <div key={text} className="bg-black/30 border border-blue-500/50 rounded-lg px-3 py-2 md:px-5 md:py-3">
                    <span className="text-blue-300 text-xs md:text-base font-semibold">{text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Game Status Indicators */}
            <section className="grid grid-cols-3 gap-2 md:gap-6">
              {[
                { title: "ALIVE", value: alivePetCount ? String(Number(alivePetCount)) : "0", unit: "" },
                { title: "PRIZE POOL", value: realPool, unit: "APE" },
                { title: "BURNED", value: (alivePetCount && totalMinted) ? String(Number(totalMinted) - Number(alivePetCount)) : "0", unit: "" }
              ].map((item) => (
                <div key={item.title} className="bg-black/30 border border-blue-500/50 rounded-lg p-3 md:p-4 flex flex-col items-center gap-1 shadow-lg shadow-blue-900/20">
                  <h2 className="text-blue-300 text-sm md:text-base font-semibold uppercase">{item.title}</h2>
                  <div className="flex items-baseline gap-1 md:gap-2">
                    <span className="text-xl md:text-3xl font-bold">{item.value}</span>
                    {item.unit && <span className="text-sm md:text-base text-gray-400">{item.unit}</span>}
                  </div>
                </div>
              ))}
            </section>

            {/* Main Dashboard: 1 column on mobile, 2 on large screens */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              
              {/* Column 1: My Glutt-On */}
              <div className={"panelClasses"}>
                <h2 className={"titleBoxClasses"}>My Glutt-On</h2>
                
                {/* Gluttons Inventory: Carousel + Mint Button */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-grow rounded-lg overflow-hidden">
                    <Carrousel />
                  </div>
                  <div className="flex-shrink-0 flex items-center justify-center">
                    <MintModal />
                  </div>
                </div>

                {/* Selected Glutton Status */}
                <div className="border border-blue-500/50 rounded-lg p-3 md:p-4 flex flex-col md:flex-row gap-4">
                  <div className="flex-1 aspect-square bg-black/20 rounded-lg flex items-center justify-center">
                    {currentToken?.id === "" ? (
                      <span className="text-gray-400 text-lg">SELECT YOUR GLUTTON</span>
                    ) : (
                      <img src={`https://${currentToken?.url}`} loading="lazy" alt={`Glutton #${currentToken.id}`} className="w-full h-full object-cover rounded-lg" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between gap-4">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-lg text-blue-300">ID: <span className="text-white font-semibold">{currentToken.id === "" ? "N/A" : currentToken.id}</span></span>
                      <span className="text-lg text-blue-300">Times Fed: <span className="text-white font-semibold">{petTimesFed}</span></span>
                      <div className="text-2xl font-bold">
                        {petFed ? (
                          <span className="text-green-400">FED</span>
                        ) : (
                          <span className="text-red-500">STARVING</span>
                        )}
                      </div>
                    </div>
                    <button 
                      className={"btnBlue"}
                      onClick={feedGlutton} 
                      disabled={!buttonClick || petFed}
                    >
                      {petFed ? "WAIT" : "FEED"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Column 2: Food Inventory */}
              <div className={"panelClasses"}>
                <h2 className={"titleBoxClasses"}>Food Inventory</h2>
                
                {/* Mint Food Packs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Weekly Pack */}
                  <div className="flex flex-col items-center gap-3 bg-black/20 border border-blue-500/30 p-4 rounded-lg">
                    <img src="/images/Glutton_Foodx7.png" loading="lazy" alt="Weekly Food Pack" className="w-full max-w-[200px] h-auto object-contain" />
                    <button className={"btnGreen"} onClick={mintWeek}>MINT WEEKLY</button>
                  </div>
                  {/* Monthly Pack */}
                  <div className="flex flex-col items-center gap-3 bg-black/20 border border-blue-500/30 p-4 rounded-lg">
                    <img src="/images/Glutton_Foodx14.png" loading="lazy" alt="Monthly Food Pack" className="w-full max-w-[200px] h-auto object-contain" />
                    <button className={"btnGreen"} onClick={mintMonth}>MINT MONTHLY</button>
                  </div>
                </div>

                {/* Food & Vote Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Food Count */}
                  <div className="flex flex-col items-center justify-center gap-3 border border-blue-500/50 rounded-lg p-4">
                    <div className="text-lg text-blue-300">FOOD: <span className="text-xl text-white font-bold">{tokens.length}</span></div>
                    <div className="bg-black/30 border border-blue-500/50 rounded-lg px-4 py-2 text-blue-300 text-sm">
                      Total Votes: <span className="font-bold text-white">{tVotes}</span>
                    </div>
                  </div>
                  
                  {/* Vote Status */}
                  <div className="flex flex-col items-center justify-center gap-3 border border-blue-500/50 rounded-lg p-4">
                    <h3 className="text-lg text-blue-300">Vote Status</h3>
                    <div className="flex items-center justify-around gap-4 w-full">
                      <div className="text-2xl font-bold">
                        {vote ? (
                          <span className="text-green-400">TRUE</span>
                        ) : (
                          <span className="text-red-500">FALSE</span>
                        )}
                      </div>
                      {!voteChecked && (
                        <button 
                          className={`${"btnRed"} flex-1 py-2 text-sm`}
                          onClick={castVoteTrue} 
                          disabled={!buttonClick}
                        >
                          Vote to Split
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </section>
          </div>
        ) : (
          // Game Ended State
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-8 p-4">
            <h1 className="text-4xl md:text-6xl text-white font-bold text-center">Gluttons Game</h1>
            <div className="bg-black/30 border border-red-500 rounded-lg p-6 md:p-10 shadow-lg shadow-red-900/30">
              <span className="text-red-400 text-3xl md:text-5xl font-semibold">Ended</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

