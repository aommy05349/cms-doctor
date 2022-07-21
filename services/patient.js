import { apiApp } from './config';

export default {
    getReportHistory: async (memberId) => {
        try {
            const url = `/telemigraine/history/${memberId}`;
            const res = await apiApp.get(url);
            return res.data;
        } catch (error) {
            return error;
        }
    },
    getPatient: async (memberId) => {
        try {
            const url = `/members/${memberId}`;
            const res = await apiApp.get(url);
            return res.data[0];
        } catch (error) {
            return error;
        }
    },
    getPatientHistories: async (memberId) => {
        try {
            const url = `/members/additional/${memberId}`;
            const res = await apiApp.get(url);
            return res.data;
        } catch (error) {
            return error;
        }
    },
    searchPatientOrder: async (searchTerm) => {
        try {
            const url = '/telemigraine/order/search';
            const res = await apiApp.post(url, {
                key_search: searchTerm,
            });
            return res.data;
        } catch (error) {
            return error;
        }
    },
    getMigraineLevel: async (id) => {
        try {
            const url = `/migraine/${id}/level`;
            const res = await apiApp.get(url);
            return res.data;
        } catch (error) {
            return error;
        }
    },
    getHeadachesHistory: async (id) => {
        // for graph
        try {
            const url = `/headaches/members/${id}/prev/90`;
            const res = await apiApp.get(url);
            return res.data;
        } catch (error) {
            return error;
        }
    },
    getFrequencyTrigger: async (id, prev = 180) => {
        try {
            const url = `/getFrequencyTrigger/${id}/prev/${prev}`;
            const res = await apiApp.get(url);
            return res.data;
        } catch (error) {
            return error;
        }
    },
    getFrequencyMedication: async (id, prev = 180) => {
        try {
            const url = `/getFrequencyMedication/${id}/prev/${prev}`;
            const res = await apiApp.get(url);
            return res.data;
        } catch (error) {
            return error;
        }
    },
    getListenning: async (memberId) => {
        try {
            const url = `/telemigraine/listenning/${memberId}`;
            const res = await apiApp.get(url);
            return res.data;
        } catch (error) {
            return error;
        }
    },
    getAppointmentByMemberId: async (memberId) => {
        try {
            const url = `/appointment/${memberId}/schedule`;
            const res = await apiApp.get(url);
            return res.data;
        } catch (error) {
            return error;
        }
    },
    getPainRecord: async (memberId, prev) => {
        try {
            const url = `/pain-record/${memberId}/prev/${prev}`;
            const res = await apiApp.get(url);
            return res.data;
        } catch (error) {
            return error;
        }
    },
    getMedications: async (memberId, prev) => {
        try {
            const url = `/medications/${memberId}/prev/${prev}`;
            const res = await apiApp.get(url);
            return res.data;
        } catch (error) {
            return error;
        }
    },
};
