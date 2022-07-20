import {
    faCalendarPlus,
    faPlus,
    faSearch,
    faTimesCircle,
    faCircleXmark,
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
import { Patient } from '../../types';
import Swal from 'sweetalert2';
registerLocale('th', th);

const MIGRAINE_CARE_PROGRAME_PRICE = 399;

const defaultForm = {
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

type NewReportProps = {
    patient: Patient;
    specialistId: string;
    appointmentId: string;
};

export default function NewReport({
    patient,
    specialistId,
    appointmentId,
}: NewReportProps) {
    const [formData, setFormData] = useState<any | never>(defaultForm);
    const [isShowModalMedicine, setIsShowModalMedicine] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [isShowSearchResult, setIsShowSearchResult] = useState(false);
    const [includeDates, setIncludeDate] = useState([]);
    const [scheduleAppointment, setScheduleAppointment] = useState([]);
    const [dateSelected, setDateSelected] = useState('');
    const [scheduleSelected, setScheduleSelected] = useState<any | never>(null);
    const [isShowModalDate, setIsShowModalDate] = useState(false);
    const [isMigrainePremiumCare, setIsMigrainePremiumCare] = useState(false);
    const [nextAppointmentId, setNextAppointmentId] = useState<number | any>(
        null
    );
    const [specialists, setSpecialists] = useState<any>({
        service_fee: 0,
    });
    const [totalPriceOrders, setTotalPriceOrder] = useState(0);
    const [headerReport, setHeaderReport] = useState<any>();

    async function initFormData() {
        const res = await specialistApi.getNewCardByAppointmentId(
            appointmentId
        );
        setHeaderReport(res.data ? res.data.header_report : null);

        if (res.data) {
            if (res.data.next_doctor_appointment) {
                setDateSelected(
                    res.data.next_doctor_appointment.next_appointment_date
                );
                setScheduleSelected(
                    res.data.next_doctor_appointment.next_appointment_time
                );
                setNextAppointmentId(
                    res.data.next_doctor_appointment.next_appointment_id
                );
            }
            if (res.data.patient_order) {
                setFormData({
                    ...formData,
                    patient_order: res.data.patient_order,
                });
            }
            if (res.data.patient_report) {
                setFormData({
                    ...formData,
                    ...res.data.patient_report,
                });
            }
        }

        setFormData({
            ...formData,
            doctor_appointment_id: appointmentId,
            specialists_id: specialistId,
            member_id: patient.member_id,
        });
    }

    async function summaryOrderPrice() {
        let totalPrice = 0;
        formData.patient_order.map((e: any) => {
            totalPrice += e.price * e.amount;
        });
        if (isMigrainePremiumCare && !patient.is_premium_member)
            totalPrice += MIGRAINE_CARE_PROGRAME_PRICE;
        if (scheduleSelected) totalPrice += specialists.service_fee;
        setTotalPriceOrder(totalPrice);
    }

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
                (e: any, index: number) => indexDel != index
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

        setSpecialists(res.data);
        const result = res.data.available_date.map((e: string) => new Date(e));
        setIncludeDate(result);
    }

    async function getScheduleAppointment(date: Date) {
        const dateString = moment(date).format('YYYY-MM-DD');
        setDateSelected(dateString);
        setScheduleSelected('');
        const specialistId = 1;
        const res = await specialistApi.getScheduleAppointment(
            specialistId,
            dateString
        );
        console.log(res.data);
        if (res.data) {
            const schedules = res.data.filter((e: any) => e.is_available);
            setScheduleAppointment(schedules);
        } else {
            setScheduleAppointment([]);
        }
    }

    async function saveNextAppointment() {
        setIsShowModalDate(false);
        const data = {
            specialists_id: specialistId,
            member_id: patient.member_id,
            doctor_appointment_date: dateSelected,
            schedule_time_id: scheduleSelected.schedule_time_id,
        };
        const res = await specialistApi.saveNextAppointment(data);
        console.log('saveAppointment api 1', res);

        // New ยิง firebase
        const dataSendFirebase = {
            member_id: patient.member_id,
            next_appointment_date: dateSelected,
            next_appointment_id: res.data.apppointment_id,
            next_appointment_time: `${scheduleSelected.start_time}-${scheduleSelected.end_time}`,
        };
        const resFirebase = await specialistApi.updateNextAppointmentFirebase(
            dataSendFirebase
        );
        console.log('resFirebase', resFirebase);
        if (res.data.apppointment_id && resFirebase.success) {
            Swal.fire({
                title: 'เรียบร้อย',
                text: 'การนัดหมายครั้งถัดไป ถูกสร้างแล้ว',
                icon: 'success',
            });
            setNextAppointmentId(res.data.apppointment_id);
        } else {
            console.log('error something');
        }
    }

    async function createOrders() {
        // บันทึกรายการยา
        const data = {
            doctor_appointment_id: appointmentId,
            next_doctor_appointment_id: nextAppointmentId
                ? nextAppointmentId
                : null,
            member_id: patient.member_id,
            item_patient_order: formData.patient_order
                ? formData.patient_order
                : null,
        };
        const migrainePremiumCare = {
            product_id_provider: 'mcp_clinic_3_months',
            amount: 3,
            indications: '',
            price: MIGRAINE_CARE_PROGRAME_PRICE,
        };
        if (isMigrainePremiumCare && !patient.is_premium_member)
            data.item_patient_order.push(migrainePremiumCare);
        const res = await specialistApi.createOrders(data);
        console.log('createOrders', res);
        if (!res.success) {
            return false;
        }
    }

    async function createReport() {
        const res = await specialistApi.createReport(formData);
        console.log('create report', res);
        if (!res.success) {
            return false;
        }
    }

    async function updateStatusSuccessConsult() {
        const data = {
            doctor_appointment_id: appointmentId,
            doctor_appointment_status: 2, // 2 = successful_doctor_consultation
        };
        const res = await specialistApi.updateStatusSuccessConsult(data);
        console.log('updateStatusSuccessConsult', res);
        if (!res.success) {
            return false;
        }
    }

    async function sendToChat() {
        const data = {
            doctor_appointment_id: appointmentId,
            member_id: patient.member_id,
            specialists_id: specialistId,
        };
        const res = await specialistApi.sendToChat(data);
        console.log('sendToChat', res);
        if (!res.success) {
            return false;
        }
    }

    async function sendAppointment() {
        // ส่งสรุปการรักษา
        Swal.fire({
            title: 'ยืนยัน ?',
            text: 'ต้องการส่งสรุปการรักษา ใช่หรือไม่ ?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ตกลง',
            cancelButtonColor: '#ccc',
            confirmButtonColor: '#25AC67',
        }).then(async (confirm: any) => {
            if (confirm.isConfirmed) {
                try {
                    await createOrders();
                    await createReport();
                    await updateStatusSuccessConsult();
                    await sendToChat();
                    Swal.fire({
                        title: 'เรียบร้อย',
                        text: 'ส่งสรุปการรักษา เรียบร้อยแล้ว',
                        icon: 'success',
                    });
                } catch (error) {
                    Swal.fire({
                        title: 'ไม่สำเร็จ',
                        text: 'เกิดข้อผิดพลาดในการส่งสรุปการรักษา กรุณาลองใหม่ภายหลัง',
                        icon: 'error',
                    });
                }
            }
        });
    }

    function openDateModal() {
        const dateString = moment(includeDates[0]).format('YYYY-MM-DD');
        setDateSelected(dateString);
        getScheduleAppointment(includeDates[0]);
        setIsShowModalDate(true);
    }

    async function deleteAppointment() {
        if (!nextAppointmentId) return;

        const { success } = await specialistApi.deleteAppointment(
            nextAppointmentId
        );

        if (success) {
            Swal.fire({
                title: 'เรียบร้อย',
                text: 'การนัดหมายครั้งถัดไป ถูกลบแล้ว',
                icon: 'success',
            });
            setDateSelected('');
            setScheduleSelected(null);
            setNextAppointmentId(null);
        }
    }

    function handleDeleteAppointmentClick() {
        if (!nextAppointmentId) return;
        Swal.fire({
            title: 'ยืนยัน ?',
            text: 'ต้องการลบนัดตรวจครั้งต่อไปใช่หรือไม่?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก',
            confirmButtonText: 'ยืนยัน',
            cancelButtonColor: '#ccc',
            confirmButtonColor: '#fca5a5',
        }).then(async (confirm: any) => {
            if (confirm.isConfirmed) {
                deleteAppointment();
            }
        });
    }

    useEffect(() => {
        initFormData();
        getSpecialist();
        setIsMigrainePremiumCare(patient.is_premium_member);
    }, []);

    useEffect(() => {
        summaryOrderPrice();
        // eslint-disable-next-line
    }, [formData, isMigrainePremiumCare, scheduleSelected, specialists]);

    return (
        <>
            {specialists && (
                <div className="flex flex-col bg-white rounded-[6px] mb-[20px]">
                    <div className="p-4 flex flex-row text-[14px] border-b-2">
                        <div>
                            {headerReport && headerReport.appointment_date}{' '}
                            {headerReport && headerReport.appointment_time}
                        </div>
                        <div className="flex-1 text-right">
                            {specialists.specialist_prename}{' '}
                            {specialists.specialist_fname}
                            {specialists.specialist_lname}{' '}
                            {' ผู้เข้ารับคำปรึกษา '} {patient.fname}{' '}
                            {patient.lname}
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
                                value={
                                    formData.behaviors_trigger_reduce_migraines
                                }
                                setValue={(text) =>
                                    setFormData({
                                        ...formData,
                                        behaviors_trigger_reduce_migraines:
                                            text,
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
                            <div className="flex space-x-2 justify-between items-baseline">
                                <h2 className="font-noto-bold text-sm truncate">
                                    คำสั่งรักษา
                                </h2>
                                <button
                                    onClick={() => {
                                        sendAppointment();
                                    }}
                                    className="rounded text-sm text-white bg-i-green truncate  px-4 py-2"
                                >
                                    บันทึกและส่งสรุปการรักษา
                                </button>
                            </div>
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
                                {scheduleSelected && (
                                    <li className="flex flex-row">
                                        <span className="flex-1 py-2">
                                            0. Tele Migraine {dateSelected}{' '}
                                            {scheduleSelected.start_time +
                                                ' - ' +
                                                scheduleSelected.end_time}
                                        </span>
                                        <span className="py-2 pr-2">
                                            {specialists.service_fee + ' บ.'}
                                        </span>
                                    </li>
                                )}
                                {isMigrainePremiumCare &&
                                    !patient.is_premium_member && (
                                        <li className="flex flex-row">
                                            <span className="flex-1 py-2">
                                                {scheduleSelected ? 1 : 0}.
                                                Migraine Care Programe 3 เดือน
                                            </span>
                                            <span className="py-2 pr-2">
                                                {`${MIGRAINE_CARE_PROGRAME_PRICE} บ.`}
                                            </span>
                                            {!patient.is_premium_member && (
                                                <span
                                                    className="py-2 cursor-pointer"
                                                    onClick={() => {
                                                        setIsMigrainePremiumCare(
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
                                                    {index +
                                                        (scheduleSelected &&
                                                        !patient.is_premium_member &&
                                                        isMigrainePremiumCare
                                                            ? 2
                                                            : 1)}
                                                    . {e.common_name} {e.amount}{' '}
                                                    {e.unit}{' '}
                                                </span>
                                                <span className="py-2 pr-2">
                                                    {e.indications}
                                                </span>
                                                <span className="py-2 pr-2">
                                                    {e.price * e.amount}
                                                    {' บ.'}
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
                            <div className="text-right">
                                รวมทั้งหมด {totalPriceOrders} บ.
                            </div>
                            <div>
                                <div className="flex flex-row mb-2">
                                    <h2 className="flex-1 py-2 font-noto-bold text-[14px]">
                                        นัดตรวจครั้งต่อไป
                                    </h2>
                                    {!scheduleSelected && (
                                        <button
                                            className="text-i-green font-noto-bold p-2"
                                            onClick={() => {
                                                openDateModal();
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={faCalendarPlus}
                                                className="mr-2 font-bold"
                                            />
                                            เลือกวันตรวจ
                                        </button>
                                    )}
                                </div>
                                {dateSelected && scheduleSelected && (
                                    <div className="flex justify-between items-center space-x-4">
                                        <span className="truncate">
                                            {moment(dateSelected).format(
                                                'DD/MM/YYYY'
                                            )}
                                            {` เวลา ${scheduleSelected.start_time} - ${scheduleSelected.end_time}`}
                                        </span>
                                        <button
                                            onClick={
                                                handleDeleteAppointmentClick
                                            }
                                        >
                                            <FontAwesomeIcon
                                                icon={faCircleXmark}
                                                className="text-[#CBD5DD] text-base"
                                            />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
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
                                                checked={isMigrainePremiumCare}
                                                onChange={() => {
                                                    setIsMigrainePremiumCare(
                                                        !isMigrainePremiumCare
                                                    );
                                                }}
                                            />
                                        )}
                                        {patient.is_premium_member && (
                                            <span>0</span>
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
                                                    {index + 1}
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
                                                <td className="w-[150px]">
                                                    <div className="relative">
                                                        <input
                                                            className="pr-[60%] w-full"
                                                            type="text"
                                                            pattern="\d*"
                                                            value={e.amount}
                                                            onKeyPress={(e) =>
                                                                !/[0-9]/.test(
                                                                    e.key
                                                                ) &&
                                                                e.preventDefault()
                                                            }
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
                                                    </div>
                                                </td>
                                                <td>
                                                    <textarea
                                                        className="w-full p-2"
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
                    setDateSelected('');
                    setScheduleSelected(null);
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
                        <button
                            disabled={!scheduleSelected}
                            className={`bg-i-green w-full text-white rounded-[8px] h-[44px] ${
                                !scheduleSelected &&
                                'bg-slate-200 cursor-not-allowed'
                            }`}
                            onClick={() => {
                                saveNextAppointment();
                            }}
                        >
                            ยืนยันวันนัด
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
