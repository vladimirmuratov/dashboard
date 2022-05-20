export interface Todo {
    id: string;
    text: string;
    color: string;
    key: string;
}

export interface Auth {
    name: string,
    email: string,
    password: string,
}

export interface AuthResponse {
    kind?: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean
}

export interface User {
    id: string,
    email: string,
    name: string
}