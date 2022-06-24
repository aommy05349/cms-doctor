import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faPhone } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

export default function TopNav() {
    const router = useRouter();
    return (
        <section className="bg-[#F2F2F2] flex flex-row flex-wrap items-center w-full">
            <div className="p-2">
                <button
                    className="w-[40px] h-[40px] rounded-full hover:bg-white ease-in duration-200"
                    onClick={() => {
                        router.push('/');
                    }}
                >
                    <FontAwesomeIcon
                        icon={faChevronLeft}
                        className="text-i-green"
                    />
                </button>
                <span className="font-noto-bold ml-3">ห้องตรวจ</span>
                <span className="ml-2">#HN938405</span>
            </div>
            <div className="p-4 flex-grow flex justify-end items-center">
                <span>เหลือเวลาอีก -14:52 นาที ก่อนระบบเลื่อนคิวคนไข้</span>
                <button className="bg-i-green text-white w-[80px] h-[32px] rounded-[6px] ml-3">
                    <FontAwesomeIcon icon={faPhone} />
                    <span className="ml-1">Call</span>
                </button>
            </div>
        </section>
    );
}
