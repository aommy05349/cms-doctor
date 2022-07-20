import { FC } from 'react';

import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

const ApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

const OneMonth: FC = () => {
    const COLORS = ['#25AC67', '#0679E0', '#FDC72F', '#FC5605'];

    const options: ApexOptions = {
        chart: {
            id: 'migraine-level-chart',
        },
        dataLabels: {
            enabled: false,
        },
        colors: Array.from(
            Array(30).keys(),
            () => COLORS[Math.floor(Math.random() * (3 - 0 + 1) + 0)]
        ),
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
                },
                formatter: (val) => {
                    return +val % 2 === 0 ? '' : val;
                },
            },
            categories: Array.from(Array(30).keys()).map((e) => e + 1),
        },
    };

    const series = [
        {
            data: Array.from(Array(30).keys(), () => Math.random() * 10),
        },
    ];
    return (
        <ApexChart options={options} series={series} type="bar" width="350" />
    );
};

export default OneMonth;
