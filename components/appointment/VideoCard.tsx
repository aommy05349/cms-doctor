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
import {currentTheme} from '../../utils/videoCardTheme'

type VideoCardProp = {
    groupId: string;
    displayName: string;
    memberId: string;
    specialistId: string;
};

export default function VideoCard({ groupId, displayName, memberId, specialistId }: VideoCardProp) {
    const [adapter, setAdapter] = useState<CallAdapter>();
    const callIdRef = useRef<string>();
    const adapterRef = useRef<CallAdapter>();
    const [statusState, setStatusState] = useState<any>('') 

    useEffect(() => {
        if (!callIdRef.current) {
            return;
        }
    }, [callIdRef.current]);

    useEffect(() => {
        console.log('groupId', groupId);
        getToken();
    }, []);

    useEffect(() => {
        console.log('statusState', statusState)
    }, [statusState])

    async function getToken() {
        // const url = `${process.env.NEXT_PUBLIC_TELE_API}/token`;
        // const res = await teleApiApp.get(url);
        // console.log('get token', res);
        // getAdaptor(res.data.user, res.data.token);
        console.log('specialistId', specialistId)
        const res = await specialistApi.getSpecialistToken(specialistId);
        if (res.data) {
            console.log('res', res.data.room_patient_user_access_token);
            getAdaptor(
                {
                    communicationUserId: res.data.room_doctor_identify_token,
                },
                res.data.room_patient_user_access_token
            );
        } else {
            console.log(res)
        }
    }

    async function startCall() {
        const data = {
            member_id: memberId,
            doctor_in_room: true,
            successful_doctor_consultation: false
        }
        const res = await specialistApi.endCall(data)
        console.log('end call', res);
    }

    async function endCall() {
        const data = {
            member_id: memberId,
            doctor_in_room: true,
            successful_doctor_consultation: false
        }
        const res = await specialistApi.endCall(data)
        console.log('end call', res);
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
            endCall()
        });
        adapter.on('error', (e) => {
            console.log('Adapter error event:', e);
        });
        adapter.onStateChange((state: CallAdapterState) => {
            // document.title = `webAppTitle`;
            callIdRef.current = state?.call?.id;
            console.log('state', state && state.call)
            setStatusState(state.call)
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
