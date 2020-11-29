import React, { useContext, createContext, useState } from "react";
import { GetUser } from '../../services/userService'

const UserAuth = {
    isAuthenticated: false,
    user: localStorage.getItem('token') !== "null" ? JSON.parse(localStorage.getItem('token')) : null,
    async signin(cb) {
        await GetUser().then(response => {
            if (response.user) {
                this.user = response;
                this.isAuthenticated = true;
                cb();
            }
        })
    },
    async signout(cb) {
        this.isAuthenticated = false;
        this.user = null;
        cb();
    }
};

const authContext = createContext();

function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return (
        <authContext.Provider value={auth}>
            {children}
        </authContext.Provider>
    )
}

function useAuth() {
    return useContext(authContext)
}

function useProvideAuth() {
    const [user, setUser] = useState(UserAuth.user);

    const signin = cb => {
        return UserAuth.signin(() => {
            setUser(UserAuth.user);
            localStorage.setItem('token', JSON.stringify(UserAuth.user));
            if (cb) cb();
        })
    }

    const signout = cb => {
        return UserAuth.signout(() => {
            setUser(null);
            localStorage.removeItem('token');
            if (cb) cb();
        })
    }

    return {
        user,
        signin,
        signout
    }
}

export {
    useAuth,
    ProvideAuth,
    UserAuth,
    useProvideAuth
}