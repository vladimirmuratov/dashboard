import React from "react";
import styles from "./header.module.css";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {logout, toggleModal} from "../../store/authSlice";
import {localStorageService} from "../../services/localStorage.service";

export const Header = () => {
    const dispatch = useAppDispatch()
    const {user} = useAppSelector(state => state.auth)

    const handleLogin = () => {
        dispatch(toggleModal())
    }

    const handleLogout = () => {
        dispatch(logout())
        localStorageService.removeTokens()
    }

    return (
        <header className={styles.header_block}>
            Dashboard
            {user?.name?.length
                ? (<>
                    <span className={styles.header_block_user}>{user.name}</span>
                    <span className={styles.header_block_exit} onClick={handleLogout}>Exit</span>
                </>)
                : < button className={styles.header_block_user} onClick={handleLogin}>Вход/Регистрация</button>
            }
        </header>
    )
}