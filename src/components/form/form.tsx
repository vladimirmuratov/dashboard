import React, {useEffect, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import styles from "./form.module.css";
import {EyeIcon} from "../eyeIcons/eyeIcon";
import {EyeSlashIcon} from "../eyeIcons/eyeSlashIcon";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {createUser, login, signUp} from "../../store/authSlice";
import {Auth} from "../../types";
import {toast} from "react-toastify";
import {Preloader} from "../preloader/preloader";

interface IInput {
    name: string,
    email: string,
    password: string,
}

export const Form: React.FC = (): JSX.Element => {
    const dispatch = useAppDispatch()
    const {error, data, isLoading} = useAppSelector(state => state.auth)
    const [isLogin, setIsLogin] = useState(true)
    const [showPass, setShowPass] = useState(false)
    const [userName, setUserName] = useState('')
    const {register, handleSubmit, formState: {errors}} = useForm<IInput>()

    const onSubmit: SubmitHandler<IInput> = async (dataForm: Auth) => {
        setUserName(dataForm.name)
        if (!isLogin) {
            await dispatch(signUp(dataForm))
        } else {
            await dispatch(login(dataForm))
        }
    }

    useEffect(() => {
        if (data?.localId.length && !data.registered) {
            const payload = {
                id: data.localId,
                email: data.email,
                name: userName
            }
            dispatch(createUser(payload))
        }
    }, [data?.localId, userName, data?.email, dispatch])

    const toggleForm = () => setIsLogin(!isLogin)
    const toggleShowPass = () => setShowPass(!showPass)

    useEffect(() => {
        if (error.length) {
            toast.error(error)
        }
    }, [error])

    return (
        <>
            {isLoading
                ? <Preloader/>
                : (<div className={styles.form_container}>

                    <h1 className={styles.title}>{isLogin ? 'Вход' : 'Регистрация'}</h1>

                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                        {!isLogin &&
                        (<>
                            <input
                                {...register("name", {required: true})}
                                className={styles.input}
                                placeholder="имя"
                            />
                            {errors.name?.type === 'required' &&
                            <span className={styles.error}>The name is required</span>}
                        </>)
                        }
                        <input
                            {...register("email",
                                {required: true, pattern: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/i})
                            }
                            className={styles.input}
                            placeholder="email"
                        />
                        {errors.email?.type === 'required' &&
                        <span className={styles.error}>The email is required</span>}
                        {errors.email?.type === 'pattern' && <span className={styles.error}>This is not email</span>}
                        <div className={styles.input_password}>
                            <input
                                type={showPass ? "text" : "password"}
                                {...register("password",
                                    {required: true, pattern: /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/})
                                }
                                className={styles.input}
                                placeholder="пароль"
                            />
                            {showPass
                                ? <span onClick={toggleShowPass} className={styles.eyeIcon}><EyeSlashIcon/></span>
                                : <span onClick={toggleShowPass} className={styles.eyeIcon}><EyeIcon/></span>
                            }
                        </div>
                        {errors.password?.type === 'required' &&
                        <span className={styles.error}>The password is required</span>}
                        {errors.password?.type === 'pattern' && (
                            <span className={styles.error}>
                        The password must include: letters, digits, special characters, min length: 8 symbols
                    </span>
                        )}
                        <input type="submit" className={styles.button}/>
                    </form>
                    {
                        isLogin
                            ? (<p className={styles.subTitle} onClick={toggleForm}>Регистрация</p>)
                            : (<p className={styles.subTitle} onClick={toggleForm}>Уже зарегистрированы? Войти</p>)
                    }
                </div>)
            }
        </>
    )
}