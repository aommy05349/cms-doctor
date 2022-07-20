import { FC } from 'react';

import Modal from '../../Modal';

interface Props {
    show: boolean;
    onClose: () => void;
}

const MigraineLevelInfoModal: FC<Props> = ({ show, onClose }) => {
    return (
        <Modal isShow={show} width="325px" onClose={onClose}>
            Hi this is migraine level info modal
        </Modal>
    );
};

export default MigraineLevelInfoModal;
