import Iuser from "@/interfaces/Iuser";
import Cookies from "js-cookie";
import axiosService from "./axios";



export default async function getUserInfo() {
    const token = Cookies.get('token')
    if (!token) {
        return
    }
    const info = await axiosService.get('/user/me', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
        const userInfo: Iuser = res.data.data
        return userInfo
    }).catch((res) => {
        return res.response
    })
    return info
}