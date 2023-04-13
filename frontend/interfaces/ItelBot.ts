export default interface TelBot {
    _id: string;
    profile: string,
    name: string,
    telegram_name: string,
    ownerId: string
    apiKey: string
    messages: [],
    bot_id: number
}