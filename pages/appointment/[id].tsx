import React, { ReactElement, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

import MainLayout from '../../components/layouts/Main';
import TopNav from '../../components/appointment/TopNav';
import { patientApi, specialistApi } from '../../services';
import PatientCard from '../../components/appointment/PatientCard';
import ReportHistory from '../../components/appointment/ReportHistory';
import NewReport from '../../components/appointment/NewReport';
import PatientHistories from '../../components/appointment/PatientHistories';
import Dashboard from '../../components/appointment/Dashboard/Index';
import { Patient } from '../../types';

const VideoCard = dynamic(
    () => import('../../components/appointment/VideoCard'),
    {
        ssr: false,
    }
);

function Appointment() {
    const [groupId, setGroupId] = useState('');
    const [patient, setPatient] = useState<Patient>();
    const [specialistId, setSpecialistId] = useState('');
    const [appointmentId, setAppointmentId] = useState<any>();

    const [isShowHistories, setShowHistories] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            (async () => {
                const appointmentId = router.query.id?.toString();
                await getAppointment(appointmentId);
            })();
        }
        // eslint-disable-next-line
    }, [router]);

    async function getPatient(memberId: number) {
        const res = await patientApi.getPatient(memberId);
        setPatient(res);
    }

    async function getAppointment(appointmentId: any) {
        const res = await specialistApi.getAppointmentId(appointmentId);
        if (res.data) {
            setSpecialistId(res.data.specialists_id);
            setAppointmentId(appointmentId);
            await getPatient(res.data.member_id);
            await getGroupId(res.data.member_id);
        }
    }

    async function getGroupId(memberId: number) {
        const res = await patientApi.getListenning(memberId);
        if (res.data) {
            setGroupId(res.data.group_id);
        }
    }

    function handleToggleHistories() {
        setShowHistories((prev) => !prev);
    }

    async function checkSavedReport(appointmentId: string) {
        const { data } = await specialistApi.getNewCardByAppointmentId(
            appointmentId
        );
        return !!data && !!data.patient_report;
    }

    async function handleBack() {
        const isSaved = await checkSavedReport(appointmentId);

        if (isSaved) {
            Swal.fire({
                title: 'ยืนยันการออก ?',
                text: 'ต้องการออกจากห้องตรวจหรือไม่',
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: 'ยกเลิก',
                confirmButtonText: 'ตกลง',
                cancelButtonColor: '#ccc',
                confirmButtonColor: '#25AC67',
            }).then(async (confirm: any) => {
                if (confirm.isConfirmed) {
                    location.href = '/';
                }
            });
        } else {
            Swal.fire({
                title: 'คุณยังไม่ได้ส่งสรุปการรักษา',
                text: 'กรุณาส่งสรุปการรักษา ก่อนออกจากห้องตรวจ',
                icon: 'error',
                confirmButtonText: 'ฉันเข้าใจ',
            });
        }
    }

    return (
        <div className="h-full flex flex-col bg-[#CBD5DD]">
            <TopNav onBack={handleBack} />
            {patient && groupId != '' && (
                <section className="flex flex-row flex-grow animate-[fadeIn_.5s_ease-in] h-[90vh]">
                    <div className="flex flex-col flex-grow bg-[#CBD5DD]">
                        <div className="border-r-[1px] border-gray-100">
                            <PatientCard
                                data={patient}
                                isShowHistories={isShowHistories}
                                onToggleHistories={handleToggleHistories}
                            />
                        </div>
                        <AnimatePresence exitBeforeEnter>
                            <motion.div
                                key={
                                    isShowHistories
                                        ? 'showHistories'
                                        : 'hideHistories'
                                }
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex-grow  p-5 overflow-auto"
                            >
                                {isShowHistories ? (
                                    <PatientHistories
                                        patientId={patient.member_id}
                                        onClose={() => setShowHistories(false)}
                                    />
                                ) : (
                                    <>
                                        <NewReport
                                            patient={patient}
                                            specialistId={specialistId}
                                            appointmentId={appointmentId}
                                        />

                                        <ReportHistory
                                            memberId={patient.member_id}
                                        />
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <div className="w-[400px] bg-white">
                        <div className="w-[400px]">
                            <VideoCard
                                groupId={groupId}
                                memberId={patient.member_id}
                                appointmentId={appointmentId}
                            />
                        </div>
                        {patient && <Dashboard patientId={patient.member_id} />}
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
