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
        if (res.data) {
            setReports(res.data);
        }
    }
    useEffect(() => {
        console.log('memberId', memberId);
        getHistoryReports();
    }, [router]);

    return (
        <div>
            {reports.map((data: any) => {
                <div className="flex flex-col">
                    <div className="p-2 flex flex-row">
                        <div className="">
                            {data.appointment_date} {data.appointment_time}
                        </div>
                        <div className=""></div>
                    </div>
                    <div className="p-2 flex flex-row">
                        <div className=""></div>
                        <div className=""></div>
                    </div>
                </div>;
            })}
        </div>
    );
}
