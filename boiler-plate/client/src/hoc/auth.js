import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { auth } from '../_actions/user_action'


export default function (SpecificComponent, option, adminRoute = null) {

    // option
    // null => public
    // true => is login
    // false => is not login

    function AuthenticationCheck(props) {
        const dispatch = useDispatch()
        const user = useSelector(state => state.user)
        var token = ''

        if ('loginSuccess' in user) {
            token = user.loginSuccess.access_token
        }

        useEffect(() => {
            dispatch(auth(token))
                .then(response => {
                    // login 하지 않은 상태
                    if (!response.payload.isAuth) {
                        // login이 필요한 페이지
                        if (option) {
                            props.history.push('/login')
                        }
                    }
                    // login한 상태
                    else {
                        if (adminRoute && !response.payload.isAdmin) {
                            props.history.push('/')
                        }
                        else {
                            if (option === false)
                                props.history.push('/')
                        }
                    }
                })
        }, [])

        return (
            <SpecificComponent />
        )
    }
    return AuthenticationCheck
}