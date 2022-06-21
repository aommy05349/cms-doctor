import React, { useState } from 'react'
import dynamic from 'next/dynamic'
const VideoCard = dynamic(() => import("../../components/appointment/VideoCard"), {
    ssr: false,
});

export default function appointment() {
    const [groupId, setGroupId] = useState('b49ffd20-ee24-11ec-9615-d1e1c325a8f4')
    return (
        <div>
            <h1>Appointment Page</h1>
            <div>
                <VideoCard groupId={groupId} />
            </div>
        </div>
    )
}
