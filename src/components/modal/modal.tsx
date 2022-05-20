import React from "react";
import ReactModal from "react-modal";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {toggleModal} from "../../store/authSlice";
import styles from "./modal.module.css";
import {Form} from "../form/form";

export const Modal: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch()
    const {isModalOpen} = useAppSelector(state => state.auth)

    const handleClose = () => {
        dispatch(toggleModal())
    }

    return (
        <ReactModal
            ariaHideApp={false}
            isOpen={isModalOpen}
            onRequestClose={handleClose}
            className={styles.modal_wrapper}
        >
            <div className={styles.modal_container}>
                <span className={styles.closeIcon} onClick={handleClose}>
                    &#10006;
                </span>
                <Form/>
            </div>
        </ReactModal>
    )
}