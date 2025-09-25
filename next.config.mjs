// import { sources } from 'next/dist/compiled/webpack/webpack';

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config, { isServer }) {
        // Example: Modify rules, plugins, etc.
        // But do NOT import webpack directly

        // Example: Add a custom loader
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        return config;
    },
    swcMinify: true,
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ipfs.io'
            },
            {
                protocol: 'https',
                hostname: '*.ardrive.net'
            },
            {
                hostname: 'data:',
            },
            {
                protocol: 'https',
                hostname: 'ardrive.net'
            }
        ]
    }
};

export default nextConfig;
