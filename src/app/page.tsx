"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract } from "wagmi";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ActualAddress, ActualChainId } from "@/components/engine/Constants";
import { GluttonsABI } from "@/components/engine/GluttonsABI";
import Header from "@/components/Header";

export default function Home() {

  const { isConnected } = useAccount()
  const router = useRouter()

  const {data: pool} = useReadContract({
    abi: GluttonsABI,
    address: ActualAddress,
    functionName: 'getTotalPrizePool',
    chainId: ActualChainId
  })

  const {data: supply} = useReadContract({
    abi: GluttonsABI,
    address: ActualAddress,
    functionName: 'getTotalMinted',
    chainId: ActualChainId
  })

  const realPool = (Number(pool) / 1000000000000000000).toFixed(2)

  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard")
    }
  }, [isConnected])

  /*useEffect(() => {

    document.addEventListener("DOMContentLoaded", function () {
    const countdownTarget = new Date(Date.now() + 100 * 60 * 60 * 1000); // 100 hours
    const countdownElement = document.querySelector<HTMLElement>('.countdown-text');
    function updateCountdown() {
      const now = new Date().getTime();
      const distance = Number(countdownTarget) - now;
      const hours = String(Math.floor(distance / (1000 * 60 * 60))).padStart(2, '0');
      const minutes = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
      const seconds = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
      if (countdownElement) {
        countdownElement.innerText = `⏳ ${hours}:${minutes}:${seconds}`;
      }
      if (distance <= 0 && countdownElement != null) {
        countdownElement.innerText = "🔥 Time’s up.";
        clearInterval(timer);
      }
    }
    const timer = setInterval(updateCountdown, 1000);
  });

  }, [])

  function addEvent() {
    const countdownTarget = new Date(Date.now() + 100 * 60 * 60 * 1000); // 100 hours
    const countdownElement = document.querySelector<HTMLElement>('.countdown-text');
    function updateCountdown() {
      const now = new Date().getTime();
      const distance = Number(countdownTarget) - now;
      const hours = String(Math.floor(distance / (1000 * 60 * 60))).padStart(2, '0');
      const minutes = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
      const seconds = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
      if (countdownElement) {
        countdownElement.innerText = `⏳ ${hours}:${minutes}:${seconds}`;
      }
      if (distance <= 0 && countdownElement != null) {
        countdownElement.innerText = "🔥 Time’s up.";
        clearInterval(timer);
      }
    }
    const timer = setInterval(updateCountdown, 1000);
  }*/

  return (
    <main className="body-2">
      
      <div className="page-wrapper">
        <div className="wrapper-background">
          <div data-w-id="a3aae2fb-7592-0a37-8c2c-a0862f803e63" className="layer-0-chest---wrapper"><img src="/images/TesoroCompleto.png" loading="lazy" sizes="(max-width: 2029px) 100vw, 2029px" srcSet="/images/TesoroCompleto-p-500.png 500w, images/TesoroCompleto-p-800.png 800w, images/TesoroCompleto-p-1080.png 1080w, images/TesoroCompleto-p-1600.png 1600w, images/TesoroCompleto-p-2000.png 2000w, images/TesoroCompleto.png 2029w" alt="" className="layer-0-chest" /></div>
          <div data-w-id="4ea5c633-52ff-02ae-9e5b-007358219948" className="layer-1-left---wrapper"><img src="/images/LeftStoneTexture.png" loading="lazy" sizes="(max-width: 2029px) 100vw, 2029px" srcSet="/images/LeftStoneTexture-p-500.png 500w, images/LeftStoneTexture-p-800.png 800w, images/LeftStoneTexture-p-1080.png 1080w, images/LeftStoneTexture-p-1600.png 1600w, images/LeftStoneTexture-p-2000.png 2000w, images/LeftStoneTexture.png 2029w" alt="" className="layer-1-left-stone" /></div>
          <div data-w-id="7c9c1be1-8282-6390-2521-8ef1dc697d9a" className="layer-1-right---wrapper"><img src="/images/RightStoneTexture.png" loading="lazy" sizes="(max-width: 2029px) 100vw, 2029px" srcSet="/images/RightStoneTexture-p-500.png 500w, images/RightStoneTexture-p-800.png 800w, images/RightStoneTexture-p-1080.png 1080w, images/RightStoneTexture-p-1600.png 1600w, images/RightStoneTexture-p-2000.png 2000w, images/RightStoneTexture.png 2029w" alt="" className="layer-1-right-stone" /></div>
          <div data-w-id="8cb37ac4-765a-b07e-be5a-088e5ef84eef" className="layer-3-food---wrapper"><img src="/images/FoodSmaller.png" loading="lazy" sizes="(max-width: 2029px) 100vw, 2029px" srcSet="/images/FoodSmaller-p-500.png 500w, images/FoodSmaller-p-800.png 800w, images/FoodSmaller-p-1080.png 1080w, images/FoodSmaller-p-1600.png 1600w, images/FoodSmaller-p-2000.png 2000w, images/FoodSmaller.png 2029w" alt="" className="layer-3-food-mountains" /></div>
          <div data-w-id="dc5caad2-4c4b-df84-23ec-eb38be9d0261" className="layer-4-cave---wrapper"><img src="/images/FondoGluttons.png" loading="lazy" sizes="(max-width: 2029px) 100vw, 2029px" srcSet="/images/FondoGluttons-p-500.png 500w, images/FondoGluttons-p-800.png 800w, images/FondoGluttons-p-1080.png 1080w, images/FondoGluttons-p-1600.png 1600w, images/FondoGluttons-p-2000.png 2000w, images/FondoGluttons.png 2029w" alt="" className="layer-4-cave-background" /></div>
        </div>
        <Header />
        <div className="game-wrapper">
          <div className="state1">
            <div className="section-1-landing">
              <div className="state1-text">THIS IS A DEGEN EXPERIMENT</div>
              <div className="timer">
                <div className="gameclocktext">GAME STARTS</div>
                {/*<div className="timertext">100:00:00</div>*/}
                <div className="gameclocktext">OCT/31/25</div>
              </div>
            </div>
            <div className="section-2-landing">
              <div className="state1-text general">Mint your shot at 100k APE</div>
              <div className="btn-container">
                <ConnectButton label="ConNECT" />
                <a href="wtf" className="btn- w-button">RULES</a>
              </div>
              <div className="state1-text general">No luck. Only greed, guts &amp; gluttony.</div>
            </div>
            <div className="section-3-landing">
              <div className="div-supplypool">
                <div className="supplypool-info">
                  <div className="titlesupplypool">SUPPLY</div>
                  <div className="div-block-6">
                    <div className="infosupply">{Number(supply)}/1000<br /></div>
                  </div>
                </div>
                <div className="supplypool-info pooltotal">
                  <div className="titlesupplypool">POOL</div>
                  <div className="div-block-7">
                    <div className="infosupply">{realPool} APE</div>
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
