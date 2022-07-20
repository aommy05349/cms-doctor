import { FC, useEffect, useState } from 'react';
import Image from 'next/image';

import Loader from '../../common/Loader';
import { patientApi } from '../../../services';
import { Patient, MigraineLevel as MigraineLevelType } from '../../../types';

interface Props {
    patientId: Patient['member_id'];
}

const MigraineLevel: FC<Props> = ({ patientId }) => {
    const [migraineLevel, setMigraineLevel] = useState<MigraineLevelType>();

    const fetchMigraineLevel = async (patientId: Patient['member_id']) => {
        const res = await patientApi.getMigraineLevel(patientId);
        setMigraineLevel(res);
    };

    useEffect(() => {
        if (patientId === undefined) return;
        fetchMigraineLevel(patientId);
    }, [patientId]);

    if (!migraineLevel) return <Loader />;

    const MIGRAINE_LEVEL_BUBBLE_IMAGE_URL = [
        '/images/migraine-level-bubble/unknow.svg',
        '/images/migraine-level-bubble/1.svg',
        '/images/migraine-level-bubble/2.svg',
        '/images/migraine-level-bubble/3.svg',
        '/images/migraine-level-bubble/4.svg',
        '/images/migraine-level-bubble/5.svg',
    ];

    return (
        <div className="flex space-x-4 mb-8 px-4">
            <div className="grow flex flex-col space-y-1">
                <p className="text-sm font-semibold">อยู่ในระดับ</p>
                <p className="text-2xl font-semibold">{migraineLevel.detail}</p>
                <p className="text-sm text-gray-500 max-w-[200px]">
                    {migraineLevel.description}
                </p>
            </div>
            <div className="w-[69px] h-[69px] shrink-0 relative">
                <Image
                    src={MIGRAINE_LEVEL_BUBBLE_IMAGE_URL[migraineLevel.level]}
                    alt="migraine bubble level"
                    layout="fill"
                    objectFit="contain"
                />
            </div>
        </div>
    );
};

export default MigraineLevel;
