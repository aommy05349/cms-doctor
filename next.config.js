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
            'smile-migraine-api-2k6beg54tq-as.a.run.app',
        ],
    },
};

module.exports = nextConfig;
