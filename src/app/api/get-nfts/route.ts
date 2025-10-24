// app/api/get-nfts/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

interface Token {
        id: string
        url: string
        status: boolean
    }

export async function GET(request: Request) {
    // 1. Get query params from the client's request
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get('userAddress');
    const contractAddress = searchParams.get('contractAddress');
    const chainId = searchParams.get('chainId');

    if (!userAddress || !contractAddress) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // 2. Construct the Reservoir API URL

    const gluttons_curtis = `https://api-curtis.reservoir.tools/users/${userAddress}/tokens/v10?contract=${contractAddress}&sortDirection=asc&limit=200`
    const gluttons_ape = `https://api-apechain.reservoir.tools/users/${userAddress}/tokens/v10?contract=${contractAddress}&sortDirection=asc&limit=200`
    // 3. Get your secret API key
    const API_KEY = process.env.RESERVOIR_API_KEY;

    if (!API_KEY) {
        return NextResponse.json({ error: 'Reservoir API key not configured' }, { status: 500 });
    }

    //api-apechain
    let adrr = ""
    if (Number(chainId) == 33111) {
        adrr = gluttons_curtis
    } else {
        adrr = gluttons_ape
    }

    console.log("fetch address", adrr)
  
    // let tokensArr: Token[] = []

    // const options = {
    //     method: 'GET',
    //     url: adrr,
    //     headers: { accept: '*/*', 'x-api-key': process.env.NEXT_PUBLIC_RESERVOIR }
    // };

    // axios
    //     .request(options)
    //     .then(res => {
    //         let data1 = res.data
    //         for (let i = 0; i < data1.tokens.length; i++) {
    //             let info: Token = {
    //                 id: data1.tokens[i].token.tokenId,
    //                 url: "",
    //                 status: false
    //             }
    //             tokensArr.push(info)
    //         }
    //         return tokensArr;
    //     })
    //     .catch(err => console.error(err));

  // 4. Make the server-to-server request
  try {
    const apiResponse = await fetch(adrr, {
      headers: {
        accept: '*/*',
        'x-api-key': API_KEY, // Pass the API key securely
      },
    });

    if (!apiResponse.ok) {
      // Forward the error from Reservoir
      const errorData = await apiResponse.json();
      return NextResponse.json(errorData, { status: apiResponse.status });
    }

    // 5. Send the data back to your frontend
    const data = await apiResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch data from Reservoir' }, { status: 500 });
  }
}