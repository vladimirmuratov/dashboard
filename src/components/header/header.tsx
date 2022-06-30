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
            <div>Dashboard</div>
            {user?.name?.length
                ? (<div className={styles.header_block_user}>
                    <span >{user.name}</span>
                    <span className={styles.header_block_exit} onClick={handleLogout}>Exit</span>
                </div>)
                : < button className={styles.header_block_user} onClick={handleLogin}>Вход/Регистрация</button>
            }
        </header>
    )
}