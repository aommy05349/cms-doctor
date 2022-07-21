import moment from 'moment';
import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppWrapper({ children }) {
    const [callCountdownText, setCallCountdownText] = useState({
        minuteText: '',
        secondsText: '',
    });
    const [callStartTimeStamp, setCallStartTimeStamp] = useState('');
    const [timer, setTimer] = useState();

    function startCountdown(dateTime) {
        setCallStartTimeStamp(dateTime);
        const breakTime = moment(new Date())
            .add(15, 'm')
            .add(1, 's')
            .format('DD/MM/YYYY HH:mm:ss');
        const timerFunc = setInterval(() => {
            const timeStr = moment(breakTime).diff(new Date());
            setCallCountdownText({
                minuteText: moment(timeStr).format('mm'),
                secondsText: moment(timeStr).format('ss'),
            });
        }, 1000);
        setTimer(timerFunc);
    }

    function clearCountdown() {
        clearInterval(timer);
        setCallCountdownText({
            minuteText: '',
            secondsText: '',
        });
    }

    return (
        <AppContext.Provider
            value={{ callCountdownText, startCountdown, clearCountdown }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
