import Image from 'next/image'
import React from 'react'

export default function Aside() {
  return (
    <aside className="bg-gradient-to-r from-[#2fb487] to-[#35be78] h-full w-[220px] flex flex-col">
        <div className="m-9 flex-none">
            <div className="relative h-[49px] w-[49px]">
                <Image src="/logo-white.png" layout="fill" objectFit="contain" />
            </div>
        </div>
        <div className="menuList flex-grow">
            <div className="mt-[50px] p-3 bg-[#09cf6d] font-noto-medium text-xl text-white text-center border-r-8 border-[#03e058]">
                Tele Migraine
            </div>
        </div>
        <div className="menuList flex-none h-[100px]">
            <div className="p-2 font-noto-medium text-xl text-white text-center cursor-pointer hover:bg-[#09cf6d] ease-in duration-300">
                ออกจากระบบ
            </div>
        </div>
    </aside>
  )
}
