import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import numeral from 'numeral';

import NotFound from '../../common/NotFound';
import Loader from '../../common/Loader';
import ContentBox from './ContentBox';
import { patientApi } from '../../../services';
import {
    Patient,
    FrequencyTrigger as FrequencyTriggerType,
} from '../../../types';
import { HOST_API } from '../../../services/config';

const FrequencyTriggerItem: FC<{ data: FrequencyTriggerType }> = ({ data }) => (
    <li className="flex space-x-3 py-1.5">
        <div className="h-8 w-8 relative shrink-0">
            <Image
                src={`${HOST_API}/${data.nbg_active_trigger}`}
                alt="frequency trigger image"
                layout="fill"
                objectFit="contain"
            />
        </div>
        <div className="grow border-b border-[#EEEEEE] pb-1.5">
            <div className="flex justify-between items-baseline space-x-2">
                <span className="text-sm font-bold">
                    {numeral(data.percentage).format('0,0')}%
                </span>
                <span className="text-xs ">
                    {numeral(data.count_trigger).format('0,0')} ครั้ง
                </span>
            </div>
            <p className="text-sm">{data.trigger_name}</p>
        </div>
    </li>
);

interface Props {
    patientId: Patient['member_id'];
    dataRange?: number;
}

const FrequencyTriggerList: FC<Props> = ({ patientId, dataRange }) => {
    const [frequencyTriggerList, setFrequencyTriggerList] =
        useState<Array<FrequencyTriggerType>>();

    const fetchFrequencyTriggerList = async (
        patientId: Patient['member_id'],
        dataRange: number
    ) => {
        const {
            data: { data },
        } = await patientApi.getFrequencyTrigger(patientId, dataRange);
        setFrequencyTriggerList(data);
    };

    useEffect(() => {
        if (patientId === undefined || dataRange === undefined) return;
        fetchFrequencyTriggerList(patientId, dataRange);
    }, [patientId, dataRange]);

    let content = <NotFound>ไม่พบข้อมูลสิ่งกระตุ้น</NotFound>;

    if (!frequencyTriggerList) {
        content = <Loader />;
    }

    if (frequencyTriggerList && frequencyTriggerList.length > 0) {
        content = (
            <ul className="grid grid-cols-2 gap-x-8">
                {frequencyTriggerList.map((frequencyTrigger) => (
                    <FrequencyTriggerItem
                        key={frequencyTrigger.trigger_id}
                        data={frequencyTrigger}
                    />
                ))}
            </ul>
        );
    }

    return (
        <div className="mb-8">
            <h3 className="text-sm font-bold mb-3 px-4">สิ่งกระตุ้น</h3>
            <ContentBox>{content}</ContentBox>
        </div>
    );
};

export default FrequencyTriggerList;

FrequencyTriggerList.defaultProps = {
    dataRange: 30,
};
