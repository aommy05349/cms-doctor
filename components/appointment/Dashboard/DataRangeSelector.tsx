import { FC, MouseEvent } from 'react';

interface RangeButtonProps {
    active?: boolean;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const RangeButton: FC<RangeButtonProps> = ({ children, active, onClick }) => {
    return (
        <button
            className={`text-xs font-bold border border-[#E0E0E0] h-8 flex items-center justify-center rounded-[4px] ${
                active ? 'text-white bg-i-green border-i-green' : ''
            } hover:text-white hover:bg-i-green hover:border-i-green`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

RangeButton.defaultProps = {
    active: false,
};

interface Props {
    value?: number;
    onChange?: (datarange: number) => void;
}

const DataRangeSelector: FC<Props> = ({ value, onChange }) => {
    const RANGE_LIST = [
        {
            value: 30,
            label: '1 เดือน',
        },
        {
            value: 90,
            label: '3 เดือน',
        },
        {
            value: 180,
            label: '6 เดือน',
        },
    ];

    return (
        <div className="grid grid-cols-3 gap-4 mb-8 px-4">
            {RANGE_LIST.map((range) => (
                <RangeButton
                    key={range.value}
                    active={value === range.value}
                    onClick={() => onChange && onChange(range.value)}
                >
                    {range.label}
                </RangeButton>
            ))}
        </div>
    );
};

export default DataRangeSelector;

DataRangeSelector.defaultProps = {
    value: 30,
};
