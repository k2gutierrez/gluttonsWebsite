import type { Metadata } from "next";
import { ReactNode } from "react";
import localFont from 'next/font/local';
import "./globals.css";
import { Providers } from "./providers";



const pressura = localFont({ 
  src: "./fonts/GT-Pressura-Mono.otf",
  variable: '--font-pressura',
})
const hogfish = localFont({ 
  src: './fonts/Hogfish DEMO.otf',
  variable: '--font-hogfish'
})

export const metadata: Metadata = {
  title: "Gluttons",
  description: "Come and feed you Gluttons so you can be the last survivor and get the pool prize!",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${pressura.variable} ${hogfish.variable} antialiased`}
      >
        <Providers>
          {props.children}
        </Providers>
      </body>
    </html>
  );
}
