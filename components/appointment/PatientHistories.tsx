import { FC, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import numeral from 'numeral';

import NotFound from '../common/NotFound';
import Loader from '../common/Loader';
import { Patient, PatientHistory } from '../../types';
import { patientApi } from '../../services';

const PatientHistoryItem: FC<{ data: PatientHistory }> = ({ data }) => (
    <li className="py-4 border-b-2 border-b-gray-400 text-sm last:border-b-transparent">
        <div className="flex justify-between space-x-2 ">
            <span>{moment(data.update_dtm).format('MMMM DD, YYYY')}</span>
            <span>บันทึกล่าสุด: {data.expert_fname}</span>
        </div>
        <div className="p-4">{data.additional_information}</div>
    </li>
);

interface Props {
    patientId: Patient['member_id'];
    onClose?: () => void;
}

const PatientHistories: FC<Props> = ({ patientId, onClose }) => {
    const [histories, setHistories] = useState<Array<PatientHistory>>();

    const fetchHistories = async (patientId: Patient['member_id']) => {
        const res = await patientApi.getPatientHistories(patientId);
        setHistories(res || []);
    };

    useEffect(() => {
        if (patientId === undefined) return;
        fetchHistories(patientId);
        // eslint-disable-next-line
    }, [patientId]);

    let content = <NotFound>ยังไม่มีบันทึกจากผู้ช่วยแพทย์</NotFound>;

    if (!histories) {
        content = <Loader />;
    }

    if (histories && histories.length > 0) {
        content = (
            <ul className="flex flex-col">
                {histories.map((history) => (
                    <PatientHistoryItem
                        key={history.addinfo_id}
                        data={history}
                    />
                ))}
            </ul>
        );
    }

    return (
        <div className="bg-white rounded-[6px] p-4">
            <header className="flex justify-between space-x-4 text-sm text-i-green mb-4">
                <h3>
                    ประวัติทั้งหมด (
                    {numeral(histories?.length || 0).format('0,0')})
                </h3>
                <button className="flex space-x-2" onClick={onClose}>
                    <FontAwesomeIcon icon={faArrowUp} />
                    <span>ปิดบันทึกจากผู้ช่วยแพทย์</span>
                </button>
            </header>
            {content}
        </div>
    );
};

export default PatientHistories;
