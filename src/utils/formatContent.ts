import Deck from '@/types/Deck'
import axios from 'axios'

const callLLM = async (content: string, ext: string): Promise<Deck[]> => {
  let mimeType = ''
  let type = ''

  switch (ext) {
    case 'png':
      type = 'image'
      mimeType = 'image/png'
      break
    case 'jpg':
    case 'jpeg':
      type = 'image'
      mimeType = 'image/jpeg'
      break
    case 'pdf':
      type = 'file'
      mimeType = 'application/pdf'
      break
    default:
      throw new Error('Invalid file type', { cause: 'custom' })
  }

  try {
    const { data: response = [] } = await axios.post('/api/chat', {
      type,
      content,
      mimeType
    })
    return response
  } catch (e) {
    throw new Error('Failed to parse file using LLM', { cause: 'custom' })
  }
}

const formatContent = async (
  content: string | Uint8Array<ArrayBuffer>,
  ext: string
) => {
  let formattedContent: Deck[] = []

  switch (ext) {
    case 'csv':
      const csvData = (content as string).split('\r').map((s) => s.split(','))
      const indexOfFront = csvData[0]
        .map((s) => s.toLowerCase().trim())
        .indexOf('front')
      const indexofBack = csvData[0]
        .map((s) => s.toLowerCase().trim())
        .indexOf('back')

      if (indexOfFront === -1 || indexofBack === -1)
        throw new Error('Invalid formatting', { cause: 'custom' })
      else {
        for (var i = 1; i < csvData.length; i++) {
          const front = (csvData[i][indexOfFront] || '').trim()
          const back = (csvData[i][indexofBack] || '').trim()

          if (front.length > 0 && back.length > 0)
            formattedContent.push({ front, back })
        }
      }
      return formattedContent
    case 'json':
      const jsonData = JSON.parse(content as string)
      for (var i = 1; i < jsonData.length; i++) {
        const front = (jsonData[i].front || '').trim()
        const back = (jsonData[i].back || '').trim()

        if (front && front.length > 0 && back && back.length > 0)
          formattedContent.push({ front, back })
      }
      return formattedContent
    case 'pdf':
    case 'png':
    case 'jpeg':
    case 'jpg':
      return await callLLM(
        btoa(
          (content as Uint8Array<ArrayBuffer>).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        ),
        ext
      )
    default:
      throw new Error('Invalid file type', { cause: 'custom' })
  }
}

export default formatContent
