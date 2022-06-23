import axios from 'axios';

export const HOST_API = process.env.NEXT_PUBLIC_HOST_API;
console.log(
    ' process.env.NEXT_PUBLIC_HOST_API',
    process.env.NEXT_PUBLIC_HOST_API
);
export const apiApp = axios.create({
    baseURL: HOST_API,
});
