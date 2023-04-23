export default interface TelBot {
    _id: string;
    profile: string,
    name: string,
    telegram_name: string,
    ownerId: string
    apiKey: string
    messages: [],
    comands: { command: string, description: string }[]
    bot_id: number,
    description: string
}