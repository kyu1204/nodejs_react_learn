import axios from "axios"
import { LOGIN_USER, REGISTER_USER, AUTH_USER, LOGOUT_USER } from './types'

export function loginUser(dataToSubmit) {

    const request = axios.post('/api/users/login', dataToSubmit)
        .then(response => response.data)

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function registerUser(dataToSubmit) {

    const request = axios.post('/api/users/register', dataToSubmit)
        .then(response => response.data)

    return {
        type: REGISTER_USER,
        payload: request
    }
}

export function logoutUser(access_token = '') {
    let headers = {
        'Authorization': "Bearer " + access_token
    }
    const request = axios.get('/api/users/logout', { headers })
        .then(response => response.data)

    return {
        type: LOGOUT_USER,
        payload: request
    }
}

export function auth(access_token = '') {
    let headers = {
        'Authorization': "Bearer " + access_token
    }
    const request = axios.get('/api/users/auth', { headers })
        .then(response => response.data)

    return {
        type: AUTH_USER,
        payload: request
    }
}