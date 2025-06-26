
export interface TelegramUpdate {
  update_id: number
  message?: {
    message_id: number
    from: {
      id: number
      first_name: string
      username?: string
    }
    chat: {
      id: number
      type: string
    }
    text?: string
    photo?: Array<{
      file_id: string
      file_unique_id: string
      width: number
      height: number
      file_size?: number
    }>
    location?: {
      latitude: number
      longitude: number
    }
  }
}

export interface TelegramApiResponse {
  ok: boolean
  result?: any
  error_code?: number
  description?: string
}
