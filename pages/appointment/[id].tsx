import React, { ReactElement, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import MainLayout from '../../components/layouts/Main';
import TopNav from '../../components/appointment/TopNav';
import { useRouter } from 'next/router';
import { patientApi } from '../../services';
import PatientCard from '../../components/appointment/PatientCard';
import ReportHistory from '../../components/appointment/ReportHistory';
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
    const [patient, setPatient] = useState<any>();
    const [specialistId, setSpecialistId] = useState('');
    const [appointmentId, setAppointmentId] = useState('');
    const [listeningAppointmentId, setListeningAppointmentId] = useState();

    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            (async () => {
                await getPatient();
                await getAppointment();
                await getGroupId(); // get groupId for video call
                setLoading(false);
            })();
        }
    }, [router]);

    async function getPatient() {
        const memberIdStr = router.query.id?.toString();
        setMemberId(memberIdStr);
        const res = await patientApi.getPatient(memberIdStr);
        setPatient(res);
    }

    async function getAppointment() {
        const res = await patientApi.getAppointmentByMemberId(
            router.query.id?.toString()
        );
        console.log('app', res);
        if (res.data) {
            setSpecialistId(res.data.appointment_specialist_id);
            setAppointmentId(res.data.apppointment_id);
        }
    }

    async function getGroupId() {
        const res = await patientApi.getListenning(router.query.id?.toString());
        console.log('getGroupId', res);
        if (res.data) {
            setListeningAppointmentId(res.data.id);
            setGroupId(res.data.group_id);
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
                            <PatientCard data={patient} />
                        </div>
                        <div className="flex-grow bg-[#CBD5DD] p-5 overflow-auto">
                            <NewReport
                                patient={patient}
                                specialistId={specialistId}
                                appointmentId={appointmentId}
                            />
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
