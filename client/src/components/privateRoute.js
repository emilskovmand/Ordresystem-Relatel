import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../components/context/auth'

export default function PrivateRoute({ children, exact = false, authed, ...rest }) {
    let auth = useAuth();

    return (
        <Route {...rest} exact={exact} render={({ location }) => {
            return (auth.user != null)
                ? (
                    children
                )
                : (
                    <Redirect to={{
                        pathname: '/login',
                        state: { from: location }
                    }} />
                )
        }} />
    )
}