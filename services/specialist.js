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
    }
    
};
