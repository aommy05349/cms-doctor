import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { authApi } from '../services';
import { apiApp } from '../services/config';

const inputStyle =
    'bg-[#F4F5F4] h-[40px] w-full rounded-[4px] pl-2  pt-4 text-[14px] border-b-[2px] font-noto-medium';

export default function LoginPage() {
    const [email, setEmail] = useState('surat.md@gmail.com');
    const [password, setPassword] = useState('qwerty');
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter();

    async function login() {
        setLoading(true)
        const res = await authApi.login({
            usrnm: email,
            psw: password,
        });
        if (res.data) {
            apiApp.defaults.headers.common['Authorization'] =
                'Bearer ' + res.data.token;
            const resSetCookie = await authApi.createSession(res.data.token);
            console.log('resSetCookie', resSetCookie);
            if (resSetCookie.status == 'success') {
                setLoading(false)
                router.push('/');
            } else {
                setLoading(false)
                console.log(resSetCookie)
            }
        }
    }

    return (
        <div className="flex flex-col justify-center items-center h-[100vh] animate-[fadeIn_.5s_ease-in]">
            <div className="flex flex-col items-center w-[350px]">
                <div className="relative w-[49px] h-[51px]">
                    <Image
                        src="/images/logo.png"
                        className="w-full h-full"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <h1 className="font-noto-bold text-[36px] mt-5 mb-5">
                    Tele Migraine
                </h1>
                <div className="mb-3 relative w-full">
                    <span className="absolute left-2 top-0 z-30 text-gray-600 text-[12px]">
                        Email
                    </span>
                    <input
                        type="text"
                        className={inputStyle}
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                    />
                </div>
                <div className="mb-3 relative w-full">
                    <span className="absolute left-2 top-0 z-30 text-gray-600 text-[12px]">
                        Password
                    </span>
                    <input
                        type="password"
                        className={inputStyle}
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                    />
                </div>
                <div className="flex flex-row items-center w-full">
                    <Link href="/">
                        <a className="flex-grow decoration-gray-400 underline text-[#6C6C6C] text-noto-bold hover:text-i-green ease-in duration-300">
                            ติดต่อเจ้าหน้าที่
                        </a>
                    </Link>
                    <button
                        onClick={login}
                        className="bg-i-green text-white w-[150px] text-center h-[44px] rounded-[8px] hover:bg-[#35be78] ease-in duration-300"
                    >
                        {loading ? <FontAwesomeIcon icon={faSpinner} spin /> :
                        <span>เข้าสู่ระบบ</span>}
                    </button>
                </div>
            </div>
        </div>
    );
}
