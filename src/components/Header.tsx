'use client'

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function Header() {

    const {isConnected} = useAccount();

    return (
        <div data-animation="default" data-collapse="medium" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" className="navbar w-nav">
          <div className="w-container">
            <a href="/" className="brand-2 w-nav-brand"><img src="/images/GluttonLogo.png" loading="lazy" sizes="(max-width: 767px) 98vw, (max-width: 991px) 727.984375px, 939.9921875px" srcSet="/images/GluttonLogo-p-500.png 500w, images/GluttonLogo-p-800.png 800w, images/GluttonLogo-p-1080.png 1080w, images/GluttonLogo-p-1600.png 1600w, images/GluttonLogo-p-2000.png 2000w, images/GluttonLogo.png 2134w" alt="" className="image-4" /></a>
            <nav role="navigation" className="nav-menu w-nav-menu flex items-center">
              { isConnected && <a data-w-id="c5a8553d-372c-851a-69d1-9575243e2090" href="/dashboard" aria-current="page" className="nav-link w-nav-link w--current">DASHBOARD</a>}
              <a data-w-id="c5a8553d-372c-851a-69d1-9575243e2092" href="/wtf" className="nav-link-2 w-nav-link">RULES</a>
              <div className="nav-link-2 w-nav-link"><ConnectButton label="ConNECT" /></div>
             {/*<a data-w-id="c5a8553d-372c-851a-69d1-9575243e2094" href="dashboard.html" className="nav-link-3 w-nav-link">ConNECT</a>*/}
            </nav>
            <div className="menu-ham w-nav-button">
              <div className="w-icon-nav-menu"></div>
            </div>
          </div>
        </div>
    );
}