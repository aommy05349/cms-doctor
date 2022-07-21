import { FC } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const ApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

import { PainRecordMonthly } from '../../../../types';
interface Props {
    painRecord: Array<PainRecordMonthly>;
}

const MonthlyChart: FC<Props> = ({ painRecord }) => {
    if (!painRecord) return null;

    const options: ApexOptions = {
        chart: {
            id: 'migraine-level-chart',
        },
        dataLabels: {
            enabled: false,
        },
        fill: {
            type: 'gradient',
            opacity: 1,
            colors: ['#25AC67', '#0679E0', '#FDC72F', '#FC5605'],
            gradient: {
                shade: 'light',
                type: 'vertical',
                inverseColors: false,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 90, 100],
            },
        },
        plotOptions: {
            bar: {
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
                },
            },
            categories: painRecord.map((e) => e.label),
        },
    };

    const series = [
        {
            name: 'ไม่ปวด',
            data: painRecord.map((e) => e.score_pain.score_0),
        },
        {
            name: 'ปวดน้อย',
            data: painRecord.map((e) => e.score_pain.score_1),
        },
        {
            name: 'ปวดปานกลาง',
            data: painRecord.map((e) => e.score_pain.score_2),
        },
        {
            name: 'ปวดมาก',
            data: painRecord.map((e) => e.score_pain.score_3),
        },
    ];
    return (
        <ApexChart options={options} series={series} type="bar" width="350" />
    );
};

export default MonthlyChart;
