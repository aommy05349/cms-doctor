import React, { ReactElement, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import MainLayout from '../../components/layouts/Main';
import TopNav from '../../components/appointment/TopNav';
import { useRouter } from 'next/router';
import { patientApi, specialistApi } from '../../services';
import PatientCard from '../../components/appointment/PatientCard';
import ReportHistory from '../../components/appointment/ReportHistory';
import { Patient } from '../../types';
import NewReport from '../../components/appointment/NewReport';

const VideoCard = dynamic(
    () => import('../../components/appointment/VideoCard'),
    {
        ssr: false,
    }
);

function Appointment() {
    const [loading, setLoading] = useState(true);
    const [groupId, setGroupId] = useState('');
    const [memberId, setMemberId] = useState<string | undefined>('');
    const [patient, setPatient] = useState<Patient>();
    const [specialistId, setSpecialistId] = useState('');
    const [appointmentId, setAppointmentId] = useState<any>();

    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            (async () => {
                const appointmentId = router.query.id?.toString();
                await getAppointment(appointmentId);
            })();
        }
    }, [router]);

    async function getPatient(memberId: number) {
        const res = await patientApi.getPatient(memberId);
        setPatient(res);
    }

    async function getAppointment(appointmentId: any) {
        const res = await specialistApi.getAppointmentId(appointmentId);
        if (res.data) {
            setMemberId(res.data.member_id);
            setSpecialistId(res.data.specialists_id);
            setAppointmentId(appointmentId);
            await getPatient(res.data.member_id);
            await getGroupId(res.data.member_id);
        }
    }

    async function getGroupId(memberId: number) {
        const res = await patientApi.getListenning(memberId);
        console.log('getGroupId', res);
        if (res.data) {
            setGroupId(res.data.group_id);
            setLoading(false);
        } else {
            console.error('not data listening');
        }
    }

    return (
        <div className="h-full flex flex-col bg-[#CBD5DD]">
            <TopNav />
            {!loading && (
                <section className="flex flex-row flex-grow animate-[fadeIn_.5s_ease-in] h-[90vh]">
                    <div className="flex flex-col flex-grow">
                        <div className="border-r-[1px] border-gray-100">
                            {patient && <PatientCard data={patient} />}
                        </div>
                        <div className="flex-grow bg-[#CBD5DD] p-5 overflow-auto">
                            {patient && (
                                <NewReport
                                    patient={patient}
                                    specialistId={specialistId}
                                    appointmentId={appointmentId}
                                />
                            )}

                            <ReportHistory
                                memberId={memberId ? memberId : ''}
                            />
                        </div>
                    </div>
                    <div className="w-[400px] bg-white">
                        <div className="w-[400px]">
                            <VideoCard
                                groupId={groupId}
                                memberId={memberId ? memberId : ''}
                                appointmentId={appointmentId}
                            />
                        </div>
                        <div className=""></div>
                    </div>
                </section>
            )}
        </div>
    );
}

Appointment.getLayout = function getLayout(page: ReactElement) {
    return <MainLayout>{page}</MainLayout>;
};

export default Appointment;
