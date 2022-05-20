import {createAsyncThunk, createSlice, AnyAction, PayloadAction} from "@reduxjs/toolkit";
import {Todo} from "../types";
import {httpService} from "../services/http.service";
import {BLOCK_ONE, BLOCK_THREE, BLOCK_TWO} from "../constants";
import {localStorageService} from "../services/localStorage.service";

export const fetchTodos = createAsyncThunk<{ [key: string]: any }, undefined, { rejectValue: string }>(
    "todos/fetchTodos",
    async function (_, {rejectWithValue}) {
        try {
            if (localStorageService.getAccessToken()) {
                const userId = localStorageService.getUserId()
                const response = await httpService.get(`users/${userId}.json`)
                return response.data
            }

        } catch (error) {
            return rejectWithValue('Error server!')
        }
    }
)

export const addNewTodo = createAsyncThunk<Todo, { data: Todo, blockName: string }, { rejectValue: string }>(
    "todos/addNewTodo",
    async function (payload, {rejectWithValue}) {
        const {data, blockName} = payload
        try {
            if (localStorageService.getAccessToken()) {
                const userId = localStorageService.getUserId()
                const response = await httpService.post(`users/${userId}/${blockName}.json`, data)
                return response.data
            }
        } catch (error) {
            return rejectWithValue('Can\'t added new todo')
        }
    }
)

export const deleteTodo = createAsyncThunk<Todo, { blockName: string, key: string }, { rejectValue: string }>(
    "todos/deleteTodo",
    async function ({blockName, key}, {rejectWithValue}) {
        try {
            if (localStorageService.getAccessToken()) {
                const userId = localStorageService.getUserId()
                const response = await httpService.delete(`users/${userId}/${blockName}/${key}.json`)
                return response.data
            }
        } catch (error) {
            return rejectWithValue('Can\'t removed this todo')
        }
    }
)

interface IInitialState {
    block_one: Todo[],
    block_two: Todo[],
    block_three: Todo[],
    isLoading: boolean,
    error: undefined | string
}

const initialState: IInitialState = {
    block_one: [],
    block_two: [],
    block_three: [],
    isLoading: false,
    error: ''
}


const todoSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, (state) => {
                state.isLoading = true;
                state.error = '';
                state.block_one = []
                state.block_two = []
                state.block_three = []
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.isLoading = false;
                const resObj: {
                    [objName: string]: any
                } = action.payload
                for (let key in resObj) {
                    for (let k in resObj[key]) {
                        if (key === BLOCK_ONE) {
                            const obj = resObj[key][k]
                            obj.key = k
                            state.block_one.push(obj)
                        } else if (key === BLOCK_TWO) {
                            const obj = resObj[key][k]
                            obj.key = k
                            state.block_two.push(obj)
                        } else if (key === BLOCK_THREE) {
                            const obj = resObj[key][k]
                            obj.key = k
                            state.block_three.push(obj)
                        }
                    }
                }
            })
            .addCase(addNewTodo.pending, (state) => {
                state.isLoading = true
                state.error = ''
            })
            .addCase(addNewTodo.fulfilled, (state) => {
                state.isLoading = false
            })
            .addMatcher(isError, (state, action: PayloadAction<string>) => {
                state.error = action.payload;
                state.isLoading = false;
            })
    }
})

function isError(action: AnyAction) {
    return action.type.endsWith('rejected');
}

export default todoSlice.reducer