import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

import { Patient } from '../../types';

interface patientProps {
    data: Patient;
    isShowHistories: boolean;
    onToggleHistories: () => void;
}

export default function PatientCard({
    data,
    isShowHistories,
    onToggleHistories,
}: patientProps) {
    function getGenderText(id: string) {
        if (id == 'm') {
            return 'ชาย';
        } else if (id == 'f') {
            return 'หญิง';
        } else {
            return 'ไม่ระบุ';
        }
    }
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
                            สมาชิก {data.member_period}
                            {!data.is_premium_member && (
                                <span className="text-orange-400">Premium</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-between space-x-4 mt-8">
                    <span className="truncate">บันทึกอาการไมเกรน</span>
                    <AnimatePresence exitBeforeEnter>
                        <motion.button
                            key={
                                isShowHistories
                                    ? 'showHistories'
                                    : 'hideHistories'
                            }
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`${
                                isShowHistories
                                    ? 'text-red-400'
                                    : 'text-i-green'
                            } truncate`}
                            onClick={onToggleHistories}
                        >
                            {isShowHistories
                                ? 'ปิดบันทึกจากผู้ช่วยแพทย์'
                                : 'บันทึกจากผู้ช่วยแพทย์'}
                        </motion.button>
                    </AnimatePresence>
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
