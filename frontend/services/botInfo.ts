import Cookies from "js-cookie";
import axiosService from "./axios";

export default async function getMyBots() {
    const token = Cookies.get('token')

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