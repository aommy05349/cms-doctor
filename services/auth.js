import { apiApp } from './config';

export default {
    login: async (data) => {
        try {
            const url = '/specialist/login';
            const res = await apiApp.post(url, data);
            return res.data;
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
    createSession: async (token) => {
        try {
            const response = await fetch('/api/create-session', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });
            let data = await response.json();
            return data;
        } catch (error) {
            return error;
        }
    },
    logout: async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            let data = await response.json();
            return data;
        } catch (error) {
            return error;
        }
    },
};
