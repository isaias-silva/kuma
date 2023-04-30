import Cookies from "js-cookie";
import axiosService from "./axios";

const token = Cookies.get('token')

export async function createBot(name: string, apiKey: string) {

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
export async function addBotCommand(apiKey: string, command: string, description: string) {
    const info = await axiosService.post('/bot/create_command', {
        command,
        description,
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