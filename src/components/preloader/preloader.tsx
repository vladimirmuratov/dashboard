import React from "react";
import styles from "./preloader.module.css";

export const Preloader = (): JSX.Element => {
    return(
        <div className={styles.preloader_container}>
            <div className={styles.preloader}/>
        </div>
    )
}