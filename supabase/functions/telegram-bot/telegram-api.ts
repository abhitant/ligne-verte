
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

  async answerCallbackQuery(callbackQueryId: string, text?: string): Promise<any> {
    const payload = {
      callback_query_id: callbackQueryId,
      text: text || ''
    }

    const response = await fetch(`https://api.telegram.org/bot${this.botToken}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const result = await response.json()
    console.log('Callback query response:', result)
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

  async setBotProfilePhoto(photoUrl: string): Promise<any> {
    try {
      // Télécharger l'image depuis l'URL
      const imageResponse = await fetch(photoUrl)
      const imageBlob = await imageResponse.blob()
      
      // Créer un FormData pour l'upload
      const formData = new FormData()
      formData.append('photo', imageBlob, 'profile.jpg')

      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/setMyProfilePhoto`, {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      console.log('Profile photo set result:', result)
      return result
    } catch (error) {
      console.error('Error setting bot profile photo:', error)
      return null
    }
  }

  async setBotName(name: string): Promise<any> {
    try {
      const payload = {
        name: name
      }

      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/setMyName`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      console.log('Bot name set result:', result)
      return result
    } catch (error) {
      console.error('Error setting bot name:', error)
      return null
    }
  }

  async setBotDescription(description: string): Promise<any> {
    try {
      const payload = {
        description: description
      }

      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/setMyDescription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      console.log('Bot description set result:', result)
      return result
    } catch (error) {
      console.error('Error setting bot description:', error)
      return null
    }
  }
}
