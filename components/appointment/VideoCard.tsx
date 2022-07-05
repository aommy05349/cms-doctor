import React, { useEffect, useRef, useState } from 'react';
import {
    CallAdapter,
    CallComposite,
    CallAdapterState,
    createAzureCommunicationCallAdapter,
} from '@azure/communication-react';
import { createAutoRefreshingCredential } from '../../utils/creadential';
import { specialistApi } from '../../services';
import { currentTheme } from '../../utils/videoCardTheme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAppContext } from '../../contexts/state';

type VideoCardProp = {
    groupId: string;
    displayName: string;
    memberId: string;
    appointmentId: string;
};

export default function VideoCard({
    groupId,
    displayName,
    memberId,
    appointmentId,
}: VideoCardProp) {
    const [adapter, setAdapter] = useState<CallAdapter>();
    const callIdRef = useRef<string>();
    const adapterRef = useRef<CallAdapter>();
    const [statusState, setStatusState] = useState<any>('');
    const { callCountdownText, startCountdown, clearCountdown } =
        useAppContext();

    useEffect(() => {
        if (!callIdRef.current) {
            return;
        }
    }, [callIdRef.current]);

    useEffect(() => {
        console.log('groupId', groupId);
        console.log(
            'room url',
            `${window.location.href}?room=${appointmentId}`
        );
        getToken();
    }, []);

    useEffect(() => {
        if (statusState == 'Connected') {
            startCountdown();
            startCall();
        }
    }, [statusState]);

    async function getToken() {
        console.log('appointmentId : ', appointmentId);
        const res = await specialistApi.getSpecialistToken(appointmentId);
        if (res.data) {
            console.log('res', res.data);
            getAdaptor(
                {
                    communicationUserId: res.data.room_doctor_identify_token,
                },
                res.data.room_patient_user_access_token
            );
        } else {
            console.log(res);
        }
    }

    async function startCall() {
        const data = {
            member_id: memberId,
            doctor_in_room: true,
            successful_doctor_consultation: false,
        };
        const res = await specialistApi.endCall(data);
        console.log('start call', res.data);
    }

    async function endCall() {
        clearCountdown();
        const data = {
            member_id: memberId,
            doctor_in_room: false,
            successful_doctor_consultation: true,
        };
        const res = await specialistApi.endCall(data);
        console.log('end call', res.data);
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
            endCall();
        });
        adapter.on('error', (e) => {
            console.log('Adapter error event:', e);
        });
        adapter.onStateChange((state: CallAdapterState) => {
            callIdRef.current = state?.call?.id;
            const newState = state.call ? state.call.state : '';
            if (newState != statusState) setStatusState(newState);
        });
        setAdapter(adapter);
        adapterRef.current = adapter;
        return () => {
            adapterRef?.current?.dispose();
        };
    }

    if (!adapter) {
        return (
            <div className="flex flex-col justify-center items-center h-[400px] w-full">
                <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    className="text-[30px] text-gray-300"
                />
                <h2 className="mt-2 text-gray-300">กำลังโหลดวิดีโอ</h2>
            </div>
        );
    }

    return (
        <div className="relative">
            {callCountdownText.minuteText != '' && (
                <div className="right-4 top-4 z-[20] text-right font-noto-medium text-[14px] absolute animate-[fadeIn_.5s_ease-in]">
                    <p className="flex justify-end items-center">
                        เหลือเวลาอีก {' : '}
                        <span
                            onClick={() => {
                                startCountdown();
                            }}
                            className={`font-noto-bold text-[20px] font-bold ${
                                callCountdownText.minuteText < 5 && 'text-i-red'
                            }`}
                        >
                            {callCountdownText.minuteText}:
                            {callCountdownText.secondsText}
                        </span>{' '}
                    </p>
                </div>
            )}
            <div className="video-frame h-[400px] w-full">
                <CallComposite
                    adapter={adapter}
                    callInvitationUrl={`${window.location.href}?room=${appointmentId}`}
                    formFactor="mobile"
                    rtl={false}
                    fluentTheme={currentTheme}
                />
            </div>
        </div>
    );
}
