import { FC } from 'react';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const ApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

import { PainRecordDaily } from '../../../../types';

interface Props {
    painRecord: Array<PainRecordDaily>;
}

const DailyChart: FC<Props> = ({ painRecord }) => {
    if (!painRecord) return null;

    const daysInMonth = moment().daysInMonth();
    const freeSpace = daysInMonth - painRecord.length;

    const getDays = (val: string) => val.split('-')[2];

    const COLORS = ['#25AC67', '#0679E0', '#FDC72F', '#FC5605'];

    const options: ApexOptions = {
        chart: {
            id: 'migraine-level-chart',
        },
        dataLabels: {
            enabled: false,
        },
        colors: painRecord.map((e) => COLORS[+e.score_pain]),
        fill: {
            type: 'gradient',
            opacity: 1,
            gradient: {
                shade: 'light',
                type: 'vertical',
                inverseColors: false,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 90, 100],
            },
        },
        tooltip: {
            y: {
                title: { formatter: () => 'Pain Score:' },
                formatter: (val) => val - 1 + '',
            },
        },
        plotOptions: {
            bar: {
                distributed: true,
                borderRadius: 2,
            },
        },
        legend: {
            show: false,
        },
        yaxis: {
            show: false,
        },
        xaxis: {
            labels: {
                style: {
                    colors: '#6C6C6C',
                    fontSize: '10px',
                },
                formatter: (val) => {
                    return +val % 2 === 0 ? '' : +val + '';
                },
            },
            categories: [
                ...painRecord.map((e) => getDays(e.date)),
                ...Array(freeSpace).fill(''),
            ],
        },
    };

    const series = [
        {
            data: [
                ...painRecord.map((e) =>
                    e.score_pain !== null ? +e.score_pain + 1 : 0
                ),
                ...Array(freeSpace).fill(0),
            ],
        },
    ];
    return (
        <ApexChart options={options} series={series} type="bar" width="350" />
    );
};

export default DailyChart;
