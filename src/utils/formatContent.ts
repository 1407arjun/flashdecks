import Deck from '@/types/Deck'

const formatContent = (content: string, type: 'csv' | 'json') => {
  if (content.length === 0) return []

  let formattedContent: Deck[] = []

  switch (type) {
    case 'csv':
      const csvData = content.split('\r').map((s) => s.split(','))
      const indexOfFront = csvData[0]
        .map((s) => s.toLowerCase().trim())
        .indexOf('front')
      const indexofBack = csvData[0]
        .map((s) => s.toLowerCase().trim())
        .indexOf('back')

      if (indexOfFront === -1 || indexofBack === -1) throw 'Invalid formatting'
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
      const jsonData = JSON.parse(content)
      for (var i = 1; i < jsonData.length; i++) {
        const front = (jsonData[i].front || '').trim()
        const back = (jsonData[i].back || '').trim()

        if (front && front.length > 0 && back && back.length > 0)
          formattedContent.push({ front, back })
      }
      return formattedContent
    default:
      throw new Error('Invalid file type', { cause: 'format' })
  }
}

export default formatContent
