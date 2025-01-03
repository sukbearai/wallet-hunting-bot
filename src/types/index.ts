import type { Context, Scenes } from 'telegraf'

export interface Command {
  name: string
  description: string
  execute: (args: string[]) => void
}

export interface Message {
  userId: string
  content: string
  timestamp: Date
}

interface MySceneSession extends Scenes.SceneSession<Scenes.SceneSessionData> {
  twitterId?: string
}

export interface MyContext extends Context {
  session: MySceneSession
  scene: Scenes.SceneContextScene<MyContext>
}

interface Usage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

interface GptMessage {
  role: string
  content: string
}

interface Choice {
  message: GptMessage
  finish_reason: string
  index: number
}

export interface APIResponse {
  id: string
  model: string
  usage: Usage
  choices: Choice[]
}
