import { useState, useEffect } from 'react';
import Image from 'next/image';
import moment from 'moment';

import Loader from '../common/Loader';
import { patientApi } from '../../services';
import { Patient, PatientHistory } from '../../types';

interface patientProps {
    data: Patient;
}

export default function PatientCard({ data }: patientProps) {
    const [histories, setHistories] = useState<Array<PatientHistory>>();

    function getGenderText(id: string) {
        if (id == 'm') {
            return 'ชาย';
        } else if (id == 'f') {
            return 'หญิง';
        } else {
            return 'ไม่ระบุ';
        }
    }

    const fetchHistories = async (patientId: Patient['member_id']) => {
        const res = await patientApi.getPatientHistories(patientId);
        setHistories(res || []);
    };

    useEffect(() => {
        if (data === undefined) return;
        fetchHistories(data.member_id);
        // eslint-disable-next-line
    }, [data]);

    return (
        <div className="flex flex-row text-[14px] py-5 px-7 bg-white border-b-2">
            <div className="flex-1 flex flex-col border-r-gray-100 border-r-[1px] pr-4">
                <div className="flex flex-row mb-3">
                    <div className="relative w-[40px] h-[40px] rounded-[50%] overflow-hidden  shrink-0">
                        <Image
                            src={data.profile_img}
                            alt="patient avatar"
                            layout="fill"
                            objectFit="cover"
                            className="w-full h-full"
                        />
                    </div>
                    <div className="ml-3">
                        <div className="font-noto-medium text-[18px] text-black mb-2 truncate">
                            คุณ {data.fname} {data.lname}
                        </div>
                        <div className="">
                            สมาชิก {data.member_period} • Expire{' '}
                            {moment(data.stop_dtm).format('DD/MM/YY')}
                            {!data.is_premium_member && (
                                <span className="text-orange-400 ml-2">
                                    Premium
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col space-y-4 mt-8">
                    <h2 className="truncate text-sm text-gray-500">
                        บันทึกจากผู้ช่วยแพทย์
                    </h2>
                    <p>
                        {!histories && (
                            <Loader className="h-auto justify-start" />
                        )}
                        {histories &&
                            histories[0] &&
                            histories[0].additional_information}
                        {histories && !histories[0] && '-'}
                    </p>
                </div>
            </div>
            <div className="flex-1 px-4">
                <div className="flex flex-row mb-3">
                    <div className="px-2">
                        <p className="text-gray-500">อายุ</p>
                        <h3 className="text-[16px]">{data.age}</h3>
                    </div>
                    <div className="px-2">
                        <p className="text-gray-500">เพศ</p>
                        <h3 className="text-[16px]">
                            {getGenderText(data.gender)}
                        </h3>
                    </div>
                    <div className="px-2">
                        <p className="text-gray-500">น้ำหนัก</p>
                        <h3 className="text-[16px]">{data.weight}</h3>
                    </div>
                    <div className="px-2">
                        <p className="text-gray-500">ส่วนสูง</p>
                        <h3 className="text-[16px]">{data.height}</h3>
                    </div>
                </div>
                <div className="flex flex-row mb-3">
                    <div className="px-2">
                        <p className="text-gray-500">เริ่มเป็นไมเกรนอายุ</p>
                        <h3 className="text-[16px]">{data.migraine_age}</h3>
                    </div>
                    <div className="px-2">
                        <p className="text-gray-500">ความถี่ของอาการปวด</p>
                        <h3 className="text-[16px]">{data.frequency_pain}</h3>
                    </div>
                </div>
                <div className="flex flex-row">
                    <div className="px-2">
                        <p className="text-gray-500">อาชีพปัจุบัน</p>
                        <h3 className="text-[16px]">{data.job}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
