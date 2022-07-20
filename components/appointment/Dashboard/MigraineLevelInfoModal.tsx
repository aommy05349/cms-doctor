import { FC } from 'react';
import Image from 'next/image';

import Modal from '../../Modal';

interface MigraineLevel {
    title: string;
    desc: string;
    image: string;
}

const MigraineLevelItem: FC<{ data: MigraineLevel }> = ({ data }) => {
    const textColor = {
        ปวดมาก: 'text-[#862C00]',
        ปวดปานกลาง: 'text-[#A8841C]',
        ปวดน้อย: 'text-[#004C92]',
        ไม่ปวด: 'text-[#25AC67]',
    }[data.title];

    return (
        <li className="flex space-x-5 ">
            <div className="w-[55px] h-[55px] relative shrink-0">
                <Image
                    src={data.image}
                    alt={data.title}
                    layout="fill"
                    objectFit="contain"
                />
            </div>
            <div className="flex flex-col space-y-1">
                <p className={`text-[15px] ${textColor} font-bold `}>
                    {data.title}
                </p>
                <p className="text-sm">{data.desc}</p>
            </div>
        </li>
    );
};

interface Props {
    show: boolean;
    onClose: () => void;
}

const MigraineLevelInfoModal: FC<Props> = ({ show, onClose }) => {
    const MIGRAINE_LEVEL_LIST: Array<MigraineLevel> = [
        {
            title: 'ปวดมาก',
            desc: 'มีผลให้ต้องพัก ไม่สามารถทำกิจกรรมได้',
            image: '/images/migraine-level-face/pain-hard.svg',
        },
        {
            title: 'ปวดปานกลาง',
            desc: 'มีผลกระทบต่อการใช้ชีวิต หรือทำกิจกรรมแต่ยังไม่มาก จนต้องหยุดพัก',
            image: '/images/migraine-level-face/pain-middle.svg',
        },
        {
            title: 'ปวดน้อย',
            desc: 'ไม่มีผลกระทบต่อการใช้ชีวิต หรือกิจกรรมประจำวัน',
            image: '/images/migraine-level-face/pain-soft.svg',
        },
        {
            title: 'ไม่ปวด',
            desc: 'ไม่มีอาการข้างเคียง และไม่มีอาการปวดหัวใดๆ',
            image: '/images/migraine-level-face/no-pain.svg',
        },
    ];

    return (
        <Modal isShow={show} width="325px" onClose={onClose}>
            <div className="px-5 pb-12">
                <h3 className="text-lg font-bold text-center mb-8">
                    ระดับการปวด
                </h3>
                <div className="flex space-x-4 items-stretch">
                    <div className="w-8 shrink-0 relative">
                        <Image
                            src="/images/migraine-level-face/pain-bar.svg"
                            alt="pain bar"
                            layout="fill"
                            objectFit="contain"
                        />
                    </div>
                    <ul className="grow flex flex-col space-y-10">
                        {MIGRAINE_LEVEL_LIST.map((migraineLevel) => (
                            <MigraineLevelItem
                                key={migraineLevel.title}
                                data={migraineLevel}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </Modal>
    );
};

export default MigraineLevelInfoModal;
