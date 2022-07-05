import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronLeft,
    faPhone,
    faStethoscope,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

export default function TopNav() {
    const router = useRouter();

    function confirmBack() {
        Swal.fire({
            title: 'ยืนยันการออก ?',
            text: 'หากไม่ได้กด "ส่งสรุปการรักษา" ข้อมูลจะหายไป ต้องการดำเนินการต่อ ใช่หรือไม่ ?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ตกลง',
            cancelButtonColor: '#ccc',
            confirmButtonColor: '#25AC67',
        }).then(async (confirm: any) => {
            if (confirm.isConfirmed) {
                location.href = '/';
            }
        });
    }

    return (
        <section className="bg-[#F2F2F2] flex flex-row flex-wrap items-center w-full">
            <div className="p-2">
                <button
                    className="w-[40px] h-[40px] rounded-full hover:bg-white ease-in duration-200"
                    onClick={() => {
                        // เพิ่ม confirm box กรณี ที่ไม่ได้ ใส่ข้อมูลรายงานทั้งหมด
                        confirmBack();
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
                <FontAwesomeIcon
                    icon={faStethoscope}
                    className="mr-2 text-i-green"
                />
                <span>เหลือเวลาอีก -14:52 นาที ก่อนระบบเลื่อนคิวคนไข้</span>
            </div>
        </section>
    );
}
