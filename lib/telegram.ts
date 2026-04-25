export async function sendTelegramMessage(message: string) {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!telegramBotToken) {
    throw new Error("TELEGRAM_BOT_TOKEN is not defined")
  }

  if (!chatId) {
    throw new Error("TELEGRAM_CHAT_ID is not defined")
  }

  const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Telegram API error: ${errorData.description}`)
  }

  return await response.json()
}
