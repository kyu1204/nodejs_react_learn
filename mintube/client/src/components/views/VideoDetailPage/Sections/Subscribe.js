import Axios from 'axios'
import React, { useEffect, useState } from 'react'

function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    useEffect(() => {
        let queryParams = {
            userTo: props.userTo,
            userFrom: localStorage.getItem('userId')
        }
        Axios.get('/api/subscribe/subscribeInfo', { params: queryParams })
            .then(response => {
                if (response.data.success) {
                    setSubscribeNumber(response.data.subscribeNumber)
                    setSubscribed(response.data.subscribed)
                }
                else {
                    alert('구독에 실패하였습니다.')
                }
            })

    }, [])

    const onSubscribeClick = () => {

        let body = {
            userTo: props.userTo,
            userFrom: localStorage.getItem('userId'),
            subscribed: Subscribed
        }

        // 구독 액션
        Axios.post('/api/subscribe/subscribe', body)
            .then(response => {
                if (response.data.success) {
                    if (Subscribed) {
                        setSubscribeNumber(SubscribeNumber - 1)
                    }
                    else {
                        setSubscribeNumber(SubscribeNumber + 1)
                    }
                    setSubscribed(!Subscribed)

                }
                else {
                    alert('구독 액션이 실패하였습니다.')
                }
            })
    }

    return (
        <div>
            <button
                style={{
                    backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius: '4px',
                    color: 'white', padding: '10px 16px',
                    fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
                }}
                onClick={onSubscribeClick}
            >
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}

            </button>
        </div>
    )
}

export default Subscribe
