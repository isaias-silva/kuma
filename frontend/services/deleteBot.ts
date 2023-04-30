import Cookies from "js-cookie";
import axiosService from "./axios";

const token = Cookies.get('token')

export async function deleteTelBot(id: string) {
    const response = await axiosService.delete('/bot/delete', {
        headers: {
            'Authorization': token ? `Bearer ${token}` : null
        },
        data: { id }
    }).then((res) => {

        return res
    }).catch((res) => {
        return (res.response)
    })
    return response
}
export async function deleteCommandTelBot(apiKey: string, command: string) {
    const response = await axiosService.delete('/bot/delete_command', {
        headers: {
            'Authorization': token ? `Bearer ${token}` : null
        },
        data: { command, apiKey }
    }).then((res) => {

        return res
    }).catch((res) => {
        return (res.response)
    })
    return response
}