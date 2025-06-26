
export class TelegramAPI {
  private botToken: string

  constructor(botToken: string) {
    this.botToken = botToken
  }

  async sendMessage(chatId: number, text: string, replyMarkup?: any): Promise<any> {
    console.log('Sending message:', text)
    
    const payload = {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      reply_markup: replyMarkup
    }

    const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const result = await response.json()
    console.log('Telegram API response:', result)
    return result
  }

  async getFileUrl(fileId: string): Promise<string | null> {
    try {
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/getFile?file_id=${fileId}`)
      const result = await response.json()
      
      if (result.ok && result.result.file_path) {
        return `https://api.telegram.org/file/bot${this.botToken}/${result.result.file_path}`
      }
      return null
    } catch (error) {
      console.error('Error getting file URL:', error)
      return null
    }
  }
}
