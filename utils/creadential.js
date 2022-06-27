/* eslint-disable */
import axios from 'axios';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

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
    const res = await axios({
        method: 'post',
        url: `https://tele-smilemigraine-server-2k6beg54tq-as.a.run.app/refreshToken/${userIdentity}`,
        data: {
            firstName: 'Fred',
            lastName: 'Flintstone',
        },
    });
    return res.data.token;
};
