import React, {useEffect, useState} from "react";
import {nanoid} from 'nanoid';
import axios from "axios";
import {useDrop} from "react-dnd";

import styles from "./main-block.module.css";
import {Todo} from "../../types";
import {AddIcon} from "../add-icon/add-icon";
import {AddForm} from "../add-form/add-form";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {addNewTodo, deleteTodo, fetchTodos} from "../../store/todoSlice";
import {Preloader} from "../preloader/preloader";
import {BLOCK_ONE, BLOCK_THREE, BLOCK_TWO} from "../../constants";
import {Block} from "../block/block";
import {Header} from "../header/header";
import {Modal} from "../modal/modal";
import {localStorageService} from "../../services/localStorage.service";
import {getCurrentUser} from "../../store/authSlice";
import {REFRESH_TOKEN_URL} from "../../config";

export const MainBlock = (): JSX.Element => {
    const dispatch = useAppDispatch()
    const {isLoading, block_one, block_two, block_three} = useAppSelector(state => state.todos)
    const {data, user} = useAppSelector(state => state.auth)
    const [isShowForm, setShowForm] = React.useState(false)
    const [movedTodo, setMovedTodo] = useState<Todo | null>(null)
    const refreshToken = localStorageService.getRefreshToken()
    const expiresDate = localStorageService.getExpiresDate()

    async function updateToken() {
        if (refreshToken && Date.now() > Number(expiresDate)) {
            const {data} = await axios.post(REFRESH_TOKEN_URL, {
                grant_type: "refresh_token",
                refresh_token: refreshToken
            })
            const {expires_in, id_token, refresh_token, user_id} = data
            localStorageService.setTokens({
                expiresIn: expires_in,
                idToken: id_token,
                refreshToken: refresh_token,
                localId: user_id
            })
        }
    }

    useEffect(() => {
       updateToken()
    }, [])

    const toggleVisibleForm = () => setShowForm(!isShowForm)


    useEffect(() => {
        if (localStorageService.getAccessToken()) {
            const userId = localStorageService.getUserId()
            window.setTimeout(() => {
                if (userId) {
                    dispatch(getCurrentUser(userId))
                }
            }, 0)
        }
    }, [data])


    useEffect(() => {
        dispatch(fetchTodos())
    }, [user])

    //---------------------------------------------------------

    async function removeTodo(block: Todo[], id: string, blockName: string) {
        block.forEach(item => {
            if (item.id === id) {
                const key = item.key
                dispatch(deleteTodo({blockName, key}))
            }
        })
    }

    function searchTodo(block: any, id: string) {
        Object.keys(block).forEach(key => {
            Object.keys(block[key]).forEach(k => {
                if (block[key][k] === id) {
                    setMovedTodo(block[key])
                }
            })
        })
    }

    const handleAddTodo = async (text: string, color: string) => {
        const id = nanoid()
        const data = {
            id,
            text,
            color,
            key: ''
        }
        await dispatch(addNewTodo({data, blockName: BLOCK_ONE}))
        await dispatch(fetchTodos())
        setShowForm(false)
    }

    const handleRemoveTodo = async (id: string) => {
        const answer = window.confirm('Delete?')
        if (answer) {
            await removeTodo(block_one, id, BLOCK_ONE)
            await removeTodo(block_two, id, BLOCK_TWO)
            await removeTodo(block_three, id, BLOCK_THREE)
            window.setTimeout(() => {
                dispatch(fetchTodos())
            }, 1500)
        }
    }
    //---------------------------------------------------------
    const [, dropTarget] = useDrop({
        accept: "card",
        drop(itemId: { id: string }) {
            handleDrop1();
        },
        hover(itemId) {
            searchTodo(block_one, itemId.id)
        }
    });

    async function handleDrop1() {
        if (movedTodo) {
            await dispatch(deleteTodo({blockName: BLOCK_ONE, key: movedTodo.key}))
            await dispatch(addNewTodo({data: movedTodo, blockName: BLOCK_TWO}))
            await dispatch(fetchTodos())
            setMovedTodo(null)
        }
    }

    //---------------------------------------------------------
    const [, dropTarget2] = useDrop({
        accept: "card",
        drop(itemId: { id: string }) {
            handleDrop2();
        },
        hover(itemId) {
            searchTodo(block_two, itemId.id)
        }
    });

    async function handleDrop2() {
        if (movedTodo) {
            await dispatch(deleteTodo({blockName: BLOCK_TWO, key: movedTodo.key}))
            await dispatch(addNewTodo({data: movedTodo, blockName: BLOCK_THREE}))
            await dispatch(fetchTodos())
            setMovedTodo(null)
        }
    }

    return (
        <>
            <Header/>
            {user && <AddIcon onClick={toggleVisibleForm} showForm={isShowForm}/>}
            {isLoading
                ? <Preloader/>
                : (<main className={styles.main_block} onDoubleClick={() => setShowForm(false)}>
                    <>
                        <Block title={'block 1'} block={block_one} onRemove={handleRemoveTodo}>
                            {isShowForm && <AddForm onAdd={handleAddTodo}/>}
                        </Block>

                        <Block title={'block 2'} block={block_two} onRemove={handleRemoveTodo} myRef={dropTarget}/>

                        <Block title={'block 3'} block={block_three} onRemove={handleRemoveTodo}
                               myRef={dropTarget2}/>
                    </>
                </main>)
            }
            <Modal/>
        </>
    )
}