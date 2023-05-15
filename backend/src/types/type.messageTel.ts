
type MessagesTel = {
    name: string,
    messages: {
        type: string,
        text?: string,
        urlMedia?: string,
    }[]
    profile: string,
    id: number
}
