import React from "react";
import styles from "./add-icon.module.css";

type TProps = {
    onClick: () => void;
    showForm: boolean;
}

export const AddIcon: React.FC<TProps> = ({onClick, showForm}): JSX.Element => {
    return (
        <span
            className={styles.add_icon}
            onClick={onClick}
        >
            {showForm ? 'close' : '+'}
        </span>
    )
}