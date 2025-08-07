import api from "./axios"

import { MailType } from "@/types/api-client/auth"


export const sendMail = async (data: MailType) => {
    const res = await api.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}:8010/auth/mail`, data)

    return {
        "status": res.status,
        "data" : res.data
    }
}