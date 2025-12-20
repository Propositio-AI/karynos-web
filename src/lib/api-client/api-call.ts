import axios from "axios";
import api from "./axios";

type ApiConfig<T> = {
    data?: T
    params?: T
    headers?: Record<string, string>;
}
// process.env.NEXT_PUBLIC_API_BASE_URL = http://localhost:
export const APIcall = async <TSend, TReceive>(
        method: "GET" | "POST" | "PUT" | "DELETE",
        url: string,    
        config?: ApiConfig<TSend>,
        // onSuccess?: (data: TReceive) => Promise<void> | null,
        onSuccess?: (data: TReceive) => void | Promise<void>,
        onError?: (code: string, message: string) => Promise<void>,
    ): Promise<boolean> => {
    // const full_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`
    const full_url = `http://localhost:${url}`;// 仮
    try{
        let res;

        switch (method){
            case "GET":
                res = await api.get<TReceive>(full_url, config);
                break;
                
            case "POST":
                res = await api.post<TReceive>(full_url, config?.data);
                break;

            case "PUT":
                res = await api.put<TReceive>(full_url, config?.data);
                break;

            case "DELETE":
                res = await api.delete<TReceive>(full_url, config);
                break;

            default:
                throw new Error(`Unsupported method: ${method}`);
        }
        
        if(onSuccess) await onSuccess(res.data)
        
        return true

    }catch(error: unknown){
        if(axios.isAxiosError(error)){
            if(error.response){
                const http_status = error.response.status
                const error_data = error.response.data
                const error_code = `${http_status}-${error_data.code}`
                const error_message = error_data.message

                if(onError) await onError(error_code, error_message)
            }else{
                // ネットワークエラー
                // this.onError()
            }
        }else{
            console.log(error)
        }

        return false
    }
}
