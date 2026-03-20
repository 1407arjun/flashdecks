import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const data = {
  model: 'Qwen/Qwen2.5-VL-72B-Instruct',
  messages: [
    {
      role: 'system',
      content: `I want to create flashcards out of the questions and answers in this document. The document has questions and answers to those questions. Read through the document to identify how the answers are provided. Each question may or may not have options, and the options form a part of the question. Create an array of questions (and options if available) and answers, with each object in the following format { front: "question", back: "answer" }. In case a question has options, separate the question and each of the options with a newline (\\n) and include the option number if any along with the answer on the back. Return only the array of flashcards as a string.`
    }
  ],
  api_key: process.env.CHAT_API_KEY,
  course_name: 'Flashdecks',
  stream: false,
  temperature: 0.1,
  retrieval_only: false
}

const getFormattedContent = (data: Record<string, unknown>) => {
  const { type = '', mimeType = '', content = '' } = data || {}

  switch (type) {
    case 'image':
      return {
        type: 'image_url',
        image_url: { url: content }
      }
    case 'file':
      return {
        type: 'file',
        fileUrl: content,
        fileType: mimeType
      }
    default:
      return null
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).end()

  const { type = '', mimeType = '', content = '' } = req.body

  if (!type || !mimeType || !content) return res.status(400).end()

  const formattedContent = getFormattedContent(req.body)

  if (!formattedContent) return res.status(400).end()

  const payload = {
    ...data,
    messages: [
      ...data.messages,
      {
        role: 'user',
        content: [formattedContent]
      }
    ]
  }

  try {
    const { data: { message: response = '' } = {} } = await axios.post(
      process.env.CHAT_URL!,
      payload
    )
    try {
      const jsonResponse = JSON.parse(response)
      if (jsonResponse && Array.isArray(jsonResponse))
        return res.status(200).send(response)
      else return res.status(500).end()
    } catch (e) {
      console.log(e)
      return res.status(500).end()
    }
  } catch (e) {
    console.log(e)
    return res.status(424).send(e)
  }
}
