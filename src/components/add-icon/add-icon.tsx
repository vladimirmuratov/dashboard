import React from "react";
import styles from "./add-icon.module.css";

type TProps = {
    onClick: () => void;
}

export const AddIcon: React.FC<TProps> = ({onClick}): JSX.Element => {
    return (
        <span
            className={styles.add_icon}
            onClick={onClick}
        >
            +
        </span>
    )
}