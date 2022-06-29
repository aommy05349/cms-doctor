import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
    CallAdapter,
    CallComposite,
    CallAdapterState,
    createAzureCommunicationCallAdapter,
} from '@azure/communication-react';
import { createAutoRefreshingCredential } from '../../utils/creadential';
import { Spinner } from '@fluentui/react';
import { teleApiApp } from '../../services/config';
import { specialistApi } from '../../services';

const currentTheme = {
    callingPalette: {
        callRed: '#a42e43',
        callRedDark: '#8b2c3d',
        callRedDarker: '#772a38',
        iconWhite: '#ffffff',
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
        white: '#ffffff',
    },
};

type VideoCardProp = {
    groupId: string;
    displayName: string;
};

export default function VideoCard({ groupId, displayName }: VideoCardProp) {
    const [adapter, setAdapter] = useState<CallAdapter>();
    const callIdRef = useRef<string>();
    const adapterRef = useRef<CallAdapter>();

    useEffect(() => {
        if (!callIdRef.current) {
            return;
        }
    }, [callIdRef.current]);

    useEffect(() => {
        console.log('groupId', groupId);
        getToken();
    }, []);

    async function getToken() {
        // const url = `${process.env.NEXT_PUBLIC_TELE_API}/token`;
        // const res = await teleApiApp.get(url);
        // console.log('get token', res);
        // getAdaptor(res.data.user, res.data.token);

        const mockId = 292;
        const res = await specialistApi.getSpecialistToken(mockId);
        console.log('res', res.data.room_doctor_user_access_token);
        getAdaptor(
            {
                communicationUserId: res.data.room_doctor_identify_token,
            },
            res.data.room_patient_user_access_token
        );
    }

    async function getAdaptor(user: any, token: string) {
        const callLocator = {
            groupId,
        };
        const adapter = await createAzureCommunicationCallAdapter({
            userId: user,
            displayName,
            credential: createAutoRefreshingCredential(
                user.communicationUserId,
                token
            ),
            locator: callLocator,
        });
        adapter.on('callEnded', () => {
            console.log('call end');
        });
        adapter.on('callIdChanged', () => {
            console.log('callIdChanged');
        });
        adapter.on('error', (e) => {
            console.log('Adapter error event:', e);
        });
        adapter.onStateChange((state: CallAdapterState) => {
            document.title = `webAppTitle`;
            callIdRef.current = state?.call?.id;
        });
        setAdapter(adapter);
        adapterRef.current = adapter;
        return () => {
            adapterRef?.current?.dispose();
        };
    }

    if (!adapter) {
        return (
            <Spinner
                label={'Video Call Loading'}
                ariaLive="assertive"
                labelPosition="top"
            />
        );
    }

    return (
        <div>
            <div className="video-frame h-[500px] w-full">
                <CallComposite
                    adapter={adapter}
                    callInvitationUrl={`http://localhost:3000/?groupId=${groupId}`}
                    formFactor="mobile"
                    rtl={false}
                    fluentTheme={currentTheme}
                />
            </div>
        </div>
    );
}
