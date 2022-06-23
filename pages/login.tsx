import Router, { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { authApi } from '../services';

export default function login() {
    const [email, setEmail] = useState('surat.md@gmail.com');
    const [password, setPassword] = useState('qwerty');
    const router = useRouter();

    async function login() {
        const res = await authApi.login({
            usrnm: email,
            psw: password,
        });
        console.log('login', res);
    }

    return (
        <div>
            <div className="">
                <input
                    type="text"
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                    }}
                />
            </div>
            <div className="">
                <input
                    type="password"
                    value={password}
                    onChange={(event) => {
                        setPassword(event.target.value);
                    }}
                />
            </div>
            <div className="">
                <button onClick={login}>Login</button>
            </div>
        </div>
    );
}
