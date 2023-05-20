import TelegramBot from "node-telegram-bot-api";


export default async function extract(socket: TelegramBot, msg: TelegramBot.Message) {
    let formatMessage
    try {

        const { text, chat } = msg
        let dataprofile
        let profile

        if (chat.type == 'private') {
            dataprofile = (await socket.getUserProfilePhotos(chat.id))?.photos[0]
            profile = await socket.getFileLink(dataprofile[0].file_id)
        }
        if (chat.type == 'group') {
            const info = await socket.getChat(chat.id)
            if (info.photo) {
                profile = (await socket.getFileLink(info.photo.small_file_id || info.photo.big_file_id))
            }
        }


        const message = {
            type: msg.photo ? "image" : msg.video ? "video" : msg.audio ? "audio" : msg.document ? "doc" : "text",
            text,
            urlMedia: null
        }
        if (message.type != "text") {
            const file = msg.video || msg.audio || msg.document || msg.photo[0]
            const media = await socket.getFileLink(file.file_id)
            message.urlMedia = media
        }

        formatMessage = {
            name: chat.username || chat.title,
            id: chat.id,
            messages: [message],
            profile

        }
    }
    catch (err) {
        console.log(err)
    } finally {
        return formatMessage
    }
}