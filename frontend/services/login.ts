import axiosService from "./axios"



export default async function login(data: { name: string, password: string }) {
    const { name, password } = data
    const response = await axiosService.post('/auth/login', { name, password })
        .then((res) => { return res }).catch((res) => {

            return res.response
        })

    return response
}