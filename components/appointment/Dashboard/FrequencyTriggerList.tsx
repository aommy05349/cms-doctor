import { FC, useEffect, useState } from 'react';

import NotFound from '../../common/NotFound';
import Loader from '../../common/Loader';
import { patientApi } from '../../../services';
import {
    Patient,
    FrequencyTrigger as FrequencyTriggerType,
} from '../../../types';

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
            <ul>{frequencyTriggerList.map((e) => e.trigger_name + ', ')}</ul>
        );
    }

    return (
        <div>
            <h3 className="text-sm font-bold">สิ่งกระตุ้น</h3>
            <div className="">{content}</div>
        </div>
    );
};

export default FrequencyTriggerList;

FrequencyTriggerList.defaultProps = {
    dataRange: 30,
};
