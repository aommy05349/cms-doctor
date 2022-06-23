import { useState } from 'react';
import { apiApp } from './config';

export default {
    getPatients: async (filters) => {
        try {
            const url = `/appointment/specialists/${filters.specialists}/categories/${filters.categories}/page/${filters.currentPage}`;
            const res = await apiApp.get(url);
            return res.data;
        } catch (error) {
            return error;
        }
    },
};
