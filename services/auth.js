import { apiApp } from './config';

export default {
    login: async (data) => {
        try {
            const url = '/specialist/login';
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            return res;
        } catch (error) {
            return error;
        }
    },
    me: async () => {
        try {
            const url = '/specialist/me';
            const res = await apiApp.get(url, data);
            return res.data;
        } catch (error) {
            return error;
        }
    },
    logout: async () => {
        try {
            const url = '/specialist/sign_out';
            const res = await apiApp.delete(url);
            return res.data;
        } catch (error) {
            return error;
        }
    },
};
