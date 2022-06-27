import Image from 'next/image';
import React, { ReactChild } from 'react';

interface patientProps {
    data: any;
}

export default function PatientCard({ data }: patientProps) {
    return (
        <div className="flex flex-row text-[14px] py-5 px-7 bg-white border-b-2">
            <div className="flex-1 flex flex-col border-r-gray-100 border-r-[1px]">
                <div className="flex flex-row mb-3">
                    <div className="relative w-[40px] h-[40px] rounded-[50%] overflow-hidden">
                        <Image
                            src={data.profile_img}
                            layout="fill"
                            objectFit="cover"
                            className="w-full h-full"
                        />
                    </div>
                    <div className="ml-3">
                        <div className="font-noto-medium text-[18px] text-black mb-2">
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
                <div className="flex flex-col">
                    <div className="flex flex-row mb-2">
                        <div className="flex-1">บันทึกอาการไมเกรน</div>
                        <div className="flex-1 text-i-green text-right pr-4">
                            ดูประวัติการบันทึกย้อนหลัง
                        </div>
                    </div>
                    <div className="flex flex-row">
                        <div className="text-gray-300 flex-1">
                            เกี่ยวกับผู้ป่วยไมเกรน
                        </div>
                        <div className="flex-1 text-right">
                            <button className="border-2 border-[#E0E0E0] rounded-[6px] py-1 px-4 font-noto-bold text-[#6C6C6C] mr-4">
                                บันทึก
                            </button>
                        </div>
                    </div>
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
                        <h3 className="text-[16px]">{data.gender}</h3>
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
