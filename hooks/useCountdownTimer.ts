import { useState, useEffect, useRef } from 'react';
import moment from 'moment';

const useCountdownTimer = () => {
    const [expire, setExpire] = useState<Date | null>(null);
    const [day, setDay] = useState<number>(0);
    const [hour, setHour] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);
    const [second, setSecond] = useState<number>(0);
    const [isTimeout, setIsTimeout] = useState<boolean>(false);
    const timer = useRef<any>();

    const start = (date: Date | string) => {
        if (expire) return;
        setExpire(moment(date).toDate());
    };
    const stop = () => {
        clearInterval(timer.current);
        timer.current = undefined;
        setDay(0);
        setHour(0);
        setMinutes(0);
        setSecond(0);
        setIsTimeout(false);
        setExpire(null);
    };

    const calc = () => {
        let tmp = moment(expire).diff(moment(), 'second');
        if (tmp <= 0) {
            setIsTimeout(true);
            clearInterval(timer.current);
            return;
        }
        setDay(Math.floor(tmp / 86400));
        tmp = tmp % 86400;
        if (tmp > 0) {
            setHour(Math.floor(tmp / 3600));
            tmp = tmp % 3600;
            if (tmp > 0) {
                setMinutes(Math.floor(tmp / 60));
                setSecond(tmp % 60);
            }
        }
    };

    useEffect(() => {
        if (!expire) return;
        calc();
        timer.current = setInterval(() => {
            calc();
        }, 1000);

        return () => clearInterval(timer.current);

        // eslint-disable-next-line
    }, [expire]);

    return {
        isTimeout,
        day,
        hour,
        minutes,
        second,
        start,
        stop,
        timer: timer.current,
    };
};

export default useCountdownTimer;
