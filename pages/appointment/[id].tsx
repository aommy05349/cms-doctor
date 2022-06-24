import React, { ReactElement, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import MainLayout from '../../components/layouts/Main';
import TopNav from '../../components/appointment/TopNav';
import { useRouter } from 'next/router';
import { patientApi } from '../../services';

const VideoCard = dynamic(
    () => import('../../components/appointment/VideoCard'),
    {
        ssr: false,
    }
);

async function getPatient(memberId: string) {
    console.log('memberId', memberId);
    const res = await patientApi.getPatient(memberId);
    console.log('getPatient', res);
}

function Appointment() {
    const [groupId, setGroupId] = useState(
        'b49ffd20-ee24-11ec-9615-d1e1c325a8f4'
    );
    const [patient, setPatient] = useState(null);

    const router = useRouter();

    useEffect(() => {
        getPatient(router.query.id);
    }, []);

    return (
        <div>
            <TopNav />
            <section className="flex flex-row">
                <div className="flex flex-col">
                    <div className="">
                        <div className=""></div>
                        <div className=""></div>
                    </div>
                    <div className="">
                        {/* <VideoCard groupId={groupId} displayName="คุณหมอ" /> */}
                    </div>
                </div>
                <div className="">
                    <div className=""></div>
                    <div className=""></div>
                </div>
            </section>
        </div>
    );
}

Appointment.getLayout = function getLayout(page: ReactElement) {
    return <MainLayout>{page}</MainLayout>;
};

export default Appointment;
