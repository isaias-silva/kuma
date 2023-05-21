
type MessagesTel = {
    name: string,
    isGroup: boolean
    messages: {
        groupChatInfo?: {
            name: string,
            profile: string
        },
        type: string,
        text?: string,
        urlMedia?: string,
    }[]
    profile: string,
    id: number
}
