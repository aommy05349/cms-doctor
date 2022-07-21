import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import numeral from 'numeral';

import DailyChart from './DailyChart';
import MonthlyChart from './MonthlyChart';
import Loader from '../../../common/Loader';
import { patientApi } from '../../../../services';
import getTotalPain from '../../../../utils/getTotalPain';
import { Patient, PainRecordDaily, PainRecordMonthly } from '../../../../types';
import moment from 'moment';

moment.locale('th', {
    months: [
        'มกราคม',
        'กุมภาพันธ์',
        'มีนาคม',
        'เมษายน',
        'พฤษภาคม',
        'มิถุนายน',
        'กรกฎาคม',
        'สิงหาคม',
        'กันยายน',
        'ตุลาคม',
        'พฤศจิกายน',
        'ธันวาคม',
    ],
});

const LevelScore: FC<{ className?: string; image: string; value: number }> = ({
    className,
    image,
    value,
}) => (
    <li className={`flex flex-col items-center space-y-1 ${className}`}>
        <div className="h-7 w-7 relative shrink-0">
            <Image
                src={image}
                alt="level face"
                layout="fill"
                objectFit="contain"
            />
        </div>
        <p className="font-noto-bold text-center">
            {numeral(value).format('0,0')}
        </p>
    </li>
);

interface Props {
    patientId: Patient['member_id'];
    dataRange: number;
}

const Chart: FC<Props> = ({ patientId, dataRange }) => {
    const [painRecord, setPainRecord] = useState<
        Array<PainRecordDaily> | Array<PainRecordMonthly>
    >();

    const fetchPainRecord = async (
        patientId: Patient['member_id'],
        dataRange: number
    ) => {
        const { data } = await patientApi.getPainRecord(patientId, dataRange);
        setPainRecord(data);
    };

    useEffect(() => {
        if (patientId === undefined || dataRange === undefined) return;
        fetchPainRecord(patientId, dataRange);
    }, [patientId, dataRange]);

    if (!painRecord) return <Loader />;

    const totalPain = getTotalPain(
        dataRange === 30 ? 'daily' : 'monthly',
        painRecord
    );

    const pariodText =
        dataRange === 30
            ? moment().daysInMonth() + ' วัน'
            : dataRange === 90
            ? '3 เดือน'
            : '6 เดือน';

    const getMonthRangeText = (painRecord: Array<PainRecordMonthly>) =>
        painRecord[0].label + '-' + painRecord[painRecord.length - 1].label;

    const dateText =
        (dataRange === 30
            ? moment().format('MMMM')
            : getMonthRangeText(painRecord as Array<PainRecordMonthly>)) +
        ' ' +
        moment().add(543, 'year').format('YYYY');

    const content =
        dataRange === 30 ? (
            <DailyChart painRecord={painRecord as Array<PainRecordDaily>} />
        ) : (
            <MonthlyChart painRecord={painRecord as Array<PainRecordMonthly>} />
        );

    return (
        <div className="px-4">
            <header className="flex space-x-2">
                <div className="grow truncate">
                    <h3 className="font-noto-bold">ปวดไมเกรน {pariodText}</h3>
                    <p className="text-sm mt-1">
                        {!dateText.includes('undefined') && dateText}
                    </p>
                </div>
                <ul className="shrink-0 flex space-x-4">
                    <LevelScore
                        image="/images/migraine-level-face/no-pain.svg"
                        value={totalPain.noPain}
                        className="text-[#179B97]"
                    />
                    <LevelScore
                        image="/images/migraine-level-face/pain-soft.svg"
                        value={totalPain.softPain}
                        className="text-[#0679E0]"
                    />
                    <LevelScore
                        image="/images/migraine-level-face/pain-middle.svg"
                        value={totalPain.mediumPain}
                        className="text-[#FDC72F]"
                    />
                    <LevelScore
                        image="/images/migraine-level-face/pain-hard.svg"
                        value={totalPain.hardPain}
                        className="text-[#FC5605]"
                    />
                </ul>
            </header>
            {content}
        </div>
    );
};

export default Chart;

Chart.defaultProps = {
    dataRange: 30,
};
