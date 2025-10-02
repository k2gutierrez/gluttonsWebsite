// lib/atoms.ts
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

interface Token {
    id: string;
    url: string;
    status: boolean;
  }

// game
export let loadingAtom = atom(false);
export let Tokens = atom<Token[]>([]);
export let CurrentToken = atom<Token>({id: "", url: "", status: false});

// Derived atom example
//export const doubledCountAtom = atom((get) => get(countAtom)[randomColor(countAtom)])

// Async atom example
export const NftTokens = atom(async () => {
  const response = await fetch('/api/user')
  return await response.json()
})
