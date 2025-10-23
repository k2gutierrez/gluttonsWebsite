"use client"; // This component needs to be a Client Component for state and clicks

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// ---------------------------------

export default function Header() {
  const {isConnected} = useAccount();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md relative z-40">
      {/* 1. Main Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* 2. Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <Image
                src="/images/GluttonLogo.png"
                alt="Glutton Logo"
                width={80}  // <-- !! IMPORTANT: Set your logo's actual width
                height={80} // <-- !! IMPORTANT: Set your logo's actual height
                priority // Load logo first
              />
            </Link>
          </div>

          {/* 3. Desktop Nav Links (Hidden on mobile) */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {isConnected && (
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                DASHBOARD
              </Link>
            )}
            <Link
              href="/wtf"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              RULES
            </Link>
            {/* Connect Button for Desktop */}
            <ConnectButton label="ConNECT" />
          </div>

          {/* 4. Hamburger Button (Visible on mobile) */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon: "X" when open, "Hamburger" when closed */}
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Mobile Menu (Dropdown) */}
      <div
        className={`
          md:hidden                 ${/* Only show on mobile */ ''}
          ${isMenuOpen ? 'block' : 'hidden'}  ${/* Toggle visibility based on state */ ''}
          absolute w-full bg-white shadow-lg  ${/* Style as a dropdown */ ''}
        `}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-4 space-y-2 sm:px-3">
          {isConnected && (
            <Link
              href="/dashboard"
              onClick={() => setIsMenuOpen(false)} // Close menu on click
              className="text-gray-700 hover:bg-gray-100 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              DASHBOARD
            </Link>
          )}
          <Link
            href="/wtf"
            onClick={() => setIsMenuOpen(false)} // Close menu on click
            className="text-gray-700 hover:bg-gray-100 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            RULES
          </Link>
          
          {/* Connect Button for Mobile */}
          <div className="px-3 pt-2">
            <ConnectButton label="ConNECT" />
          </div>
        </div>
      </div>
    </nav>
  );
}