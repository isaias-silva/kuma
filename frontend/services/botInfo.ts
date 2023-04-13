import Cookies from "js-cookie";
import axiosService from "./axios";

const token = Cookies.get('token')

export async function getMyBots() {

    const info = await axiosService.get('/bot/all', {
        headers: {
            'Authorization': token ? `Bearer ${token}` : null
        }
    }).then((res) => {

        return res
    }).catch((res) => {
        return (res.response)
    })
    return info
}
export async function getBotForId(id: string) {
    const info = await axiosService.get(`/bot/${id}`, {
        headers: {
            'Authorization': token ? `Bearer ${token}` : null
        }
    }).then((res) => {

        return res
    }).catch((res) => {
        return (res.response)
    })
    return info

}