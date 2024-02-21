import axiosService from "./axios"



export default async function login(data: { email: string, password: string }) {
    const { email, password } = data
    const response = await axiosService.post('/auth/login', { email, password })
        .then((res) => { return res }).catch((res) => {

            return res.response
        })

    return response
}