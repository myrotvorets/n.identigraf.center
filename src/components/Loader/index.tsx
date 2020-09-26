import { h } from 'preact';
import Modal from '../Modal';

import logo from '../../assets/identigraf-logo.svg';
import './loader.scss';

export default function Loader(): h.JSX.Element {
    return (
        <Modal>
            <img src={logo} alt="Зачекайте, будь ласка" className="Loader" />
        </Modal>
    );
}
