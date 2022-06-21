import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {
    CallAdapter,
    CallComposite,
    CallAdapterState,
    createAzureCommunicationCallAdapter
} from '@azure/communication-react'
import { createAutoRefreshingCredential } from '../../utils/creadential'
import { Spinner } from '@fluentui/react';

const currentTheme = {
    callingPalette: {
        callRed: '#a42e43',
        callRedDark: '#8b2c3d',
        callRedDarker: '#772a38',
        iconWhite: '#ffffff'
    },
    palette: {
        black: '#000000',
        neutralDark: '#201f1e',
        neutralLight: '#edebe9',
        neutralLighter: '#f3f2f1',
        neutralLighterAlt: '#faf9f8',
        neutralPrimary: '#323130',
        neutralPrimaryAlt: '#3b3a39',
        neutralQuaternary: '#d0d0d0',
        neutralQuaternaryAlt: '#e1dfdd',
        neutralSecondary: '#605e5c',
        neutralTertiary: '#a19f9d',
        neutralTertiaryAlt: '#c8c6c4',
        themeDark: '#59b0f7',
        themeDarkAlt: '#106ebe',
        themeDarker: '#004578',
        themeLight: '#c7e0f4',
        themeLighter: '#deecf9',
        themeLighterAlt: '#eff6fc',
        themePrimary: '#0078d4',
        themeSecondary: '#2b88d8',
        themeTertiary: '#71afe5',
        white: '#ffffff'
    }
}

export default function VideoCard() {
    const [adapter, setAdapter] = useState<CallAdapter>();
    const [token, setToken] = useState('')
    const [user, setUser] = useState({
        communicationUserId: ''
    })
    const callIdRef = useRef<string>();
    const adapterRef = useRef<CallAdapter>();

    useEffect(() => {
        if (!callIdRef.current) {
            return;
        }
        console.log(`Call Id: ${callIdRef.current}`);
    }, [callIdRef.current]);

    useEffect(async () => {
        await getToken()
        const displayName = 'fight'
        const callLocator = {
            groupId: 'b49ffd20-ee24-11ec-9615-d1e1c325a8f4'
        }
        const adapter = await createAzureCommunicationCallAdapter({
            userId: user,
            displayName,
            credential: createAutoRefreshingCredential(user.communicationUserId, token),
            locator: callLocator
        })
        console.log('a', adapter)
        adapter.on('callEnded', () => {
            // onCallEnded();
            console.log('call end')
        });
        adapter.on('error', (e) => {
            // Error is already acted upon by the Call composite, but the surrounding application could
            // add top-level error handling logic here (e.g. reporting telemetry).
            console.log('Adapter error event:', e);
        });
        adapter.onStateChange((state: CallAdapterState) => {
            document.title = `webAppTitle`;
            callIdRef.current = state?.call?.id;
        });
        setAdapter(adapter)
        adapterRef.current = adapter;
        return () => {
            adapterRef?.current?.dispose();
        };
    }, [])

    async function getToken() {
        const res = await axios({
            method: 'get',
            url: 'http://localhost:8080/token'
        })
        setToken(res.data.token)
        setUser(res.data.user)
        console.log('get token', res.data)
    }

    if (!adapter) {
        return <Spinner label={'Creating adapter'} ariaLive="assertive" labelPosition="top" />;
    }

    return (
        <div>
            <h1>Video Card</h1>
            <CallComposite
                adapter={adapter}
                callInvitationUrl="http://localhost:3001/?groupId=0691c4a0-ee30-11ec-9e02-f74b242d4e84"
                formFactor="desktop"
                rtl={false}
                fluentTheme={currentTheme}
            />
        </div>
    )
}
