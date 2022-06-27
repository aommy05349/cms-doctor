import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { patientApi } from '../../services';

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
    }, [router]);

    return (
        <div>
            {reports &&
                reports.map((data: any, index: number) => {
                    return (
<<<<<<< Updated upstream
                        <div className="flex flex-col bg-white" key={index}>
=======
                        <div
                            className="flex flex-col bg-white"
                            key={data.patient_report.id}
                        >
>>>>>>> Stashed changes
                            <div className="p-2 flex flex-row">
                                <div className="flex-1">
                                    {data.header_report.appointment_date}{' '}
                                    {data.header_report.appointment_time}
                                </div>
                                <div className="flex-1 text-[14px]">
                                    {
                                        data.header_report
                                            .appointment_specialist_name
                                    }{' '}
                                    {data.header_report.patient_name}
                                </div>
                            </div>
                            <div className="p-2 flex flex-row">
                                <div className=""></div>
                                <div className=""></div>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}
