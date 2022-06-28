import axios from 'axios';

export const HOST_API = process.env.NEXT_PUBLIC_HOST_API;
export const TELE_API = process.env.NEXT_PUBLIC_TELE_API;

console.log('TELE_API', TELE_API);

export const apiApp = axios.create({
    baseURL: HOST_API,
});

export const teleApiApp = axios.create({
    baseURL: TELE_API,
});
