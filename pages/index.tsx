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

const defaultFilters = {
    currentPage: 1,
    specialists: 1,
    categories: 0,
    searchTerm: '',
};

const stateBadges = [
    {
        text: 'คนไข้ไม่มาตามนัด',
        colorClass: 'bg-i-red text-white',
    },
    {
        text: 'กรุณาเข้าห้องตรวจ',
        colorClass: 'bg-[#9AFFCB]',
    },
    {
        text: 'คนไข้ไม่มาตามนัด',
        colorClass: 'bg-[#CBD5DD]',
    },
];

function Home() {
    const [appointments, setAppointment] = useState([]);
    const [filters, setFilters] = useState(defaultFilters);
    const [totalPage, setTotalPage] = useState(1);
    const router = useRouter();

    async function getList() {
        const res = await boardApi.getPatients(filters);
        console.log('getList', res.data);
        if (res.data) {
            setAppointment(res.data.patient_list);
            setTotalPage(res.data.summary.total);
        }
    }

    useEffect(() => {
        getList();
    }, [filters]);

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
                            className="border-none"
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
                            className="text-i-green text-[1.3em] absolute left-[15px]"
                        />
                        <input
                            type="text"
                            className="bg-[#EFFAF5] h-[44px] rounded-[20px] pl-[50px]"
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
            <section className="p-4 min-h-[80vh] animate-[fadeIn_.5s_ease-in]">
                {appointments &&
                    appointments.map((e: any) => {
                        return (
                            <div
                                key={e.id}
                                className="flex flex-row items-center p-3 border-b-[1px] border-gray-300 cursor-pointer hover:bg-gray-100 ease-in duration-300"
                                onClick={() => {
                                    router.push(`appointment/${e.member_id}`);
                                }}
                            >
                                <div
                                    className={`relative w-[45px] h-[45px] rounded-[50%] overflow-hidden ${
                                        e.is_premium_member &&
                                        'border-[3px] border-[#F98B03]'
                                    }`}
                                >
                                    <Image
                                        src={e.profile_img}
                                        layout="fill"
                                        objectFit="cover"
                                        className="w-full h-full"
                                    />
                                </div>
                                <div className="flex flex-col pl-4 flex-grow flex-wrap">
                                    <div className="">
                                        <h2 className="font-noto-bold">
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
                                            {e.is_follow_up_appointment_name}
                                        </div>
                                        <div className="pr-4">
                                            {e.doctor_appointment_date}
                                        </div>
                                        <div className="pr-2">
                                            {e.doctor_appointment_time}
                                        </div>
                                        <div className="pr-2">
                                            <div className=""></div>
                                            <div className="">
                                                <span
                                                    className={`rounded-[20px] px-4 py-1 ${stateBadges[2].colorClass}`}
                                                >
                                                    {stateBadges[2].text}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 flex flex-col justify-center items-center">
                                    <div className="mb-2">
                                        <FontAwesomeIcon
                                            icon={faUserXmark}
                                            className="cursor-pointer text-i-red hover:text-red-700"
                                        />
                                    </div>
                                    <div className="">คิวที่ 1</div>
                                </div>
                            </div>
                        );
                    })}
            </section>
            <section className="flex flex-row items-center">
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
                                        currentPage: (filters.currentPage -= 1),
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
                                        currentPage: (filters.currentPage += 1),
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
        </div>
    );
}

Home.getLayout = function getLayout(page: ReactElement) {
    return <MainLayout>{page}</MainLayout>;
};

export default Home;
