import {
  Heading,
  VStack,
  HStack,
  Spacer,
  Text,
  useToast,
  Container,
  Alert
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import ColorToggle from '../components/ColorToggle'
import Head from '../components/Head'
import UploadButton from '../components/UploadButton'
import DeckType from '@/types/Deck'
import CardType from '@/types/Card'
import ProgressType from '@/types/Progress'
import Status from '@/types/Status'
import { RepeatIcon, StarIcon } from '@chakra-ui/icons'
import Flashcard from '@/components/Flashcard'
import Progress from '@/components/Progress'

//@ts-ignore
import { Card, Deck, createCards, statEn } from 'lt-spaced-repetition-js'

const Home: NextPage = () => {
  const toast = useToast()
  const [deck, setDeck] = useState(null)
  const [data, setData] = useState<DeckType[]>([])
  const [card, setCard] = useState<CardType>({
    front: '',
    back: '',
    status: ''
  })
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState<ProgressType>({
    [Status.MASTERED]: 0,
    [Status.REVIEW]: 0,
    [Status.WRONG]: 0,
    total: 0
  })

  useEffect(() => {
    setProgress({
      [Status.MASTERED]: 0,
      [Status.REVIEW]: 0,
      [Status.WRONG]: 0,
      total: 0
    })
    setVisible(false)
    setCard({
      front: '',
      back: '',
      status: ''
    })

    setDeck(
      new Deck({
        id: 1,
        cards: createCards(
          data.map(({ front, back }) => {
            return {
              front,
              back,
              reviewCount: 0,
              status: statEn.NEW,
              bucket: 0
            }
          })
        )
      })
    )

    if (data.length > 0)
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
  }, [data])

  useEffect(() => {
    if (deck) {
      setCard(
        //@ts-ignore
        deck.pick() || {
          front: '',
          back: '',
          status: ''
        }
      )
    }
  }, [deck])

  useEffect(() => {
    //@ts-ignore
    if (deck && deck.dump() && deck.dump().cards) {
      //@ts-ignore
      const cards = deck.dump().cards
      const total = cards.length
      let mastered = 0,
        reviewing = 0,
        wrong = 0
      cards.forEach((c: { status: Status }) => {
        if (c.status === Status.MASTERED) mastered++
        else if (c.status === Status.REVIEW) reviewing++
        else if (c.status === Status.WRONG) wrong++
      })
      setProgress({
        mastered,
        reviewing,
        wrong,
        total
      })
    }
  }, [card])

  const handleRight = () => {
    setVisible(false)
    //@ts-ignore
    card.update(1)
    setCard(() => {
      //@ts-ignore
      const next = deck.pick()
      return next
    })
  }

  const handleWrong = () => {
    setVisible(false)
    //@ts-ignore
    card.update(0)
    setCard(() => {
      //@ts-ignore
      const next = deck.pick()
      return next
    })
  }

  const handleVisible = () => {
    setVisible(true)
  }

  return (
    <VStack p={4} spacing={8} w={data.length === 0 ? 'inherit' : '100%'}>
      <Head />
      <HStack justifyContent="center" alignItems="center" w="100%">
        <Heading size={data.length === 0 ? 'xl' : 'md'}>
          Custom Spaced Repetition
        </Heading>
        <Spacer />
        {data.length !== 0 && <UploadButton setData={setData} />}
        <ColorToggle />
      </HStack>
      {data.length === 0 && <UploadButton setData={setData} />}
      {deck && data.length > 0 && (
        <Container maxW="2xl">
          <Text textAlign="end" mb={4}>
            <RepeatIcon /> Cards you don&apos;t know will reappear later
          </Text>
          {progress.mastered === progress.total && (
            <Alert status="success" variant="solid" rounded="md" mb={4}>
              <HStack w="100%">
                <Text>
                  <StarIcon /> &nbsp; You have mastered all the cards in this
                  deck!
                </Text>
                {/* <Spacer />
                <CloseButton onClick={onClose} /> */}
              </HStack>
            </Alert>
          )}
          <Flashcard
            card={card}
            handleRight={handleRight}
            handleWrong={handleWrong}
            visible={visible}
            handleVisible={handleVisible}
          />

          <Progress progress={progress} />
        </Container>
      )}
    </VStack>
  )
}

export default Home
