import {
  Center,
  Heading,
  VStack,
  HStack,
  Spacer,
  Box,
  Text,
  Grid,
  Divider,
  useToast
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import ColorToggle from '../components/ColorToggle'
import Display from '../components/Display'
import Head from '../components/Head'
import UploadButton from '../components/UploadButton'
import DeckType from '@/types/Deck'

const Home: NextPage = () => {
  const toast = useToast()
  const [deck, setDeck] = useState<DeckType[]>([])

  useEffect(() => {
    if (deck.length > 0)
      toast({
        title: 'Success',
        description: "We've imported your deck successfully",
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    else
      toast({
        title: 'No data found',
        description: 'We were unable to import your deck',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
  }, [deck])

  return (
    <Center minH="100vh">
      <VStack p={8} spacing={8} w={deck.length === 0 ? 'inherit' : '100%'}>
        <Head />
        <HStack justifyContent="center" alignItems="center" w="100%">
          <Heading>Custom Spaced Repetition</Heading>
          <Spacer />
          {deck.length !== 0 && <UploadButton setDeck={setDeck} />}
          <ColorToggle />
        </HStack>
        {deck.length === 0 && <UploadButton setDeck={setDeck} />}
      </VStack>
    </Center>
  )
}

export default Home
