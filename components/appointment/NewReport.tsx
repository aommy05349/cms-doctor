import {
    faCalendarPlus,
    faPlus,
    faSearch,
    faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { patientApi, specialistApi } from '../../services';
import Modal from '../Modal';
import FieldEditor from './FieldEditor';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import th from 'date-fns/locale/th';
import moment from 'moment';
registerLocale('th', th);

const defaultForm = {
    doctor_appointment_id: 93,
    specialists_id: 1,
    member_id: 6204,
    frequency_and_severity: '',
    trigger_note: '',
    behaviors_trigger_reduce_migraines: '',
    acute: '',
    prevention: '',
    comorbidity: '',
    note: '',
    diagnose: '',
    advice: '',
    patient_order: [],
    next_appointment_date: null,
};

interface PatientData {
    fname: string;
    lname: string;
    is_premium_member: boolean;
    member_id: string;
}

type NewReportProps = {
    patient: PatientData;
    specialistId: string;
};

export default function NewReport({ patient, specialistId }: NewReportProps) {
    const [formData, setFormData] = useState<any | never>(defaultForm);
    const [isShowModalMedicine, setIsShowModalMedicine] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [isShowSearchResult, setIsShowSearchResult] = useState(false);
    const [includeDates, setIncludeDate] = useState([]);
    const [scheduleAppointment, setScheduleAppointment] = useState([]);
    const [dateSelected, setDateSelected] = useState('');
    const [scheduleSelected, setScheduleSelected] = useState<any | never>(null);
    const [isShowModalDate, setIsShowModalDate] = useState(false);
    const [isMegrainePremiumCare, setIsMegrainePremiumCare] = useState(false);

    async function searchOrder(searchTerm: string) {
        if (searchTerm == '') {
            setSearchResult([]);
        } else {
            const res = await patientApi.searchPatientOrder(searchTerm);
            setSearchResult(res.data ? res.data : []);
        }
    }

    function addOrder(order: any) {
        setFormData({
            ...formData,
            patient_order: [
                ...formData.patient_order,
                {
                    ...order,
                    amount: '',
                    indications: '',
                },
            ],
        });
        setIsShowSearchResult(false);
    }

    function deleteOrder(indexDel: number) {
        setFormData({
            ...formData,
            patient_order: formData.patient_order.filter(
                (index: number) => indexDel != index
            ),
        });
    }

    function setAmount(indexSelected: number, value: string) {
        let orders = [...formData.patient_order];
        let order = { ...orders[indexSelected] };
        order.amount = value;
        orders[indexSelected] = order;
        setFormData({
            ...formData,
            patient_order: orders,
        });
    }

    function setIndications(indexSelected: number, value: string) {
        let orders = [...formData.patient_order];
        let order = { ...orders[indexSelected] };
        order.indications = value;
        orders[indexSelected] = order;
        setFormData({
            ...formData,
            patient_order: orders,
        });
    }

    async function getSpecialist() {
        const res = await specialistApi.getSpecialistById(specialistId);
        console.log('spec', res.data)
        const result = res.data.available_date.map((e: string) => new Date(e));
        setIncludeDate(result);
    }

    async function getScheduleAppointment(date: Date) {
        const dateString = moment(date).format('YYYY-MM-DD');
        setDateSelected(dateString);
        setScheduleSelected(''); // clear schedule selected
        console.log('dateString', dateString);
        const specialistId = 1;
        const res = await specialistApi.getScheduleAppointment(
            specialistId,
            dateString
        );
        console.log(res.data);
        if (res.data) {
            setScheduleAppointment(res.data);
        } else {
            setScheduleAppointment([]);
        }
    }

    async function saveNextAppointment() {
        setIsShowModalDate(false)
        console.log('save appointment')
        const data = {
            specialists_id: specialistId,
            member_id: patient.member_id,
            doctor_appointment_date: dateSelected,
            schedule_time_id: scheduleSelected.schedule_time_id
        }
        console.log('data', data)
        // const res = await specialistApi.saveNextAppointment()
    }

    useEffect(() => {
        getSpecialist();
        setIsMegrainePremiumCare(patient.is_premium_member);
    }, []);

    return (
        <>
            <div className="flex flex-col bg-white rounded-[6px] mb-[20px]">
                <div className="p-4 flex flex-row text-[14px] border-b-2">
                    <div>วันที่03/08/2565 เวลา 16:40-16:55</div>
                    <div className="flex-1 text-right">
                        แพทย์ ผศ.นพ. สุรัตน์ ตันประเวช ผู้รับคำปรึกษา{' '}
                        {patient.fname} {patient.lname}
                    </div>
                </div>
                <div className=" flex flex-row">
                    <div className="p-4 text-[14px] border-r-2 flex-1 ">
                        <h2 className="font-noto-bold text-[14px] mb-2">
                            รายละเอียด
                        </h2>
                        <FieldEditor
                            title="ความถี่และความรุนแรง"
                            value={formData.frequency_and_severity}
                            setValue={(text) =>
                                setFormData({
                                    ...formData,
                                    frequency_and_severity: text,
                                })
                            }
                        />
                        <FieldEditor
                            title="สิ่งกระตุ้น"
                            value={formData.trigger_note}
                            setValue={(text) =>
                                setFormData({
                                    ...formData,
                                    trigger_note: text,
                                })
                            }
                        />
                        <FieldEditor
                            title="พฤติกรรมกระตุ้น หรือลดไมเกรน"
                            value={formData.behaviors_trigger_reduce_migraines}
                            setValue={(text) =>
                                setFormData({
                                    ...formData,
                                    behaviors_trigger_reduce_migraines: text,
                                })
                            }
                        />
                        <FieldEditor
                            title="ยาแก้ปวด"
                            value={formData.acute}
                            setValue={(text) =>
                                setFormData({
                                    ...formData,
                                    acute: text,
                                })
                            }
                        />
                        <FieldEditor
                            title="ยาป้องกัน"
                            value={formData.prevention}
                            setValue={(text) =>
                                setFormData({
                                    ...formData,
                                    prevention: text,
                                })
                            }
                        />
                        <FieldEditor
                            title="โรคร่วม"
                            value={formData.comorbidity}
                            setValue={(text) =>
                                setFormData({
                                    ...formData,
                                    comorbidity: text,
                                })
                            }
                        />
                        <FieldEditor
                            title="บันทึก อื่นๆ"
                            value={formData.note}
                            setValue={(text) =>
                                setFormData({
                                    ...formData,
                                    note: text,
                                })
                            }
                        />
                    </div>
                    <div className="p-4 text-[14px] flex-1 relative flex flex-col">
                        <div className="flex-1">
                            <h2 className="font-noto-bold text-[14px] mb-2">
                                คำสั่งรักษา
                            </h2>
                            <button className="absolute right-2 top-2 bg-[#EFFAF5] text-i-green rounded-[8px] px-4 py-2">
                                ส่งสรุปการรักษา
                            </button>
                            <FieldEditor
                                title="วินิจฉัย"
                                value={formData.diagnose}
                                setValue={(text) =>
                                    setFormData({
                                        ...formData,
                                        diagnose: text,
                                    })
                                }
                            />
                            <FieldEditor
                                title="คำแนะนำ"
                                value={formData.advice}
                                setValue={(text) =>
                                    setFormData({
                                        ...formData,
                                        advice: text,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <div className="flex flex-row">
                                <h2 className="flex-1 py-2 font-noto-bold text-[14px]">
                                    รายการยา
                                </h2>
                                <button
                                    className="text-i-green font-noto-bold p-2"
                                    onClick={() => {
                                        setIsShowModalMedicine(true);
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        className="mr-2 font-bold"
                                    />
                                    เพิ่มรายการยา
                                </button>
                            </div>
                            <ol start={0}>
                                {isMegrainePremiumCare && (
                                    <li className="flex flex-row">
                                        <span className="flex-1 py-2">
                                            0. Migraine Care Programe 3 เดือน
                                        </span>
                                        {!patient.is_premium_member && (
                                            <span
                                                className="py-2 cursor-pointer"
                                                onClick={() => {
                                                    setIsMegrainePremiumCare(
                                                        false
                                                    );
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTimesCircle}
                                                    className="text-[#CBD5DD] text-xl hover:text-i-red duration-300"
                                                />
                                            </span>
                                        )}
                                    </li>
                                )}
                                {formData.patient_order.map(
                                    (e: any, index: number) => {
                                        return (
                                            <li
                                                className="flex flex-row"
                                                key={index}
                                            >
                                                <span className="flex-1 py-2">
                                                    {index + 1}. {e.common_name}{' '}
                                                    {e.amount} {e.unit}{' '}
                                                    {e.indications}
                                                </span>
                                                <span
                                                    className="py-2 cursor-pointer"
                                                    onClick={() => {
                                                        deleteOrder(index);
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faTimesCircle}
                                                        className="text-[#CBD5DD] text-xl hover:text-i-red duration-300"
                                                    />
                                                </span>
                                            </li>
                                        );
                                    }
                                )}
                            </ol>
                        </div>
                        <div>
                            <div className="flex flex-row mb-2">
                                <h2 className="flex-1 py-2 font-noto-bold text-[14px]">
                                    นัดตรวจครั้งต่อไป
                                </h2>
                                <button
                                    className="text-i-green font-noto-bold p-2"
                                    onClick={() => {
                                        setIsShowModalDate(true);
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faCalendarPlus}
                                        className="mr-2 font-bold"
                                    />
                                    เลือกวันตรวจ
                                </button>
                            </div>
                            <div className="">
                                {dateSelected &&
                                    moment(dateSelected).format('DD/MM/YYYY')}
                                {scheduleSelected &&
                                    ` เวลา ${scheduleSelected.start_time} - ${scheduleSelected.end_time}`}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                title="รายการยา"
                isShow={isShowModalMedicine}
                width="1000px"
                onClose={() => {
                    setIsShowModalMedicine(false);
                }}
            >
                <div className="">
                    <div className="bg-[#EFFAF5] flex flex-row">
                        <div className="p-2 px-4">
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="text-i-green text-xl"
                            />
                        </div>
                        <div className="flex-1 relative">
                            <input
                                className="w-full border-none bg-[#EFFAF5] h-[40px] pl-2 duration-300"
                                placeholder="“ค้นหา” ชื่อยาเพื่อเริ่มสั่งรายการยา"
                                onInput={(event: any) => {
                                    searchOrder(event.target.value);
                                }}
                                onFocus={() => {
                                    setTimeout(() => {
                                        setIsShowSearchResult(true);
                                    }, 200);
                                }}
                                onBlur={() => {
                                    setTimeout(() => {
                                        setIsShowSearchResult(false);
                                    }, 500);
                                }}
                            />
                            {isShowSearchResult && (
                                <div className="absolute w-[95%] max-h-[300px] overflow-y-auto overflow-x-hidden bg-white border-2 z-30">
                                    {searchResult.map((data: any) => {
                                        return (
                                            <div
                                                key={data.id}
                                                className="p-3 hover:bg-gray-100 duration-300 cursor-pointer bg-white"
                                                onClick={() => {
                                                    addOrder(data);
                                                }}
                                            >
                                                {data.common_name}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="">
                        <table>
                            <thead className="font-noto-medium bg-[#cbd5dd] text-[12px]">
                                <tr>
                                    <td className="w-[40px] text-center">N.</td>
                                    <td>ชื่อสามัญ</td>
                                    <td>ชื่อการค้า</td>
                                    <td>จำนวน</td>
                                    <td>ข้อบ่งใช้</td>
                                    <td width={200}>ผลข้างเคียง</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-[14px]">
                                    <td className="w-[40px] text-center">
                                        {!patient.is_premium_member && (
                                            <input
                                                type="checkbox"
                                                checked={isMegrainePremiumCare}
                                                onChange={() => {
                                                    setIsMegrainePremiumCare(
                                                        !isMegrainePremiumCare
                                                    );
                                                }}
                                            />
                                        )}
                                    </td>
                                    <td>Migraine Care Program</td>
                                    <td>Premium User</td>
                                    <td>3 เดือน</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                {formData.patient_order.map(
                                    (e: any, index: number) => {
                                        return (
                                            <tr
                                                className="text-[14px]"
                                                key={index}
                                            >
                                                <td className="w-[40px] text-center">
                                                    {index}
                                                </td>
                                                <td>{e.common_name}</td>
                                                <td>
                                                    <div className="flex flex-row items-center h-full">
                                                        <div className="flex-1">
                                                            {e.trade_name}
                                                        </div>
                                                        <button className="text-i-green mx-2">
                                                            เพิ่มชื่อ
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="relative w-[150px]">
                                                    <input
                                                        className="pr-[60%] w-full"
                                                        type="text"
                                                        value={e.amount}
                                                        onInput={(
                                                            event: any
                                                        ) => {
                                                            setAmount(
                                                                index,
                                                                event.target
                                                                    .value
                                                            );
                                                        }}
                                                    />
                                                    <span className="absolute left-[90%] top-[50%] translate-y-[-50%] translate-x-[-100%]">
                                                        {e.unit}
                                                    </span>
                                                </td>
                                                <td>
                                                    <textarea
                                                        className="w-full"
                                                        value={e.indications}
                                                        onInput={(
                                                            event: any
                                                        ) => {
                                                            setIndications(
                                                                index,
                                                                event.target
                                                                    .value
                                                            );
                                                        }}
                                                    />
                                                </td>
                                                <td>{e.side_effect}</td>
                                                <td className="pr-4">
                                                    <button>
                                                        <FontAwesomeIcon
                                                            icon={faTimesCircle}
                                                            className="text-[#CBD5DD] text-xl hover:text-i-red duration-300"
                                                            onClick={() => {
                                                                deleteOrder(
                                                                    index
                                                                );
                                                            }}
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal>
            <Modal
                title="ตารางนัดหมาย"
                isShow={isShowModalDate}
                width="350px"
                onClose={() => {
                    setDateSelected('')
                    setScheduleSelected(null)
                    setIsShowModalDate(false);
                }}
            >
                <div>
                    <DatePicker
                        inline
                        includeDates={includeDates}
                        dateFormat="YYYY-MM-DD"
                        locale="th"
                        calendarStartDay={1}
                        onChange={(date: Date) => getScheduleAppointment(date)}
                    />
                    <div className="p-4">
                        <div className="flex flex-row text-[14px] mb-3">
                            <div className="flex-1 font-noto-bold">
                                เลือกเวลา
                            </div>
                            <div className="">
                                ท่านจะไม่สามารถแก้ไขวันนัดภายหลังได้
                            </div>
                        </div>
                        <div className="grid grid-cols-3">
                            {scheduleAppointment.map((e: any) => {
                                return (
                                    <div
                                        key={e.id}
                                        className={`text-[14px] text-center rounded-[8px] p-1 border-[1px] m-1 cursor-pointer hover:text-i-green duration-300 ${
                                            e == scheduleSelected
                                                ? 'text-i-green border-i-green'
                                                : 'text-[#6C6C6C]'
                                        }`}
                                        onClick={() => {
                                            console.log('e', e);
                                            setScheduleSelected(e);
                                        }}
                                    >
                                        {e.start_time} - {e.end_time}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="p-2 border-t-2">
                        <button disabled={!scheduleSelected} className={`bg-i-green w-full text-white rounded-[8px] h-[44px] ${!scheduleSelected && 'bg-slate-200 cursor-not-allowed'}`} onClick={() => {saveNextAppointment()}}>
                            ยืนยันวันนัด
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
