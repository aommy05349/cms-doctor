import { FC, useState, useEffect } from 'react';
import Image from 'next/image';
import numeral from 'numeral';

import NotFound from '../../common/NotFound';
import Loader from '../../common/Loader';
import ContentBox from './ContentBox';
import { patientApi } from '../../../services';
import {
    Patient,
    FrequencyMedication as FrequencyMedicationType,
} from '../../../types';
import { HOST_API } from '../../../services/config';

const MedicationStatusLabel: FC<{ active: boolean }> = ({ active }) => (
    <div
        className={`text-sm w-16 text-center shrink-0 ${
            active ? 'text-[#179B97]' : 'text-[#CBD5DD]'
        }`}
    >
        {active ? 'กำลังทาน' : 'หยุดใช้ยา'}
    </div>
);

const FrequencyMedicationItem: FC<{ data: FrequencyMedicationType }> = ({
    data,
}) => (
    <li className="flex items-center space-x-2">
        <div className="h-8 w-8 relative shrink-0">
            <Image
                src={`${HOST_API}/${data.image}`}
                alt="medication image"
                layout="fill"
                objectFit="contain"
            />
        </div>
        <div className="flex grow truncate items-center space-x-2 border-b border-[#EEEEEE] py-3">
            <div className="grow truncate">{data.name}</div>
            <MedicationStatusLabel active={data.status === '1'} />
            <div className="text-sm w-16 text-right shrink-0">
                {numeral(data.count_med).format('0,0')} ครั้ง
            </div>
        </div>
    </li>
);

interface Props {
    patientId: Patient['member_id'];
    dataRange?: number;
}

const FrequencyMedicationList: FC<Props> = ({ patientId, dataRange }) => {
    const [frequencyMedicationList, setFrequencyMedicationList] =
        useState<Array<FrequencyMedicationType>>();

    const fetchFrequencyMedicationList = async (
        patientId: Patient['member_id'],
        dataRange: number
    ) => {
        const {
            data: { data },
        } = await patientApi.getFrequencyMedication(patientId, dataRange);
        setFrequencyMedicationList(data || []);
    };

    useEffect(() => {
        if (patientId === undefined || dataRange === undefined) return;
        fetchFrequencyMedicationList(patientId, dataRange);
    }, [patientId, dataRange]);

    let content = <NotFound>ไม่พบข้อมูลยาแก้ปวด</NotFound>;

    if (!frequencyMedicationList) {
        content = <Loader />;
    }

    if (frequencyMedicationList && frequencyMedicationList.length > 0) {
        content = (
            <ul className="flex flex-col">
                {frequencyMedicationList.map((frequencyMedication) => (
                    <FrequencyMedicationItem
                        key={frequencyMedication.medicine_id}
                        data={frequencyMedication}
                    />
                ))}
            </ul>
        );
    }

    return (
        <div className="mb-8">
            <h3 className="text-sm font-bold mb-3 px-4">ยาแก้ปวด</h3>
            <ContentBox>{content}</ContentBox>
        </div>
    );
};

export default FrequencyMedicationList;
