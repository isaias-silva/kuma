import Cookies from "js-cookie";
import axiosService from "./axios";

const token = Cookies.get('token')

export default async function createBot(name: string, apiKey: string) {
  
    const info = await axiosService.post('/bot/create', {
        name: name,
        apiKey: apiKey
    }
        , {

            headers: {
                'Authorization': `Bearer ${token}`,
               
            },
        }).then(res => {

            return res
        }).catch((res) => {
            console.log(res)
            return res.response
        })
    return info
}