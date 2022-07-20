import { FC, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

import MigraineLevel from './MigraineLevel';
import DataRangeSelector from './DataRangeSelector';
import FrequencyTriggerList from './FrequencyTriggerList';
import { Patient } from '../../../types';

interface Props {
    patientId: Patient['member_id'];
}

const Dashboard: FC<Props> = ({ patientId }) => {
    const [dataRange, setDataRange] = useState<number>(30);

    return (
        <div className="py-3">
            <header className="flex justify-between space-x-4 text-sm mb-5 px-4">
                <h3 className="truncate font-bold">
                    ข้อมูลจากการบันทึกในแอปพลิเคชัน
                </h3>
                <button className="truncate text-i-green flex items-center space-x-1">
                    <FontAwesomeIcon icon={faQuestionCircle} />
                    <span>อธิบายระดับการปวด</span>
                </button>
            </header>
            <MigraineLevel patientId={patientId} />
            <DataRangeSelector value={dataRange} onChange={setDataRange} />
            <FrequencyTriggerList patientId={patientId} dataRange={dataRange} />
        </div>
    );
};

export default Dashboard;
