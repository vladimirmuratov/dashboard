import {ACCESS_TOKEN, EXPIRES, REFRESH_TOKEN, USER_ID} from "../constants";

interface ITokens {
    expiresIn: string,
    idToken: string,
    refreshToken: string,
    localId: string
}

function setTokens({expiresIn = '3600', idToken, refreshToken, localId}: ITokens) {
    const expiresDate = new Date().getTime() + Number(expiresIn) * 1000

    localStorage.setItem(USER_ID, localId)
    localStorage.setItem(ACCESS_TOKEN, idToken)
    localStorage.setItem(REFRESH_TOKEN, refreshToken)
    localStorage.setItem(EXPIRES, String(expiresDate))
}

function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN)
}

function getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN)
}

function getExpiresDate() {
    return localStorage.getItem(EXPIRES)
}

function getUserId() {
    return localStorage.getItem(USER_ID)
}

function removeTokens() {
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)
    localStorage.removeItem(EXPIRES)
    localStorage.removeItem(USER_ID)
}

export const localStorageService = {
    setTokens,
    getAccessToken,
    getRefreshToken,
    getExpiresDate,
    getUserId,
    removeTokens
}