import { EditFilled } from '@fluentui/react-icons';
import React, { useState } from 'react';

type FieldEditorProps = {
    title: string;
    value: string;
    setValue: (text: string) => void;
};
export default function FieldEditor({
    title,
    value,
    setValue,
}: FieldEditorProps) {
    const [isShow, setIsShow] = useState(false);

    function editField() {
        setIsShow(true);
        setTimeout(() => {
            document.getElementById('fieldEditor')?.focus();
        }, 10);
    }

    return (
        <div>
            <h3 className="text-[#179B97]">{title}</h3>
            <div
                className="min-h-[50px] duration-300 ease-in"
                onClick={() => {
                    editField();
                }}
            >
                {isShow ? (
                    <textarea
                        className="w-full p-2 active:border-none h-[40px] mt-1"
                        value={value}
                        onBlur={() => {
                            setIsShow(false);
                        }}
                        id="fieldEditor"
                        onChange={(event) => {
                            setValue(event.target.value);
                        }}
                    />
                ) : value == '' ? (
                    <p className="py-1 px-2 hover:bg-gray-100 cursor-pointer duration-150 ease-in text-[#6C6C6C]">
                        เพิ่มข้อมูล
                    </p>
                ) : (
                    <p className="py-1 px-2 hover:bg-gray-100 cursor-pointer duration-150 ease-in text-[#000] whitespace-pre-line">
                        {value == '' ? 'เพิ่มข้อมูล' : value}
                    </p>
                )}
            </div>
        </div>
    );
}
