import axios from "axios";

export default async function login(data: { name: string, password: string }) {
    const { name, password } = data
    const response = await axios.post('http://localhost:8080/auth/login', { name, password })
    .then((res)=>{return res}).catch((res)=>{
       
        return res.response
    })

    return response
}