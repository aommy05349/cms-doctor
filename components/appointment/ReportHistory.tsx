import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { patientApi, specialistApi } from '../../services';

interface ReportProps {
    memberId: string;
}

export default function ReportHistory({ memberId }: ReportProps) {
    const [reports, setReports] = useState([]);
    const router = useRouter();

    async function getHistoryReports() {
        const res = await patientApi.getReportHistory(memberId);
        console.log('history reports', res.data);
        setReports(res.data);
    }
    useEffect(() => {
        getHistoryReports();
        // eslint-disable-next-line
    }, [router]);

    async function resendAppointment(dateStr: string, timerStr: string) {
        Swal.fire({
            title: 'เรียบร้อย',
            text: `ทำการส่งสรุปการรักษาของวันที่ ${dateStr} ${timerStr}`,
            icon: 'success',
        });
    }

    return (
        <div>
            {reports &&
                reports.map((data: any, index: number) => {
                    return (
                        <div
                            className="flex flex-col bg-white rounded-[6px] mb-[20px]"
                            key={data.patient_report.id}
                        >
                            <div className="p-4 flex flex-row text-[14px] border-b-2">
                                <div>
                                    {data.header_report.appointment_date}{' '}
                                    {data.header_report.appointment_time}
                                </div>
                                <div className="flex-1 text-right">
                                    {
                                        data.header_report
                                            .appointment_specialist_name
                                    }{' '}
                                    {data.header_report.patient_name}
                                </div>
                            </div>
                            <div className=" flex flex-row">
                                <div className="p-4 text-[14px] border-r-2 flex-1 ">
                                    <h2 className="font-noto-bold text-[14px] mb-2">
                                        รายละเอียด
                                    </h2>
                                    <h3 className="text-[#179B97] mb-2">
                                        ความถี่และความรุนแรง
                                    </h3>
                                    <p className="mb-2 ml-2">
                                        {
                                            data.patient_report
                                                .frequency_and_severity
                                        }
                                    </p>
                                    <h3 className="text-[#179B97] mb-2">
                                        สิ่งกระตุ้น
                                    </h3>
                                    <p className="mb-2 ml-2">
                                        {data.patient_report.trigger_note}
                                    </p>
                                    <h3 className="text-[#179B97] mb-2">
                                        พฤติกรรมกระตุ้น หรือลดไมเกรน
                                    </h3>
                                    <p className="mb-2 ml-2">
                                        {
                                            data.patient_report
                                                .behaviors_trigger_reduce_migraines
                                        }
                                    </p>
                                    <h3 className="text-[#179B97] mb-2">
                                        ยาแก้ปวด
                                    </h3>
                                    <p className="mb-2 ml-2">
                                        {data.patient_report.acute}
                                    </p>
                                    <h3 className="text-[#179B97] mb-2">
                                        ยาป้องกัน
                                    </h3>
                                    <p className="mb-2 ml-2">
                                        {data.patient_report.prevention}
                                    </p>
                                    <h3 className="text-[#179B97] mb-2">
                                        โรคร่วม
                                    </h3>
                                    <p className="mb-2 ml-2">
                                        {data.patient_report.comorbidity}
                                    </p>
                                    <h3 className="text-[#179B97] mb-2">
                                        บันทึก อื่นๆ
                                    </h3>
                                    <p className="mb-2 ml-2">
                                        {data.patient_report.note}
                                    </p>
                                </div>
                                <div className="p-4 text-[14px] flex-1 relative">
                                    <h2 className="font-noto-bold text-[14px] mb-2">
                                        คำสั่งรักษา
                                    </h2>
                                    <button
                                        onClick={() => {
                                            resendAppointment(
                                                data.header_report
                                                    .appointment_date,
                                                data.header_report
                                                    .appointment_time
                                            );
                                        }}
                                        className="absolute right-2 top-2 bg-[#EFFAF5] text-i-green rounded-[8px] px-4 py-2"
                                    >
                                        ส่งสรุปการรักษา
                                    </button>
                                    <h3 className="text-[#179B97] mb-2">
                                        วินิจฉัย
                                    </h3>
                                    <p className="mb-2 ml-2">
                                        {data.patient_report.diagnose}
                                    </p>
                                    <h3 className="text-[#179B97] mb-2">
                                        คำแนะนำ
                                    </h3>
                                    <p className="mb-2 ml-2">
                                        {data.patient_report.advice}
                                    </p>
                                    <h2 className="font-noto-bold text-[14px] mb-2">
                                        รายการยา
                                    </h2>
                                    <ol start={0}>
                                        {data.patient_order.map(
                                            (e: any, index: number) => {
                                                return (
                                                    <li
                                                        className="mb-2"
                                                        key={index}
                                                    >
                                                        {e.common_name}{' '}
                                                        {e.amount} {e.unit}{' '}
                                                        {e.indications}
                                                    </li>
                                                );
                                            }
                                        )}
                                    </ol>
                                    <h2 className="font-noto-bold text-[14px] mb-2">
                                        นัดตรวจครั้งต่อไป
                                    </h2>
                                    <p>
                                        {
                                            data.next_doctor_appointment
                                                .next_appointment_date
                                        }{' '}
                                        {
                                            data.next_doctor_appointment
                                                .next_appointment_time
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}
