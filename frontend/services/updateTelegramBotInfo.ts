import Cookies from "js-cookie";
import axiosService from "./axios";

const token = Cookies.get('token')

export async function updateBotName(name: string, apiKey: string) {
    const response = await axiosService.put('/bot/update', { name, apiKey }, {
        headers: {
            'Authorization': token ? `Bearer ${token}` : null
        }
    }).then((res) => {

        return res
    }).catch((res) => {
        return (res.response)
    })
    return response
}