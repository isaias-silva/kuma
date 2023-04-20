import fs from 'fs'
type formDataAtrib = {
    title: string
    value: string
}
export default async function generateFormData(blob: Blob, info: formDataAtrib[]) {

    const formData = new FormData()

    formData.append('photo', blob, 'profile.png')
    info.forEach((item) => {
        formData.append(item.title, item.value)
    })

    return formData
}