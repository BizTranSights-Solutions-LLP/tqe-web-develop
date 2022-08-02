import { UserData } from './user-data';

export interface LoginResponse {
    badge: Number,
    meta: {
        code: Number,
        message: string
    },
    result: UserData
}