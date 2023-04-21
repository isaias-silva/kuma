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
export async function updateProfileBot(file: File, apiKey: string) {
    let arrayBuffer = await file.arrayBuffer()

    const formData = new FormData();
    formData.append("botToken", apiKey)

    const blob = new Blob([arrayBuffer])
    formData.append("profile", blob, "profile.png")

    const response = await axiosService.put('/upload/telegramBotProfile', formData, {
        headers: {
            'Authorization': token ? `Bearer ${token}` : null,
            'Content-Type': 'multipart/form-data'
        }
    }).then((res) => {

        return res
    }).catch((res) => {
        return (res.response)
    })
    return response
}