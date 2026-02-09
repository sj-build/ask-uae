# Telegram Bot Setup Guide

## 1. Create Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow prompts to set bot name and username
4. Copy the **Bot Token** (format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

## 2. Configure Environment Variables

Add to `.env.local`:

```bash
# Telegram Bot
TELEGRAM_BOT_TOKEN=your-bot-token-here
TELEGRAM_WEBHOOK_SECRET=your-random-secret-here  # Generate with: openssl rand -hex 32
TELEGRAM_ALLOWED_CHAT_IDS=123456789,987654321    # Optional: comma-separated chat IDs to allow
```

## 3. Set Webhook URL

After deploying, set the webhook URL:

```bash
# Replace with your actual values
BOT_TOKEN="your-bot-token"
WEBHOOK_URL="https://your-domain.com/api/telegram/webhook"
WEBHOOK_SECRET="your-webhook-secret"

curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{
    \"url\": \"${WEBHOOK_URL}\",
    \"secret_token\": \"${WEBHOOK_SECRET}\",
    \"allowed_updates\": [\"message\", \"callback_query\"]
  }"
```

## 4. Verify Webhook

```bash
curl "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo"
```

## 5. Test the Bot

1. Open your bot in Telegram (search by username)
2. Send `/start` to begin
3. Ask any UAE-related question

## Bot Commands

| Command | Description |
|---------|-------------|
| `/start` | Welcome message |
| `/help` | Show help |
| `/clear` | Clear conversation history |
| `/ko` | Set language to Korean |
| `/en` | Set language to English |

## Rate Limiting

- 10 requests per minute per chat
- Configurable in `src/lib/telegram/session.ts`

## Restricting Access

To restrict bot access to specific users/groups:
1. Get chat IDs by sending a message to the bot and checking logs
2. Add IDs to `TELEGRAM_ALLOWED_CHAT_IDS` in `.env.local`

## Troubleshooting

### Webhook not receiving updates
- Verify HTTPS is working on your domain
- Check webhook secret matches
- Run `getWebhookInfo` to see last error

### Bot not responding
- Check server logs for errors
- Verify `ANTHROPIC_API_KEY` is set
- Ensure Supabase connection is working

## Local Development

For local testing, use ngrok:

```bash
ngrok http 3000
# Then set webhook to ngrok URL
```
