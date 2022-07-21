import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Loader: FC<{ className?: string }> = ({ className }) => (
    <div
        className={`w-full h-20 flex justify-center items-center text-gray-500 ${className}`}
    >
        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
    </div>
);

export default Loader;

Loader.defaultProps = {
    className: '',
};
