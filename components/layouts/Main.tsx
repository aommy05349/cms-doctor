import React from 'react';
import Aside from '../Aside';

const MainLayout = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className="app flex flex-row h-[100vh]">
            <Aside />
            <div className="flex-grow">{children}</div>
        </div>
    );
};

export default MainLayout;
