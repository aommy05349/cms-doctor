import { FC, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

import MigraineLevel from './MigraineLevel';
import Chart from './Chart';
import DataRangeSelector from './DataRangeSelector';
import FrequencyTriggerList from './FrequencyTriggerList';
import FrequencyMedicationList from './FrequencyMedicationList';
import MigraineLevelInfoModal from './MigraineLevelInfoModal';
import { Patient } from '../../../types';

interface Props {
    patientId: Patient['member_id'];
}

const Dashboard: FC<Props> = ({ patientId }) => {
    const [dataRange, setDataRange] = useState<number>(30);
    const [isShowMLIModal, setShowMLIModal] = useState<boolean>(false);

    return (
        <>
            <div className="py-3">
                <header className="flex justify-between space-x-4 text-sm mb-5 px-4">
                    <h3 className="truncate font-bold">
                        ข้อมูลจากการบันทึกในแอปพลิเคชัน
                    </h3>
                    <button
                        className="truncate text-i-green flex items-center space-x-1"
                        onClick={() => setShowMLIModal(true)}
                    >
                        <FontAwesomeIcon icon={faQuestionCircle} />
                        <span>อธิบายระดับการปวด</span>
                    </button>
                </header>
                <MigraineLevel patientId={patientId} />
                <Chart patientId={patientId} dataRange={dataRange} />
                <DataRangeSelector value={dataRange} onChange={setDataRange} />
                <FrequencyTriggerList
                    patientId={patientId}
                    dataRange={dataRange}
                />
                <FrequencyMedicationList
                    patientId={patientId}
                    dataRange={dataRange}
                />
            </div>
            <MigraineLevelInfoModal
                show={isShowMLIModal}
                onClose={() => setShowMLIModal(false)}
            />
        </>
    );
};

export default Dashboard;
