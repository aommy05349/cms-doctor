/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
    reactStrictMode: true,
    sassOptions: {
        includePaths: [path.join(__dirname, 'assets/styles')],
    },
    images: {
        domains: [
            'storage.googleapis.com',
            'cdngarenanow-a.akamaihd.net',
            'firebasestorage.googleapis.com',
        ]
    },
};

module.exports = nextConfig;
