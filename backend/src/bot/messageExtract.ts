import TelegramBot from "node-telegram-bot-api";


export default async function extract(socket: TelegramBot, msg: TelegramBot.Message){
    const { text, chat, } = msg
    const dataprofile = (await socket.getUserProfilePhotos(chat.id))?.photos[0]
    const profile = await socket.getFileLink(dataprofile[0].file_id)



    const message = {
        type: msg.photo ? "image" : msg.video ? "video" : msg.audio ? "audio" : msg.document ? "doc" : "text",
        text,
        urlMedia: null
    }
    if (message.type != "text") {
        const file = msg.video || msg.audio || msg.document ||  msg.photo[0] 
        const media = await socket.getFileLink(file.file_id)
        message.urlMedia = media
    }

    const formatMessage = {
        name: chat.username,
        id: chat.id,
        messages: [message],
        profile

    }
    return formatMessage

}