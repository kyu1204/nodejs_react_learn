import React, { useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'

function LandingPage() {
    const userState = useSelector(state => state.user)

    useEffect(() => {
        axios.get('/api/hello')
            .then(response => { console.log(response) })
    }, [])

    const onClickHandler = () => {
        const headers = {
            'Authorization': 'Bearer ' + userState.loginSuccess.access_token
        }
        console.log(headers)

        axios.get('/api/users/logout', { headers })
            .then(response => {
                console.log(response)
            })
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <h2>시작 페이지</h2>
            <button onClick={onClickHandler}>
                로그아웃
            </button>
        </div>
    )
}

export default LandingPage
