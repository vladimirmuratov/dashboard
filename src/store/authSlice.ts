import {AnyAction, createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Auth, AuthResponse, User} from "../types";
import {httpAuth} from "../services/httpAuth.service";
import {httpService} from "../services/http.service";
import {localStorageService} from "../services/localStorage.service";
import {LOGIN, SIGNUP} from "../constants";

export const signUp = createAsyncThunk<AuthResponse, Auth, { rejectValue: string }>(
    "auth/signUp",
    async function ({email, password}, {rejectWithValue}) {
        const data = {
            email,
            password,
            returnSecureToken: true
        }
        try {
            const response = await httpAuth.post(SIGNUP, data)
            if (response.status === 200) {
                return response.data
            }
        } catch (e) {
            return rejectWithValue('Error authentication!')
        }
    }
)

export const login = createAsyncThunk<AuthResponse, Auth, { rejectValue: string }>(
    "auth/login",
    async function ({email, password}, {rejectWithValue}) {
        const data = {
            email,
            password,
            returnSecureToken: true
        }
        try {
            const response = await httpAuth.post(LOGIN, data)
            if (response.status === 200) {
                return response.data
            }
        } catch (e) {
            return rejectWithValue('Error login!')
        }
    }
)

export const createUser = createAsyncThunk<User, User, { rejectValue: string }>(
    "auth/createUser",
    async function (payload, {rejectWithValue}) {
        const id = payload.id
        try {
            const response = await httpService.put(`/users/${id}.json`, payload)
            return response.data
        } catch (e) {
            return rejectWithValue('Error create user!')
        }
    }
)

export const getCurrentUser = createAsyncThunk<User, string, { rejectValue: string }>(
    'auth/getCurrentUser',
    async function (userId, {rejectWithValue}) {
        try {
            const response = await httpService.get(`/users/${userId}.json`)
            return response.data
        } catch (e) {
            return rejectWithValue('Error getting the current user!')
        }
    }
)

interface IInitialState {
    isModalOpen: boolean,
    isLoading: boolean,
    error: string,
    data: AuthResponse,
    user: User
}

const initialState: IInitialState = {
    isModalOpen: false,
    isLoading: false,
    error: '',
    data: null as unknown as AuthResponse,
    user: null as unknown as User,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        toggleModal(state) {
            state.isModalOpen = !state.isModalOpen
        },
        logout(state) {
            state.user = null as unknown as User
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signUp.pending, (state) => {
                state.isLoading = true
                state.error = ''
            })
            .addCase(signUp.fulfilled, (state, action) => {
                localStorageService.setTokens(action.payload)
                state.isLoading = false
                state.isModalOpen = false
                state.data = action.payload
            })
            .addCase(createUser.pending, (state) => {
                state.isLoading = true
                state.error = ''
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
            })
            .addCase(getCurrentUser.pending, (state) => {
                state.isLoading = true
                state.error = ''
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                const {id, email, name} = action.payload
                state.isLoading = false
                state.user = {id, email, name}
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true
                state.error = ''
            })
            .addCase(login.fulfilled, (state, action) => {
                localStorageService.setTokens(action.payload)
                state.isLoading = false
                state.isModalOpen = false
                state.data = action.payload
            })
            .addMatcher(isError, (state, action: PayloadAction<string>) => {
                state.error = action.payload;
                state.isLoading = false;
            });
    }
})

function isError(action: AnyAction) {
    return action.type.endsWith('rejected');
}

export const {toggleModal, logout} = authSlice.actions
export default authSlice.reducer