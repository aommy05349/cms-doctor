import React from 'react'
import dynamic from 'next/dynamic'
const VideoCard = dynamic(() => import("../../components/appointment/VideoCard"), {
    ssr: false,
});

export default function appointment() {
  return (
    <div>
        <h1>DDDDD</h1>
        <div>
            <VideoCard />
        </div>
    </div>
  )
}
