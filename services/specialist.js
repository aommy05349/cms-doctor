import { apiApp } from './config';

export default {
    getSpecialistById: async (id) => {
        try {
            const url = `/specialist/${id}`;
            const res = await apiApp.get(url);
            return res.data;
        } catch (error) {
            return error;
        }
    },
    getScheduleAppointment: async (specialistId, dateString) => {
        try {
            const url = `/appointment/${specialistId}/schedule/${dateString}`;
            const res = await apiApp.get(url);
            return res.data;
        } catch (error) {
            return error;
        }
    },
    getSpecialistToken: async (doctorAppointmentID) => {
        try {
            const url = `community-service/token/${doctorAppointmentID}`;
            const res = await apiApp.get(url);
            return res.data;
        } catch (error) {
            return error;
        }
    },
    endCall: async (data) => {
        try {
            const url = `/telemigraine/listenning`;
            const res = await apiApp.post(url, data);
            return res.data;
        } catch (error) {
            return error;
        }
    },
    saveNextAppointment: async (data) => {
        try {
            const url = 'next-appointment/specialists';
            const res = await apiApp.post(url, data);
            return res.data;
        } catch (error) {
            return error;
        }
    },
    deleteAppointment: async (doctorAppointmentID) => {
        try {
            const url = `/appointment/specialists/${doctorAppointmentID}`;
            const res = await apiApp.delete(url);
            return res.data;
        } catch (error) {
            return error;
        }
    },
    resendAppointment: async (data) => {
        try {
            const url = '/telemigraine/chatrooms';
            const res = await apiApp.post(url, data);
            return res.data;
        } catch (error) {
            return error;
        }
    },
    createOrders: async (data) => {
        try {
            const url = '/telemigraine/order';
            const res = await apiApp.post(url, data);
            return res.data;
        } catch (error) {
            return error;
        }
    },
    createReport: async (data) => {
        try {
            const url = '/telemigraine/report';
            const res = await apiApp.post(url, data);
            return res.data;
        } catch (error) {
            return error;
        }
    },
    updateStatusSuccessConsult: async (data) => {
        try {
            const url = '/appointment/specialists';
            const res = await apiApp.patch(url, data);
            return res.data;
        } catch (error) {
            return error;
        }
    },
    sendToChat: async (data) => {
        try {
            const url = '/telemigraine/chatrooms';
            const res = await apiApp.post(url, data);
            return res.data;
        } catch (error) {
            return error;
        }
    },
    getNewCardByAppointmentId: async (appointmentId) => {
        try {
            const url = `/telemigraine/appointment/${appointmentId}`;
            const res = await apiApp.get(url);
            return res.data;
        } catch (error) {
            return error;
        }
    },
    updateNextAppointmentFirebase: async (data) => {
        try {
            const url = `/telemigraine/listenning`;
            const res = await apiApp.patch(url, data);
            return res.data;
        } catch (error) {
            return error;
        }
    },
    getAppointmentId: async (appointmentId) => {
        try {
            const url = `/appointment/${appointmentId}`;
            const res = await apiApp.get(url);
            return res.data;
        } catch (error) {
            return error;
        }
    },
};
