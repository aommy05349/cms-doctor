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
import numeral from 'numeral';
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

    function checkDuplicateMedication(medication: any) {
        return !!formData.patient_order.find(
            (e: any) => e.id === medication.id
        );
    }

    function addOrder(order: any) {
        const isDuplicate = checkDuplicateMedication(order);

        if (!isDuplicate) {
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
        }
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
        if (res.data && res.data.available_date) {
            const result = res.data.available_date.map(
                (e: string) => new Date(e)
            );
            setIncludeDate(result);
        }
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

        // New ????????? firebase
        const dataSendFirebase = {
            member_id: patient.member_id,
            next_appointment_date: dateSelected,
            next_appointment_id: res.data.apppointment_id,
            next_appointment_time: `${scheduleSelected.start_time}-${scheduleSelected.end_time}`,
        };
        const resFirebase = await specialistApi.updateNextAppointmentFirebase(
            dataSendFirebase
        );
        if (res.data.apppointment_id && resFirebase.success) {
            Swal.fire({
                title: '???????????????????????????',
                text: '???????????????????????????????????????????????????????????? ????????????????????????????????????',
                icon: 'success',
            });
            setNextAppointmentId(res.data.apppointment_id);
        }
    }

    async function createOrders() {
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
        if (!res.success) {
            return false;
        }
    }

    async function createReport() {
        const res = await specialistApi.createReport(formData);
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
        if (!res.success) {
            return false;
        }
    }

    async function sendAppointment() {
        Swal.fire({
            title: '?????????????????? ?',
            text: '?????????????????????????????????????????????????????????????????? ?????????????????????????????? ?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: '??????????????????',
            confirmButtonText: '????????????',
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
                        title: '???????????????????????????',
                        text: '????????????????????????????????????????????? ???????????????????????????????????????',
                        icon: 'success',
                    });
                } catch (error) {
                    Swal.fire({
                        title: '???????????????????????????',
                        text: '?????????????????????????????????????????????????????????????????????????????????????????????????????? ?????????????????????????????????????????????????????????',
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
                title: '???????????????????????????',
                text: '???????????????????????????????????????????????????????????? ???????????????????????????',
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
            title: '?????????????????? ?',
            text: '?????????????????????????????????????????????????????????????????????????????????????????????????????????????',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: '??????????????????',
            confirmButtonText: '??????????????????',
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
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        summaryOrderPrice();
        // eslint-disable-next-line
    }, [formData, isMigrainePremiumCare, scheduleSelected, specialists]);

    return (
        <>
            {specialists && (
                <div className="flex flex-col bg-white rounded-[6px] mb-[20px]">
                    <div className="p-4 flex flex-row text-[14px] border-b">
                        <div>
                            {headerReport && headerReport.appointment_date}{' '}
                            {headerReport && headerReport.appointment_time}
                        </div>
                        <div className="flex-1 text-right">
                            {specialists.specialist_prename}{' '}
                            {specialists.specialist_fname}
                            {specialists.specialist_lname}{' '}
                            {' ??????????????????????????????????????????????????????: '} {patient.fname}{' '}
                            {patient.lname}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x text-sm">
                        <div className="p-4">
                            <h2 className="font-noto-bold">??????????????????????????????????????????</h2>
                            <FieldEditor
                                value={formData.note}
                                setValue={(text) =>
                                    setFormData({
                                        ...formData,
                                        note: text,
                                    })
                                }
                            />
                            <h2 className="font-noto-bold mb-2">
                                ????????????????????????????????????????????????
                            </h2>
                            <FieldEditor
                                title="????????????????????????????????????????????????????????????"
                                value={formData.frequency_and_severity}
                                setValue={(text) =>
                                    setFormData({
                                        ...formData,
                                        frequency_and_severity: text,
                                    })
                                }
                            />
                            <FieldEditor
                                title="?????????????????????????????????"
                                value={formData.trigger_note}
                                setValue={(text) =>
                                    setFormData({
                                        ...formData,
                                        trigger_note: text,
                                    })
                                }
                            />
                            <FieldEditor
                                title="????????????????????????????????????????????? ????????????????????????????????????"
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
                                title="????????????????????????"
                                value={formData.acute}
                                setValue={(text) =>
                                    setFormData({
                                        ...formData,
                                        acute: text,
                                    })
                                }
                            />
                            <FieldEditor
                                title="???????????????????????????"
                                value={formData.prevention}
                                setValue={(text) =>
                                    setFormData({
                                        ...formData,
                                        prevention: text,
                                    })
                                }
                            />
                            <FieldEditor
                                title="?????????????????????"
                                value={formData.comorbidity}
                                setValue={(text) =>
                                    setFormData({
                                        ...formData,
                                        comorbidity: text,
                                    })
                                }
                            />
                        </div>
                        <div className="p-4 relative">
                            <button
                                onClick={() => {
                                    sendAppointment();
                                }}
                                className="rounded text-sm text-white bg-i-green truncate  px-4 py-2 absolute top-2 right-4"
                            >
                                ????????????????????????????????????????????????????????????????????????
                            </button>
                            <h2 className="font-noto-bold mb-2">?????????????????????????????????</h2>
                            <FieldEditor
                                title="????????????????????????"
                                value={formData.diagnose}
                                setValue={(text) =>
                                    setFormData({
                                        ...formData,
                                        diagnose: text,
                                    })
                                }
                            />
                            <FieldEditor
                                title="?????????????????????"
                                value={formData.advice}
                                setValue={(text) =>
                                    setFormData({
                                        ...formData,
                                        advice: text,
                                    })
                                }
                            />
                            <div className="mb-4">
                                <div className="flex justify-between items-baseline space-x-2">
                                    <h2 className="font-noto-bold mb-2">
                                        ????????????????????????
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
                                        ???????????????????????????????????????
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
                                                {specialists.service_fee +
                                                    ' ???.'}
                                            </span>
                                        </li>
                                    )}
                                    {isMigrainePremiumCare &&
                                        !patient.is_premium_member && (
                                            <li className="flex flex-row">
                                                <span className="flex-1 py-2">
                                                    {scheduleSelected ? 1 : 0}.
                                                    Migraine Care Programe 3
                                                    ???????????????
                                                </span>
                                                <span className="py-2 pr-2">
                                                    {`${MIGRAINE_CARE_PROGRAME_PRICE} ???.`}
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
                                                        . {e.clinical_name}{' '}
                                                        {e.mg
                                                            ? numeral(
                                                                  +e.mg
                                                              ).format('0,0') +
                                                              ' mg'
                                                            : ''}{' '}
                                                        {numeral(
                                                            e.amount || 0
                                                        ).format('0,0')}{' '}
                                                        {e.unit}{' '}
                                                    </span>
                                                    <span className="py-2 pr-2">
                                                        {e.indications}
                                                    </span>
                                                    <span className="py-2 pr-2">
                                                        {e.price * e.amount}
                                                        {' ???.'}
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
                                    ?????????????????????????????? {totalPriceOrders} ???.
                                </div>
                            </div>
                            <div>
                                <div className="flex flex-row mb-2">
                                    <h2 className="flex-1 py-2 font-noto-bold text-[14px]">
                                        ???????????????????????????????????????????????????
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
                                            ????????????????????????????????????
                                        </button>
                                    )}
                                </div>
                                {dateSelected && scheduleSelected && (
                                    <div className="flex justify-between items-center space-x-4">
                                        <span className="truncate">
                                            {moment(dateSelected).format(
                                                'DD/MM/YYYY'
                                            )}
                                            {` ???????????? ${scheduleSelected.start_time} - ${scheduleSelected.end_time}`}
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
                title="????????????????????????"
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
                                placeholder="????????????????????? ????????????????????????????????????????????????????????????????????????????????????"
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
                                                {data.clinical_name}{' '}
                                                {data.mg
                                                    ? numeral(+data.mg).format(
                                                          '0,0'
                                                      ) + ' mg'
                                                    : ''}
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
                                    <td>?????????????????????????????????????????????</td>
                                    <td>??????????????????????????????</td>
                                    <td>???????????????</td>
                                    <td>???????????????????????????</td>
                                    <td width={200}>?????????????????????????????????</td>
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
                                    <td>3 ???????????????</td>
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
                                                <td>
                                                    {e.clinical_name}{' '}
                                                    {e.mg
                                                        ? numeral(+e.mg).format(
                                                              '0,0'
                                                          ) + ' mg'
                                                        : ''}
                                                </td>
                                                <td>
                                                    <div className="flex flex-row items-center h-full">
                                                        <div className="flex-1">
                                                            {e.trade_name}
                                                        </div>
                                                        <button className="text-i-green mx-2">
                                                            ???????????????????????????
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
                title="????????????????????????????????????"
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
                                ???????????????????????????
                            </div>
                            <div className="">
                                ????????????????????????????????????????????????????????????????????????????????????????????????????????????
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
                            ????????????????????????????????????
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
