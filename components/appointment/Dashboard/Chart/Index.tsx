import { FC } from 'react';
import Image from 'next/image';
import numeral from 'numeral';

import OneMonth from './OneMonth';
import TreeMonth from './TreeMonth';
import SixMonth from './SixMonth';
import { Patient } from '../../../../types';

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

const Chart: FC<Props> = ({ dataRange }) => {
    const COLORS = ['#25AC67', '#0679E0', '#FDC72F', '#FC5605'];

    let content: any = null;

    switch (dataRange) {
        case 30:
            content = <OneMonth />;
            break;
        case 90:
            content = <TreeMonth />;
            break;
        case 180:
            content = <SixMonth />;
            break;
        default:
            break;
    }

    const randomNumber = (max: number, min: number) =>
        Math.floor(Math.random() * (max - min + 1) + min);

    return (
        <div className="px-4">
            <header className="flex space-x-2">
                <div className="grow truncate">
                    <h3 className="font-noto-bold">
                        ปวดไมเกรน {dataRange} วัน
                    </h3>
                    <p className="text-sm mt-1">มีนาคม 2562</p>
                </div>
                <ul className="shrink-0 flex space-x-4">
                    <LevelScore
                        image="/images/migraine-level-face/no-pain.svg"
                        value={randomNumber(0, 15)}
                        className="text-[#179B97]"
                    />
                    <LevelScore
                        image="/images/migraine-level-face/pain-soft.svg"
                        value={randomNumber(0, 15)}
                        className="text-[#0679E0]"
                    />
                    <LevelScore
                        image="/images/migraine-level-face/pain-middle.svg"
                        value={randomNumber(0, 15)}
                        className="text-[#FDC72F]"
                    />
                    <LevelScore
                        image="/images/migraine-level-face/pain-hard.svg"
                        value={randomNumber(0, 15)}
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