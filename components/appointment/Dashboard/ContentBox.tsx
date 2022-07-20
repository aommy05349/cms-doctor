import { FC } from 'react';

import styles from './ContentBox.module.css';

interface Props {
    className?: string;
}

const ContentBox: FC<Props> = ({ children, className }) => {
    return (
        <div className={`${styles.contentBox} ${className}`}>{children}</div>
    );
};

export default ContentBox;

ContentBox.defaultProps = {
    className: '',
};
