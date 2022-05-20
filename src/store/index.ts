import {configureStore} from '@reduxjs/toolkit';
import todosReducer from '../store/todoSlice';
import authReducer from './authSlice';

const store = configureStore({
    reducer: {
        todos: todosReducer,
        auth: authReducer
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;