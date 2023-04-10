import axios from "axios";

export default async function infoTelegramUser(botToken: string) {
if(!botToken){
   
    return
}

    const info: { id: string, first_name: string } | null = await axios.get(`https://api.telegram.org/bot${botToken}/getMe`)
        .then((res) => { return res.data.result }).catch((err) => {
            return null
        })

    if (!info) {
        return
    }
    // Faça a solicitação para a API do Telegram
    const profile = await axios.post(`https://api.telegram.org/bot${botToken}/getUserProfilePhotos`, {
        user_id: info.id,
    })
        .then(response => {
            const photos = response.data.result.photos;
            console.log(response)
            // Se o usuário tiver fotos de perfil
            if (photos.length > 0) {
                // Obtenha a última foto de perfil
                const photo = photos[photos.length - 1];
                const fileId = photo[0].file_id;

                // Solicite informações sobre o arquivo da foto
                return axios.post(`https://api.telegram.org/bot${botToken}/getFile`, {
                    file_id: fileId,
                });
            }
        })
        .then(response => {
            if (response) {
                const file = response.data.result;
                const fileUrl = `https://api.telegram.org/file/bot${botToken}/${file.file_path}`;

                // Use a URL do arquivo para exibir a foto de perfil
                return (fileUrl);
            }
        })
        .catch(error => {
            console.error(error);
        });

    return {
        name: info.first_name,
        id: info.id,
        profile
    }
}