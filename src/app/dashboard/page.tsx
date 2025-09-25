"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId, useReadContract, useConfig, useWriteContract, useBlockNumber } from "wagmi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GluttonsABI } from "@/components/engine/GluttonsABI";
import { GluttonsFoodABI } from "@/components/engine/GluttonsFoodABI";
import { GluttonsCurtis, GluttonsFood, Gluttons, GluttonsFoodCurtis } from "@/components/engine/Constants";
import Carrousel from "@/components/Carrousel";
import { useAtom } from "jotai";
import { CurrentToken } from "@/components/engine/atoms";
import axios from "axios";

export default function Dashboard() {

  const { writeContract } = useWriteContract()
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const router = useRouter()
  const config = useConfig()
  let petFed: boolean = false
  let Petprice: number
  const { data: blockNumber } = useBlockNumber({ watch: true })
  const [currentToken, setCurrentToken] = useAtom(CurrentToken)
  const [tokens, setTokens] = useState<number[]>([])
  let tVotes: number = 0

  const { data: vote, refetch: hasVote } = useReadContract({
    abi: GluttonsABI,
    address: gluttonAddress() as `0x${string}`,
    functionName: 'checkIdTokenHasVoted',
    args: [Number(currentToken.id)],
  })

  useEffect(() => {
    r1()
    r2()
    r3()
    sup()
    Totalvotes()
  }, [blockNumber])

  useEffect(() => {
    refetch()
    hasVote()
  }, [currentToken.id])

  function gluttonAddress() {
    let gluttonadr = ""
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
  }

  const { data: petPrice } = useReadContract({
    abi: GluttonsABI,
    address: gluttonAddress() as `0x${string}`,
    functionName: 'getPetPrice',
  })

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

  const { data: foodSupply, refetch: sup } = useReadContract({
    abi: GluttonsFoodABI,
    address: gluttonFoodAddress() as `0x${string}`,
    functionName: 'totalSupply',
  })

  useEffect(() => {
    getGluttonsFood()
  }, [foodSupply])

  const mintGlutton = () => {
    writeContract({
      abi: GluttonsABI,
      address: gluttonAddress() as `0x${string}`,
      functionName: "mintPet",
      args: [1],
      value: petPrice as bigint,
    })
  }

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
    setTimeout(() => {
      refetch()
    }, 5000)
    
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
    <main className="body-2">
      <div className="page-wrapper">
        <div className="wrapper-background">
          <div data-w-id="a3aae2fb-7592-0a37-8c2c-a0862f803e63" className="layer-0-chest---wrapper dashboardchest"><img src="/images/TesoroCompleto.png" loading="lazy" sizes="(max-width: 2029px) 100vw, 2029px" srcSet="/images/TesoroCompleto-p-500.png 500w, images/TesoroCompleto-p-800.png 800w, images/TesoroCompleto-p-1080.png 1080w, images/TesoroCompleto-p-1600.png 1600w, images/TesoroCompleto-p-2000.png 2000w, images/TesoroCompleto.png 2029w" alt="" className="layer-0-chest" /></div>
          <div data-w-id="4ea5c633-52ff-02ae-9e5b-007358219948" className="layer-1-left---wrapper"><img src="/images/LeftStoneTexture.png" loading="lazy" sizes="(max-width: 2029px) 100vw, 2029px" srcSet="/images/LeftStoneTexture-p-500.png 500w, images/LeftStoneTexture-p-800.png 800w, images/LeftStoneTexture-p-1080.png 1080w, images/LeftStoneTexture-p-1600.png 1600w, images/LeftStoneTexture-p-2000.png 2000w, images/LeftStoneTexture.png 2029w" alt="" className="layer-1-left-stone" /></div>
          <div data-w-id="7c9c1be1-8282-6390-2521-8ef1dc697d9a" className="layer-1-right---wrapper"><img src="/images/RightStoneTexture.png" loading="lazy" sizes="(max-width: 2029px) 100vw, 2029px" srcSet="/images/RightStoneTexture-p-500.png 500w, images/RightStoneTexture-p-800.png 800w, images/RightStoneTexture-p-1080.png 1080w, images/RightStoneTexture-p-1600.png 1600w, images/RightStoneTexture-p-2000.png 2000w, images/RightStoneTexture.png 2029w" alt="" className="layer-1-right-stone" /></div>
          <div data-w-id="dc5caad2-4c4b-df84-23ec-eb38be9d0261" className="layer-4-cave---wrapper"><img src="/images/FondoGluttons.png" loading="lazy" sizes="(max-width: 2029px) 100vw, 2029px" srcSet="/images/FondoGluttons-p-500.png 500w, images/FondoGluttons-p-800.png 800w, images/FondoGluttons-p-1080.png 1080w, images/FondoGluttons-p-1600.png 1600w, images/FondoGluttons-p-2000.png 2000w, images/FondoGluttons.png 2029w" alt="" className="layer-4-cave-background" /></div>
        </div>
        <div data-animation="default" data-collapse="medium" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" className="navbar w-nav">
          <div className="w-container">
            <a href="/" className="brand-2 w-nav-brand"><img src="/images/GluttonLogo.png" loading="lazy" sizes="(max-width: 767px) 98vw, (max-width: 991px) 727.984375px, 939.9921875px" srcSet="/images/GluttonLogo-p-500.png 500w, images/GluttonLogo-p-800.png 800w, images/GluttonLogo-p-1080.png 1080w, images/GluttonLogo-p-1600.png 1600w, images/GluttonLogo-p-2000.png 2000w, images/GluttonLogo.png 2134w" alt="" className="image-4" /></a>
            <nav role="navigation" className="nav-menu w-nav-menu flex items-center">
              <a data-w-id="c5a8553d-372c-851a-69d1-9575243e2090" href="/" className="nav-link w-nav-link">MINT</a>
              <a data-w-id="c5a8553d-372c-851a-69d1-9575243e2092" href="/wtf" className="nav-link-2 w-nav-link">RULES</a>
              <div className="nav-link-2 w-nav-link"><ConnectButton label="ConNECT" /></div>
              {/*<a data-w-id="c5a8553d-372c-851a-69d1-9575243e2094" href="dashboard.html" aria-current="page" className="nav-link-3 w-nav-link w--current">ConNECT</a>*/}
            </nav>
            <div className="menu-ham w-nav-button">
              <div className="w-icon-nav-menu"></div>
            </div>
          </div>
        </div>
        <div className="game-wrapper wtf">
          <div className="state1 wtf-text">
            <div className="section1wtf dashboard">
              <div className="state1-text wtf-text">FEED OR BURN</div>
              <div className="state1-text general">Feed your Glutt-On today. <br />Miss it, and you&#x27;re out.</div>
              <div className="_3stepplan">
                <div className="steps">
                  <div className="stepstext">1.BUY FOOD<br /></div>
                </div>
                <div className="steps">
                  <div className="stepstext">2.FEED</div>
                </div>
                <div className="steps">
                  <div className="stepstext">3.REPEAT </div>
                </div>
              </div>
            </div>
            <div className="divgamestatus">
              <div className="div-gamestatus2">
                <div className="pooldashboard">
                  <div className="titlestextdashboard">ALIVE</div>
                  <div className="divamountpool">
                    <div className="textpool">{alivePetCount ? String(Number(alivePetCount)) : "0"}</div>
                  </div>
                </div>
                <div className="pooldashboard">
                  <div className="titlestextdashboard">PRIZE POOL</div>
                  <div className="divamountpool">
                    <div className="textpool">{realPool}</div>
                    <div className="textpool">APE</div>
                  </div>
                </div>
                <div id="w-node-_9e032da3-e1e3-1095-a489-fc8634a1e5dc-74d14479" className="pooldashboard">
                  <div className="titlestextdashboard">BURNED</div>
                  <div className="divamountpool">
                    <div className="textpool">{alivePetCount ? String(Number(totalMinted) - Number(alivePetCount)) : "0"}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard">
              <div className="foodinventory">
                <div className="divtitle">
                  <div className="titlerules">My Glutt-On</div>
                </div>
                <div className="gluttonsinventory">
                  <div className="divfood glutqt">
                    <div className="divcarrouselgluttons">
                      <Carrousel />
                      {/*<div className="divimages gluttonsimg"><img src="images/984.png" loading="lazy" sizes="(max-width: 1999px) 100vw, 1999px" srcSet="images/984-p-500.png 500w, images/984-p-800.png 800w, images/984-p-1080.png 1080w, images/984-p-1600.png 1600w, images/984.png 1999w" alt="" className="image-5 glutimage" /></div>
                      <div className="divimages gluttonsimg"><img src="images/983.png" loading="lazy" sizes="(max-width: 1999px) 100vw, 1999px" srcSet="images/983-p-500.png 500w, images/983-p-800.png 800w, images/983-p-1080.png 1080w, images/983-p-1600.png 1600w, images/983.png 1999w" alt="" className="image-5 glutimage" /></div>
                      <div className="divimages gluttonsimg"><img src="images/992.png" loading="lazy" sizes="(max-width: 1999px) 100vw, 1999px" srcSet="images/992-p-500.png 500w, images/992-p-800.png 800w, images/992-p-1080.png 1080w, images/992-p-1600.png 1600w, images/992.png 1999w" alt="" className="image-5 glutimage" /></div>
                      <div className="divimages gluttonsimg"><img src="images/985.png" loading="lazy" sizes="(max-width: 1999px) 100vw, 1999px" srcSet="images/985-p-500.png 500w, images/985-p-800.png 800w, images/985-p-1080.png 1080w, images/985-p-1600.png 1600w, images/985.png 1999w" alt="" className="image-5 glutimage" /></div>
                      <div className="divimages gluttonsimg"><img src="images/950.png" loading="lazy" sizes="(max-width: 1999px) 100vw, 1999px" srcSet="images/950-p-500.png 500w, images/950-p-800.png 800w, images/950-p-1080.png 1080w, images/950-p-1600.png 1600w, images/950.png 1999w" alt="" className="image-5 glutimage" /></div>*/}
                    </div>
                    <div className="mintanotherglutton">
                      <button className="mintbuttondiv glutton" onClick={mintGlutton}>
                        <div className="text-block-2">MINT</div>
                      </button>
                    </div>
                  </div>
                  <div className="divglutselected">
                    <div className="divmainglutton">
                      {currentToken?.id == "" ? (<div className="divimagemainglutton"><img src="/images/928.png" loading="lazy" sizes="(max-width: 1999px) 100vw, 1999px" srcSet="/images/928-p-500.png 500w, images/928-p-800.png 800w, images/928-p-1080.png 1080w, images/928-p-1600.png 1600w, images/928.png 1999w" alt="" className="mainimageglutton" /></div>) : (
                        <div className="divimagemainglutton"><img src={"https://" + currentToken?.url} loading="lazy" alt="" className="mainimageglutton" /></div>
                      )}
                    </div>
                    <div className="divgluttonstatus">
                      <div className="statusglutton">
                        <div className="statusinputs">
                          <div className="statustext">STATUS:</div>
                          <div className={petFed ? "fedtext" : "fedtext2"}>{petFed ? "FED" : "STARVING"}</div>
                        </div>
                      </div>
                      <div className="feedglutton">
                        <button className="mintbuttondiv feed" onClick={feedGlutton} disabled={petFed}>
                          <div className="text-block-2">{petFed ? "WAIT" : "FEED"}</div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="foodinventory">
                <div className="divtitle">
                  <div className="titlerules">Food Inventory</div>
                </div>
                <div className="div-block-10">
                  <div className="divfood">
                    <div className="divimages"><img src="/images/Glutton_Foodx7.png" loading="lazy" sizes="(max-width: 8534px) 100vw, 8534px" srcSet="/images/Glutton_Foodx7-p-500.png 500w, images/Glutton_Foodx7-p-800.png 800w, images/Glutton_Foodx7-p-1080.png 1080w, images/Glutton_Foodx7-p-1600.png 1600w, images/Glutton_Foodx7-p-2000.png 2000w, images/Glutton_Foodx7-p-2600.png 2600w, images/Glutton_Foodx7-p-3200.png 3200w, images/Glutton_Foodx7.png 8534w" alt="" className="image-5" />
                      <div className="div-block-13">
                        <button className="mintbuttondiv" onClick={mintWeek}>
                          <div className="text-block-2">MINT</div>
                        </button>
                      </div>
                    </div>
                    <div className="divimages"><img src="/images/Glutton_Foodx14.png" loading="lazy" sizes="(max-width: 8534px) 100vw, 8534px" srcSet="/images/Glutton_Foodx14-p-500.png 500w, images/Glutton_Foodx14-p-800.png 800w, images/Glutton_Foodx14-p-1080.png 1080w, images/Glutton_Foodx14-p-1600.png 1600w, images/Glutton_Foodx14-p-2000.png 2000w, images/Glutton_Foodx14-p-2600.png 2600w, images/Glutton_Foodx14-p-3200.png 3200w, images/Glutton_Foodx14.png 8534w" alt="" className="image-5" />
                      <div className="div-block-13">
                        <button className="mintbuttondiv" onClick={mintMonth}>
                          <div className="text-block-2">MINT</div>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="divfood secondpart">
                    <div className="divseparation">
                      <div className="divfoodinfo">
                        <div className="textinputs">FOOD:  </div>
                        <div className="text-block-3">{tokens.length == 0 ? "0" : tokens.length}</div>
                      </div>
                      <div className="mintbuttondiv burnfood">
                        <div className="text-block-2">{"Total vote: " + tVotes}</div>
                      </div>
                    </div>
                    <div className="divseparation">
                      <div className="divtitle status">
                        <div className="titlerules">Vote Status</div>
                      </div>
                      <div className="divstatuschange">
                        <div className="divstatuscheck">
                          <div className={vote ? "fedtext" : "fedtext2"}>{vote ? "TRUE" : "FALSE"}</div>
                        </div>
                        <div className="divstatuscheck">
                          <div className="splitdecision">
                            <button className="splitbutton" onClick={castVoteTrue}>
                              <div className="textsplit">Vote to Split</div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
