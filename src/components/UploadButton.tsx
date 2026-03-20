import Deck from '@/types/Deck'
import formatContent from '@/utils/formatContent'
import { AttachmentIcon } from '@chakra-ui/icons'
import { Spinner, Button, Text, useToast, VStack } from '@chakra-ui/react'
import { useRef, useState } from 'react'

const UploadButton = ({
  setData
}: {
  setData: React.Dispatch<React.SetStateAction<Deck[]>>
}) => {
  let fileRef = useRef<HTMLInputElement>()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const readFile = (event: React.FormEvent<HTMLInputElement>) => {
    setIsLoading(true)
    const fileReader = new FileReader()
    const { files } = event.target as HTMLInputElement

    if (!files || !files.length) return

    const name = files[0].name.split('.')
    const ext = name[name.length - 1].toLowerCase()

    const isReadRaw = ext === 'json' || ext === 'csv'

    try {
      if (!(files && Array.isArray(Array.from(files)) && files.length)) {
        setIsLoading(false)
        return
      }

      if (isReadRaw) {
        fileReader.readAsText(files[0], 'UTF-8')
      } else {
        fileReader.readAsArrayBuffer(files[0])
      }

      fileReader.onload = async (e) => {
        try {
          const content = e.target!.result
          if (content) {
            const data = await formatContent(
              isReadRaw
                ? content.toString().replace(/\r\n/g, '\n')
                : new Uint8Array(content as ArrayBuffer),
              ext
            )

            if (data.length === 0)
              throw new Error('No data found', { cause: 'custom' })

            setData(data)
          }
        } catch (e) {
          setData([])
          if (e instanceof Error)
            toast({
              title: e.cause === 'custom' ? e.message : 'Invalid formatting',
              description: 'We were unable to import your deck',
              status: 'error',
              duration: 5000,
              isClosable: true
            })
        } finally {
          setIsLoading(false)
        }
      }
    } catch (e) {
      setIsLoading(false)
    }
  }

  return (
    <VStack alignSelf="center" gap={4}>
      <input
        //@ts-ignore
        ref={fileRef}
        type="file"
        accept=".csv,.json,.png,.jpeg,.jpg" // Will add PDF support later
        onChange={readFile}
        style={{ display: 'none' }}></input>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Button
            type="submit"
            onClick={() => {
              fileRef.current!.click()
            }}
            leftIcon={<AttachmentIcon />}>
            Upload a file
          </Button>
          <Text
            fontSize="xs"
            textAlign={{ base: 'center', sm: 'right' }}
            color="gray">
            Upload any <b>image file</b> containing questions and answers or
            upload the legacy <b>CSV or JSON</b> formats
          </Text>
        </>
      )}
    </VStack>
  )
}

export default UploadButton
