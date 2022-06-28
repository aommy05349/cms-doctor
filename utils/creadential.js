/* eslint-disable */
import axios from 'axios';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { teleApiApp } from '../services/config';

export const createAutoRefreshingCredential = (userId, token) => {
    console.log('userId', userId);
    console.log('token', token);
    const options = {
        token,
        tokenRefresher: refreshTokenAsync(userId),
        refreshProactively: true,
    };
    return new AzureCommunicationTokenCredential(options);
};

const refreshTokenAsync = async (userIdentity) => {
    const url = `/refreshToken/${userIdentity}`;
    const res = await teleApiApp.post(url, {
        firstName: 'Fred',
        lastName: 'Flintstone',
    });
    return res.data.token;
};
