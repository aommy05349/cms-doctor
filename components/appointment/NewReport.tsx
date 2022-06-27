import React, { useState } from 'react';
import FieldEditor from './FieldEditor';

const defaultForm = {
    doctor_appointment_id: 93,
    specialists_id: 1,
    member_id: 6204,
    frequency_and_severity: '',
    trigger_note: '',
    behaviors_trigger_reduce_migraines: '',
    acute: '',
    prevention: '',
    comorbidity: '',
    note: '',
    diagnose: '',
    advice: '',
    patient_order: [
        {
            common_name: 'Migraine Care Program',
            trade_name: 'Premium User',
            quantity: '1 Month',
            note: 'บันทึกอาการ ช่วยรักษา',
            side_effect: '',
            isDefault: true,
        },
    ],
    next_appointment_date: null,
};

interface PatientData {
    fname: string;
    lname: string;
}

type NewReportProps = {
    patient: PatientData;
};

export default function NewReport({ patient }: NewReportProps) {
    const [formData, setFormData] = useState(defaultForm);
    return (
        <>
            <div className="flex flex-col bg-white rounded-[6px] mb-[20px]">
                <div className="p-4 flex flex-row text-[14px] border-b-2">
                    <div>วันที่03/08/2565 เวลา 16:40-16:55</div>
                    <div className="flex-1 text-right">
                        แพทย์ ผศ.นพ. สุรัตน์ ตันประเวช ผู้รับคำปรึกษา{' '}
                        {patient.fname} {patient.lname}
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
                            value={formData.behaviors_trigger_reduce_migraines}
                            setValue={(text) =>
                                setFormData({
                                    ...formData,
                                    behaviors_trigger_reduce_migraines: text,
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
                    <div className="p-4 text-[14px] flex-1 relative">
                        <h2 className="font-noto-bold text-[14px] mb-2">
                            คำสั่งรักษา
                        </h2>
                        <button className="absolute right-2 top-2 bg-[#EFFAF5] text-i-green rounded-[8px] px-4 py-2">
                            ส่งสรุปการรักษา
                        </button>
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
                        <div>
                            <div>
                                <h2>รายการยา</h2>
                                <button>เพิ่มรายการยา</button>
                            </div>
                            <ol start={0}>
                                {formData.patient_order.map(
                                    (e: any, index: number) => {
                                        return (
                                            <li className="mb-2" key={index}>
                                                {e.common_name} {e.amount}{' '}
                                                {e.unit} {e.indications}
                                            </li>
                                        );
                                    }
                                )}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
