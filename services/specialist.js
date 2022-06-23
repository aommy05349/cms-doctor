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
    getScheduleAppointment: async (dateString) => {
        try {
            const url = `/appointment/1/schedule/${dateString}`;
            const res = await apiApp.get(url);
            return res.data;
        } catch (error) {
            return error;
        }
    },
};
