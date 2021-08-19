import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { logoutUser } from '../../../_actions/user_action'

function LandingPage(props) {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()

    const onLoginClickHandler = () => {
        props.history.push('/login')
    }

    const onLogoutClickHandler = () => {
        var token = ''

        if ('loginSuccess' in user) {
            token = user.loginSuccess.access_token
        }
        dispatch(logoutUser(token))
            .then(response => {
                if (response.payload.success) {
                    props.history.push('/login')
                }
                else {
                    alert('로그아웃이 실패 하였습니다.')
                }
            })
    }

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <h2>시작 페이지</h2>
            {
                'userData' in user && user.userData.isAuth ?
                    <button onClick={onLogoutClickHandler}>
                        로그아웃
                    </button>
                    :
                    <button onClick={onLoginClickHandler}>
                        로그인
                    </button>
            }

        </div>
    )
}

export default withRouter(LandingPage)