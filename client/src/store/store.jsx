import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: "",
    fullName: "",
    tasks: [],
    subjects: [],
    chats: [],
    showAuth: false,
    date: new Date().getTime(),
    backgroundColor: localStorage.getItem('backgroundColor') || 'bg-blue-500',
    theme: localStorage.getItem('theme') || 'light',
    ProfileImage: localStorage.getItem('ProfileImage') || '',
    logged: false,
    handleAuth: true
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setFullName: (state, action) => {
            state.fullName = action.payload;
        },
        clearUser: (state) => {
            state.token = null;
            state.fullName = '';
        },
        setSubjects: (state, action) => {
            state.subjects = action.payload;
        },
        setShowAuth: (state, action) => {
            state.showAuth = action.payload;
        },
        setDate: (state, action) => {
            state.date = action.payload;
        },
        setBackgroundColor: (state, action) => {
            state.backgroundColor = action.payload;
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
        setProfileImage: (state, action) => {
            state.ProfileImage = action.payload;
            localStorage.setItem('ProfileImage', action.payload);
        },
        setTasks: (state, action) => {
            state.tasks = action.payload;
        },
        setLogged: (state, action) => {
            state.logged = action.payload;
        },
        setHandleAuth: (state, action) => {
            state.handleAuth = action.payload;
        },
        setChats: (state, action) => {
            state.chats = action.payload;
        }
    }
});

export const { setProfileImage, setBackgroundColor, setTheme, setToken, setFullName, clearUser, setShowAuth, setDate, setTasks, setLogged, setSubjects, setHandleAuth, setChats } = userSlice.actions;

const store = configureStore({
    reducer: {
        user: userSlice.reducer,
    },
});

export default store;
