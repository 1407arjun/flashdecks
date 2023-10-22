import Deck from '@/types/Deck'
import formatContent from '@/utils/formatContent'
import { AttachmentIcon } from '@chakra-ui/icons'
import { Box, Button, useToast } from '@chakra-ui/react'
import { useRef } from 'react'

const UploadButton = ({
  setData
}: {
  setData: React.Dispatch<React.SetStateAction<Deck[]>>
}) => {
  let fileRef = useRef<HTMLInputElement>()
  const toast = useToast()

  const readFile = (event: React.FormEvent<HTMLInputElement>) => {
    const fileReader = new FileReader()
    //@ts-ignore
    const { files } = event.target

    fileReader.readAsText(files[0], 'UTF-8')
    fileReader.onload = (e) => {
      try {
        const content = e.target!.result?.toString().replace(/\r\n/g, '\n')
        if (content) {
          const name = files[0].name.split('.')
          const ext = name[name.length - 1].toLowerCase()
          const data = formatContent(content, ext)

          if (data.length === 0)
            throw new Error('No data found', { cause: 'format' })

          setData(data)
        }
      } catch (e) {
        setData([])
        if (e instanceof Error)
          toast({
            title: e.cause === 'format' ? e.message : 'Invalid formatting',
            description: 'We were unable to import your deck',
            status: 'error',
            duration: 5000,
            isClosable: true
          })
      }
    }
  }

  return (
    <Box alignSelf="center">
      <input
        //@ts-ignore
        ref={fileRef}
        type="file"
        accept=".csv,.json"
        onChange={readFile}
        style={{ display: 'none' }}></input>
      <Button
        type="submit"
        onClick={() => {
          fileRef.current!.click()
        }}
        leftIcon={<AttachmentIcon />}>
        Upload CSV or JSON file
      </Button>
    </Box>
  )
}

export default UploadButton
