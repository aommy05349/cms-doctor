import { useEffect, useState, ReactElement } from 'react';
import { boardApi } from '../services';
import MainLayout from '../components/layouts/Main';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronLeft,
    faChevronRight,
    faSearch,
    faUserXmark,
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { useRouter } from 'next/router';
import moment from 'moment';
import Swal from 'sweetalert2';

const unixOneDay: number = 86400;

function Home() {
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointment] = useState<any>([]);
    const [filters, setFilters] = useState({
        currentPage: 1,
        specialists: 1,
        categories: 0,
        searchTerm: '',
    });
    const [totalPage, setTotalPage] = useState(1);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    const router = useRouter();

    async function getList() {
        setLoading(true);
        const res = await boardApi.getPatients(filters);
        if (res.data) {
            countdownTime(res.data.patient_list);
            setTotalPage(res.data.summary.total);
        }
        setLoading(false);
    }

    function getBladgeStatus(unixTime: number) {
        if (unixTime < 0) {
            return {
                id: 1,
                text: 'คนไข้ไม่มาตามนัด',
                styles: 'bg-i-red text-white',
            };
        } else if (unixTime >= 0 && unixTime <= 900) {
            return {
                id: 2,
                text: 'กรุณาเข้าห้องตรวจ',
                styles: 'bg-[#9AFFCB]',
            };
        } else if (unixTime > 900 && unixTime <= 1800) {
            return {
                id: 3,
                text: 'ใกล้ถึงเวลาตรวจ',
                styles: 'bg-[#CBD5DD]',
            };
        } else {
            return {
                id: 0,
                text: '',
                styles: 'display-none',
            };
        }
    }

    function countdownTime(appointments: any) {
        if (appointments && appointments.length > 0) {
            const newAppointments = appointments.map((e: any) => {
                const timeText = moment
                    .utc(
                        moment(e.appointment_dtm, 'YYYY-MM-DD HH:mm:ss').diff(
                            moment(new Date(), 'YYYY-MM-DD HH:mm:ss')
                        )
                    )
                    .format('HH:mm:ss');
                const remainingUnixTime =
                    moment.utc(e.appointment_dtm).unix() -
                    moment.utc(new Date()).unix();
                return {
                    ...e,
                    timeText:
                        remainingUnixTime > 0 && remainingUnixTime <= 1800
                            ? timeText
                            : '',
                    remainingUnixTime,
                };
            });
            setAppointment(newAppointments);
        } else {
            setAppointment([]);
        }
    }

    function cancelAppointment(appointmentId: number) {
        Swal.fire({
            title: 'เลื่อนการตรวจ',
            text: 'คุณจะสามารถเลื่อนการตรวจได้ก่อน 1 วัน ระบบจะแจ้งให้ผู้ใช้งานเลือกวันตรวจใหม่',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ตกลง',
            cancelButtonColor: '#ccc',
            confirmButtonColor: '#E54D3F',
        }).then(async (confirm: any) => {
            if (confirm.isConfirmed) {
                const res = await boardApi.cancelAppointment(appointmentId);
                if (res.success) {
                    Swal.fire({
                        title: 'สำเร็จ',
                        text: 'เลื่อนการตรวจเรียบร้อย',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false,
                    }).then(() => {
                        getList();
                    });
                } else {
                    Swal.fire({
                        title: 'ผิดพลาด',
                        text: 'ไม่สามารถเลื่อนการตรวจได้',
                        icon: 'error',
                    });
                }
            }
        });
    }

    useEffect(() => {
        getList();
    }, [filters]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
            countdownTime(appointments);
        }, 1000);
        return function cleanup() {
            clearInterval(timer);
        };
    });

    return (
        <div>
            <section className="p-4 pt-10 flex flex-row w-full flex-wrap">
                <div className="w-[150px]">
                    <h1 className="text-3xl font-noto-bold">รอตรวจ</h1>
                </div>
                <div className="flex-grow flex flex-row items-center font-noto-medium">
                    <div className="mr-1">รายชื่อ</div>
                    <div className="text-i-green">
                        <select
                            className="border-none cursor-pointer"
                            value={filters.categories}
                            onChange={(event) => {
                                setFilters({
                                    ...filters,
                                    categories: parseInt(event.target.value),
                                });
                            }}
                        >
                            <option value={0}>ทั้งหมด</option>
                            <option value={1}>รอตรวจของวันนี้</option>
                            <option value={2}>ตรวจเรียบร้อยแล้ว</option>
                        </select>
                    </div>
                </div>
                <div className="">
                    <div className="search-input relative flex items-center">
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="text-i-green text-[1.3em] absolute left-[15px] z-30"
                        />
                        <input
                            type="search"
                            className="bg-[#EFFAF5] h-[44px] rounded-[20px] pl-[50px] pr-[10px]"
                            onKeyDown={(event: any) => {
                                setFilters({
                                    ...filters,
                                    searchTerm: event.target.value,
                                });
                            }}
                        />
                    </div>
                </div>
            </section>
            {!loading && (
                <section className="p-4 min-h-[75vh] animate-[fadeIn_.5s_ease-in]">
                    {appointments &&
                        appointments.map((e: any, index: number) => {
                            return (
                                <div
                                    key={e.id}
                                    className="flex flex-row items-center p-3 border-b-[1px] border-gray-300 cursor-pointer hover:bg-gray-100 ease-in duration-300"
                                >
                                    <div
                                        className={`relative w-[45px] h-[45px] min-w-[45px] rounded-[50%] overflow-hidden ${
                                            e.is_premium_member &&
                                            'border-[3px] border-[#F98B03]'
                                        }`}
                                    >
                                        <Image
                                            src={e.profile_img}
                                            layout="fixed"
                                            objectFit="cover"
                                            width={45}
                                            height={45}
                                        />
                                    </div>
                                    <div
                                        className="flex flex-col pl-4 flex-grow flex-wrap"
                                        onClick={() => {
                                            location.href = `appointment/${e.id}`;
                                        }}
                                    >
                                        <div className="">
                                            <h2 className="font-noto-bold hover:text-i-green">
                                                {e.fname} {e.lname}
                                            </h2>
                                        </div>
                                        <div className="flex flex-row flex-wrap">
                                            <div
                                                className={`w-[150px] pr-2 ${
                                                    !e.is_follow_up_appointment &&
                                                    'text-[#F98703]'
                                                }`}
                                            >
                                                {
                                                    e.is_follow_up_appointment_name
                                                }
                                            </div>
                                            <div className="pr-4">
                                                {e.doctor_appointment_date}
                                            </div>
                                            <div className="pr-2">
                                                {e.doctor_appointment_time}
                                            </div>
                                            {e.timeText && (
                                                <div className="pr-2">
                                                    {`(เหลือเวลาอีก -${e.timeText}นาที ก่อนระบบเลื่อนคิวคนไข้)`}
                                                </div>
                                            )}
                                            <div className="pr-2">
                                                <div className="">
                                                    <span
                                                        className={`rounded-[20px] px-4 py-1 ${
                                                            getBladgeStatus(
                                                                e.remainingUnixTime
                                                            ).styles
                                                        }`}
                                                    >
                                                        {
                                                            getBladgeStatus(
                                                                e.remainingUnixTime
                                                            ).text
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {filters.categories != 2 && (
                                        <div className="px-4 flex flex-col justify-center items-center">
                                            <div className="mb-2">
                                                {e.remainingUnixTime >
                                                    unixOneDay && (
                                                    <FontAwesomeIcon
                                                        icon={faUserXmark}
                                                        className="cursor-pointer text-i-red hover:text-red-700"
                                                        onClick={() => {
                                                            cancelAppointment(
                                                                e.id
                                                            );
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <div className="">
                                                {e.remainingUnixTime < 0 && (
                                                    <button className="text-i-red font-noto-bold py-[3px] px-[10px] rounded-[8px] duration-300 hover:bg-[#ffe6e6]">
                                                        ยืนยัน
                                                    </button>
                                                )}
                                                {e.remainingUnixTime > 0 && (
                                                    <div className="">
                                                        คิวที่{' '}
                                                        {index *
                                                            filters.currentPage +
                                                            1}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    {appointments.length == 0 && (
                        <p className="text-center mt-5 text-gray-400">
                            * ไม่พบรายการตรวจ
                        </p>
                    )}
                </section>
            )}
            {!loading && (
                <section className="flex flex-row items-center animate-[fadeIn_.5s_ease-in]">
                    <div className="flex flex-row px-10 p-4 items-center">
                        <div className="">
                            <button
                                className={`boder-none w-[40px] h-[40px] ${
                                    filters.currentPage > 1 && 'text-i-green'
                                }`}
                                onClick={() => {
                                    filters.currentPage > 1 &&
                                        setFilters({
                                            ...filters,
                                            currentPage:
                                                (filters.currentPage -= 1),
                                        });
                                }}
                            >
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>
                        </div>
                        <div className="text-center w-[70px]">
                            หน้า {filters.currentPage}
                        </div>
                        <div className="">
                            <button
                                className={`boder-none w-[40px] h-[40px] ${
                                    filters.currentPage < totalPage &&
                                    'text-i-green'
                                }`}
                                onClick={() => {
                                    filters.currentPage < totalPage &&
                                        setFilters({
                                            ...filters,
                                            currentPage:
                                                (filters.currentPage += 1),
                                        });
                                }}
                            >
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        </div>
                    </div>
                    <div className="font-noto-medium px-6 flex-grow text-sm text-[#17221E] text-left flex justify-end">
                        ระเบียบการใช้งาน:
                        ในกรณีแพทย์เกิดกรณีฉุกเฉินไม่สามารถมาทำการตรวจได้
                        ระบบจะให้ผู้ใช้งานเลือกวันนัดใหม่
                        โดยไม่มีค่าใช้จ่ายเพิ่มเติม
                    </div>
                </section>
            )}
        </div>
    );
}

Home.getLayout = function getLayout(page: ReactElement) {
    return <MainLayout>{page}</MainLayout>;
};

export default Home;
