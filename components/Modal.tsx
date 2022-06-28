import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Children } from 'react';

type ModalProps = {
    title: string;
    isShow: boolean;
    width: string;
    children?: React.ReactNode;
    onClose: () => void;
};

export default function Modal({
    title,
    isShow,
    children,
    width,
    onClose,
}: ModalProps) {
    return (
        <>
            {isShow && (
                <div className="z-10 modal fixed w-full h-full top-0 left-0 flex justify-center items-center animate-[fadeIn_.3s_ease-in-out]">
                    <div
                        className="fixed left-0 top-0 wrapper w-full h-full bg-black bg-opacity-40 z-11"
                        onClick={() => {
                            onClose();
                        }}
                    ></div>
                    <div
                        className={`modal-container bg-white max-w-full min-h-[300px] rounded-[8px] overflow-hidden z-20`}
                        style={{ width: `${width}` }}
                    >
                        <div className="border-m-2 bg-[#F2F2F2] p-4 py-2 flex flex-row">
                            <h1 className="font-noto-bold flex-1">{title}</h1>
                            <button
                                onClick={() => {
                                    onClose();
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faClose}
                                    className="text-xl text-[#333]"
                                />
                            </button>
                        </div>
                        <div>{children}</div>
                    </div>
                </div>
            )}
        </>
    );
}
