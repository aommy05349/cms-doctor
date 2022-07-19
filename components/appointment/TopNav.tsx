import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const TopNav: React.FC<{ onBack?: () => void }> = ({ onBack }) => (
    <header className="bg-[#F2F2F2] flex flex-row flex-wrap items-center w-full">
        <div className="p-2">
            <button
                className="w-[40px] h-[40px] rounded-full hover:bg-white ease-in duration-200"
                onClick={onBack}
            >
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    className="text-i-green"
                />
            </button>
            <span className="font-noto-bold ml-3">ห้องตรวจ</span>
            <span className="ml-2">#HN938405</span>
        </div>
    </header>
);

export default TopNav;
