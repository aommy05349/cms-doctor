import { FC } from 'react';

import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

const ApexChart = dynamic(() => import('react-apexcharts'), {
    ssr: false,
});

const SixMonth: FC = () => {
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
                columnWidth: '70%',
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
            categories: [
                'เดือน 1',
                'เดือน 2',
                'เดือน 3',
                'เดือน 4',
                'เดือน 5',
                'เดือน 6',
            ],
        },
    };

    const series = [
        {
            name: 'ไม่ปวด',
            data: [4, 7, 13, 5, 8, 1],
        },
        {
            name: 'ปวดน้อย',
            data: [3, 7, 15, 6, 4, 3],
        },
        {
            name: 'ปวดกลาง',
            data: [6, 8, 10, 0, 7, 4],
        },
        {
            name: 'ปวดมาก',
            data: [6, 8, 10, 0, 2, 4],
        },
    ];
    return (
        <ApexChart options={options} series={series} type="bar" width="350" />
    );
};

export default SixMonth;
