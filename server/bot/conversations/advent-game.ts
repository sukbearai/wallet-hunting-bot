import type { FFContext, FFConversation } from '../types'

interface Question {
  question: string
  answer: string
}

const INITIAL_ANSWER = 'Finanzfluss'
const GAME_START_MONTH = 11 // December (0-indexed)
const GAME_START_DAY = 1
const GAME_END_DAY = 24
const ANSWER_TIMEOUT_MS = 30 * 1000

const QUESTIONS: Question[] = [
  { question: 'Wie heißt das deutsche Parlament?', answer: 'Bundestag' },
  { question: 'Was ist der erste Tag des Jahres?', answer: 'Neujahr' },
  { question: 'Wann kommt der Osterhase?', answer: 'Ostern' },
  {
    question: 'Wo werden Weihnachtsplätzchen gebacken?',
    answer: 'Weihnachtsbäckerei',
  },
  { question: 'Wo kann man ETFs kaufen?', answer: 'Börse' },
  { question: 'Was ist das deutsche Wort für »wallet«?', answer: 'Geldbörse' },
  // TODO: New questions; just placeholders for now
  { question: 'Tag 7', answer: 'Antwort 7' },
  { question: 'Tag 8', answer: 'Antwort 8' },
  { question: 'Tag 9', answer: 'Antwort 9' },
  { question: 'Tag 10', answer: 'Antwort 10' },
  { question: 'Tag 11', answer: 'Antwort 11' },
  { question: 'Tag 12', answer: 'Antwort 12' },
  { question: 'Tag 13', answer: 'Antwort 13' },
  { question: 'Tag 14', answer: 'Antwort 14' },
  { question: 'Tag 15', answer: 'Antwort 15' },
  { question: 'Tag 16', answer: 'Antwort 16' },
  { question: 'Tag 17', answer: 'Antwort 17' },
  { question: 'Tag 18', answer: 'Antwort 18' },
  { question: 'Tag 19', answer: 'Antwort 19' },
  { question: 'Tag 20', answer: 'Antwort 20' },
  { question: 'Tag 21', answer: 'Antwort 21' },
  { question: 'Tag 22', answer: 'Antwort 22' },
  { question: 'Tag 23', answer: 'Antwort 23' },
  { question: 'Tag 24', answer: 'Antwort 24' },
]

async function adventGame(conversation: FFConversation, ctx: FFContext) {
  const currentDate = await conversation.external(() => new Date())
  const currentDay = currentDate.getDate()

  if (!canOpenCalendar(currentDate)) {
    await ctx.reply(
      '🎄 Der große Finanzfluss Adventskalender 2024 beginnt am 1. Dezember!',
    )
    return
  }

  if (!canOpenDoor(currentDate)) {
    await ctx.reply('🎄 Heute gibt es kein Türchen zum Öffnen.')
    return
  }

  if (hasAnsweredToday(conversation, currentDay)) {
    await ctx.reply(
      'Du hast die heutige Frage bereits beantwortet. Komm morgen wieder!',
    )
    return
  }

  const isFirstDay = currentDay === GAME_START_DAY
  if (isFirstDay) {
    await ctx.reply(
      `
🎄 Das ist der große Finanzfluss Adventskalender 2024!

Jeden Tag kannst du ein Türchen öffnen und eine Frage beantworten. Beantworte die Frage richtig und sammle Punkte. Am 24. Dezember gibt es eine besondere Überraschung!
      `.trim(),
    )
  }

  const todaysQuestion = QUESTIONS[currentDay - 1].question
  const expectedAnswer = isFirstDay
    ? INITIAL_ANSWER
    : QUESTIONS[currentDay - 2].answer

  await ctx.reply(todaysQuestion)

  const { msg } = await conversation.waitFor(':text', {
    maxMilliseconds: ANSWER_TIMEOUT_MS,
    async otherwise() {
      await ctx.deleteMessage()
      await ctx.reply(
        `Zeit abgelaufen. Die richtige Antwort war: ${expectedAnswer}. Versuche es morgen erneut!`,
      )
    },
  })

  if (!msg) return

  const isCorrect = isAnswerCorrect(msg.text, expectedAnswer)
  if (isCorrect) {
    conversation.session.adventScore++
    await ctx.reply('Das war richtig! 🎉')
  } else {
    await ctx.reply(
      `Das ist leider falsch. Die richtige Antwort war: ${expectedAnswer}`,
    )
  }

  markDayAsAnswered(conversation, currentDay)

  await ctx.reply(`Dein Punktestand: ${conversation.session.adventScore} 🙌`)
}

export default adventGame

function canOpenCalendar(date: Date) {
  // TODO: Revert
  if (false) return date.getMonth() === GAME_START_MONTH
  return true
}

function canOpenDoor(date: Date) {
  const day = date.getDate()
  return day >= GAME_START_DAY && day <= GAME_END_DAY
}

function hasAnsweredToday(conversation: FFConversation, day: number) {
  return conversation.session.answeredDays.includes(day)
}

function markDayAsAnswered(conversation: FFConversation, day: number) {
  conversation.session.answeredDays.push(day)
}

function isAnswerCorrect(userAnswer: string, expectedAnswer: string): boolean {
  return userAnswer.trim().toLowerCase() === expectedAnswer.trim().toLowerCase()
}
