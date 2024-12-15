import type { Conversation, ConversationFlavor } from '@grammyjs/conversations'
import type { Context, SessionFlavor } from 'grammy'

export interface SessionData {
  adventScore: number
  answeredDays: number[]
}

export type FFContext = Context &
  SessionFlavor<SessionData> &
  ConversationFlavor

export type FFConversation = Conversation<FFContext>
