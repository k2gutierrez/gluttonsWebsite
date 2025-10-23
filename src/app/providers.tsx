"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, connectorsForWallets, darkTheme } from "@rainbow-me/rainbowkit";
import { glyphConnectorDetails, GlyphProvider, glyphWalletRK, StrategyType, WalletClientType } from "@use-glyph/sdk-react";
import JotaiProviders from "@/components/engine/JotaiProviders";
//import config from "@/rainbowKitConfig";
import { WagmiProvider, createConfig, http, Transport, webSocket } from "wagmi";
import { Chain } from "viem";
import { apeChain, curtis, anvil } from "wagmi/chains";
import { useState, type ReactNode } from "react";
import "@rainbow-me/rainbowkit/styles.css"

export function Providers(props: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())

    const supportedChains: [Chain, ...Chain[]] = [apeChain, curtis, anvil];

    const connectors = connectorsForWallets(
        [
            {
                groupName: glyphConnectorDetails.name,
                wallets: [glyphWalletRK],
            },
        ],
        {
            appName: glyphConnectorDetails.name,
            projectId: glyphConnectorDetails.id,
        },
    );

    const apeChainRpcUrl = `https://apechain-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
    const curtisRpcUrl = `https://apechain-curtis.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
    const anvilRpcUrl = 'http://localhost:8545';

    const apeWebsocket = `wss://apechain-curtis.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    const curtisWebsocket = `wss://apechain-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`

    const wagmiTransports: Record<number, Transport> = {
        // For chains that need a dedicated provider, pass the URL to http() or webSocket()
        [apeChain.id]: http(apeChainRpcUrl),
        [curtis.id]: webSocket(curtisWebsocket) || http(curtisRpcUrl),

        // Use a local transport for development chains like Anvil
        [anvil.id]:  http("https://localhost:8545"),

        // Include WebSocket transport for real-time event subscriptions, if supported
        // [apeChain.id]: webSocket(`wss://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`),
        // ...
    };

    // const wagmiConfig = createConfig({
    //     //appName: "Mingles",
    //     //projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    //     chains: supportedChains,
    //     transports: wagmiTransports,
    //     connectors,
    //     syncConnectedChain: true
    // })

    const wagmiConfig = createConfig({
        //appName: "Mingles",
        //projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
        chains: supportedChains,
        transports: supportedChains.reduce((acc, chain) => {
            acc[chain.id] = http();
            return acc;
        }, {} as Record<number, Transport>),
        connectors,
    })

    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={darkTheme({ accentColor: '#3898ec', borderRadius: "none" })}> {/*accentColorForeground: "black", accentColor: 'transparent'*/}
                    <GlyphProvider
                        strategy={StrategyType.EIP1193}
                        walletClientType={WalletClientType.RAINBOWKIT}
                        askForSignature={true}
                    >
                        <JotaiProviders>
                            {props.children}
                        </JotaiProviders>
                    </GlyphProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}