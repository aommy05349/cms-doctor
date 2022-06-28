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
    const [groupId, setGroupId] = useState('');
    const [memberId, setMemberId] = useState<string | undefined>('');
    const [patient, setPatient] = useState(null);

    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            getPatient();
            getGroupId(); // get groupId for video call
        }
    }, [router]);

    async function getPatient() {
        const memberIdStr = router.query.id?.toString();
        setMemberId(memberIdStr);
        const res = await patientApi.getPatient(memberIdStr);
        setPatient(res);
    }

    async function getGroupId() {
        const res = await patientApi.getListenning(router.query.id?.toString());
        if (res.data) {
            setGroupId(res.data.group_id);
        } else {
            console.error('not data listening');
        }
    }

    return (
        <div className="h-full flex flex-col bg-[#CBD5DD]">
            <TopNav />
            {patient && (
                <section className="flex flex-row flex-grow animate-[fadeIn_.5s_ease-in] h-[90vh]">
                    <div className="flex flex-col flex-grow">
                        <div className="">
                            <PatientCard data={patient} />
                        </div>
                        <div className="flex-grow bg-[#CBD5DD] p-5 overflow-auto">
                            <NewReport patient={patient} />
                            <ReportHistory
                                memberId={memberId ? memberId : ''}
                            />
                        </div>
                    </div>
                    <div className="w-[400px] bg-white">
                        <div className="">
                            <VideoCard groupId={groupId} displayName="คุณหมอ" />
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
