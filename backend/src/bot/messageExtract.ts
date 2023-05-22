import TelegramBot from "node-telegram-bot-api";


export default async function extract(socket: TelegramBot, msg: TelegramBot.Message): Promise<MessagesTel> {
    let formatMessage
    try {

        const { text, chat, caption } = msg
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
        const isGroup = chat.type == 'group' || chat.type == 'channel'
        let profileUserGroup

        if (chat.type == 'group' || chat.type == 'channel') {
            let dataProfileGroup = (await socket.getUserProfilePhotos(msg.from.id))?.photos[0]
            if (dataProfileGroup) {

                profileUserGroup = await socket.getFileLink(dataProfileGroup[0].file_id)
            }

        }
        const message = {
            type: msg.photo ? "image" : msg.video ? "video" : msg.audio || msg.voice ? "audio" : msg.document ? "doc" : msg.sticker ? "sticker" : "text",
            text: text || caption,
            urlMedia: null,
            groupChatInfo: isGroup ? {
                name: msg.from.first_name,
                profile: profileUserGroup
            } : null

        }
        if (message.type != "text") {
            const file = msg.video || msg.audio || msg.voice || msg.sticker|| msg.document || msg.photo[msg.photo.length - 1]
            const media = await socket.getFileLink(file.file_id)
            message.urlMedia = media
        }



        formatMessage = {
            name: chat.username || chat.title,
            id: chat.id,
            isGroup,

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