import Cookies from "js-cookie";
import axiosService from "./axios";


const token = Cookies.get('token')

export async function updateName(name: string) {
  
    const info = await axiosService.put('/user/update', {
        name
    }, {
        headers: {
            'Authorization': token?`Bearer ${token}`:null
        }
    }).then((res) => {
       
        return res
    }).catch((res) => {
     console.log(res)
        return res.response
    })
    return info
}
export async function updateUserProfile(profile: File) {
    let bufferProfile;
    if (!profile) {
        return
    }

    let arrayBuffer = await profile.arrayBuffer()
    bufferProfile = Buffer.from(arrayBuffer)
    const profileInfo = await axiosService.put('/upload/profile', {
        file: bufferProfile
    },
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }

        }
    ).then(res => {
        
        return res
    }).catch((res) => {
        console.log(res)
        return res.response
    })
    return profileInfo
}