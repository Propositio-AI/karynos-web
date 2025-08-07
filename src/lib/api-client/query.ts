import api from "./axios"

import { newQueryType } from "@/types/api-client/query"


export const sendQuery = async (data: newQueryType) => {
    const res = await api.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}:8080/query`, data)

    return {
        "status": res.status,
        "data" : res.data
    }
}