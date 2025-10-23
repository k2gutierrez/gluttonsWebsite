"use client"

import { useAccount } from "wagmi";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function Wtf() {

  /*useEffect(() => {
    addEvent()
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
          <div data-w-id="a3aae2fb-7592-0a37-8c2c-a0862f803e63" className="layer-0-chest---wrapper rules"><img src="/images/TesoroCompleto.png" loading="lazy" sizes="(max-width: 2029px) 100vw, 2029px" srcSet="/images/TesoroCompleto-p-500.png 500w, images/TesoroCompleto-p-800.png 800w, images/TesoroCompleto-p-1080.png 1080w, images/TesoroCompleto-p-1600.png 1600w, images/TesoroCompleto-p-2000.png 2000w, images/TesoroCompleto.png 2029w" alt="" className="layer-0-chest" /></div>
          <div data-w-id="4ea5c633-52ff-02ae-9e5b-007358219948" className="layer-1-left---wrapper"><img src="/images/LeftStoneTexture.png" loading="lazy" sizes="(max-width: 2029px) 100vw, 2029px" srcSet="/images/LeftStoneTexture-p-500.png 500w, images/LeftStoneTexture-p-800.png 800w, images/LeftStoneTexture-p-1080.png 1080w, images/LeftStoneTexture-p-1600.png 1600w, images/LeftStoneTexture-p-2000.png 2000w, images/LeftStoneTexture.png 2029w" alt="" className="layer-1-left-stone" /></div>
          <div data-w-id="7c9c1be1-8282-6390-2521-8ef1dc697d9a" className="layer-1-right---wrapper"><img src="/images/RightStoneTexture.png" loading="lazy" sizes="(max-width: 2029px) 100vw, 2029px" srcSet="/images/RightStoneTexture-p-500.png 500w, images/RightStoneTexture-p-800.png 800w, images/RightStoneTexture-p-1080.png 1080w, images/RightStoneTexture-p-1600.png 1600w, images/RightStoneTexture-p-2000.png 2000w, images/RightStoneTexture.png 2029w" alt="" className="layer-1-right-stone" /></div>
          <div data-w-id="dc5caad2-4c4b-df84-23ec-eb38be9d0261" className="layer-4-cave---wrapper"><img src="/images/FondoGluttons.png" loading="lazy" sizes="(max-width: 2029px) 100vw, 2029px" srcSet="/images/FondoGluttons-p-500.png 500w, images/FondoGluttons-p-800.png 800w, images/FondoGluttons-p-1080.png 1080w, images/FondoGluttons-p-1600.png 1600w, images/FondoGluttons-p-2000.png 2000w, images/FondoGluttons.png 2029w" alt="" className="layer-4-cave-background" /></div>
        </div>
        <Header />
        <div className="game-wrapper wtf">
          <div className="state1 wtf-text">
            <div className="section1wtf">
              <div className="state1-text wtf-text">FEED OR BURN</div>
              <div className="state1-text general">Most plays don’t deliver. <br />You want a real shot at life-changing gains.</div>
            </div>
            <div className="_3stepplan rules">
              <div className="steps">
                <div className="stepstext">1.MINT<br /></div>
                <div className="stepstext subtitle">Your Glutt-On<br /></div>
              </div>
              <div className="steps">
                <div className="stepstext">2.FEED</div>
                <div className="stepstext subtitle">Your Glutt-On</div>
              </div>
              <div className="steps">
                <div className="stepstext">3.OUTLAST </div>
                <div className="stepstext subtitle">Everyone </div>
              </div>
            </div>
            <div className="section3wtf">
              <div className="section3-info">
                <div className="titlerules">RULES</div>
                <div className="textrules">Mint = 100 APE</div>
                <div className="textrules">Food = 1 APE x day</div>
                <div className="textrules">90% MINT &amp; FOOD go to Prize Pool</div>
                <div className="textrules">Team keeps 10%</div>
                <div className="textrules">0% royalties</div>
                <div className="textrules">Food is non-transferable</div>
                <div className="textrules">Feed daily or burn</div>
              </div>
              <div className="section3-info">
                <div className="titlerules">GAME NOTES</div>
                <div className="textrules">Game starts at 200 mints</div>
                <div className="textrules">Fully on-chain, no dev control</div>
                <div className="textrules">1 survivor wins it all</div>
                <div className="textrules">Or all agree to split the pool</div>
                <div className="textrules">If all die, last active wallets win</div>
                <div className="textrules">Check timer daily to feed on time</div>
                <div className="textrules">Glutt-Ons reveal after a few feeds</div>
              </div>
            </div>
            <div className="btn-container">
              <a href="/" className="btnx w-button">HOME<br /></a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
