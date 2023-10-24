import {
  Heading,
  VStack,
  HStack,
  Spacer,
  Text,
  useToast,
  Container,
  Alert,
  Center,
  Stack,
  Button
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
  const [showFront, setShowFront] = useState(false)
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
    const cards = JSON.parse(localStorage.getItem('deck') || '[]')
    if (cards && cards.length > 0) {
      setDeck(
        new Deck({
          id: 1,
          cards: createCards(cards)
        })
      )

      toast({
        title: 'Success',
        description: "We've imported your deck successfully",
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    }
  }, [])

  useEffect(() => {
    if (!deck) {
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

      if (data.length > 0) {
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

        toast({
          title: 'Success',
          description: "We've imported your deck successfully",
          status: 'success',
          duration: 5000,
          isClosable: true
        })
      }
    }
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
      localStorage.setItem('deck', JSON.stringify(cards))
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

  //@ts-ignore
  if (deck && deck.dump().cards.length > 0)
    return (
      <VStack p={4} spacing={8} w="100%">
        <Head />
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          justifyContent="center"
          alignItems="center"
          w="100%">
          <Heading textAlign={{ base: 'center', sm: 'left' }} size="md">
            FlashDecks
          </Heading>
          <Spacer />
          <HStack>
            <Button
              onClick={() => {
                setDeck(
                  (prev) =>
                    prev &&
                    new Deck({
                      id: 1,
                      cards: createCards(
                        //@ts-ignore
                        prev.dump().cards.map(({ front, back }) => {
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
                toast({
                  title: 'Cleared progress',
                  description: "We've resetted your progress successfully",
                  status: 'info',
                  duration: 5000,
                  isClosable: true
                })
              }}>
              Reset progress
            </Button>
            <Button
              onClick={() => {
                localStorage.clear()
                setData([])
                setDeck(null)
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
                toast({
                  title: 'Cleared',
                  description: "We've cleared your deck successfully",
                  status: 'info',
                  duration: 5000,
                  isClosable: true
                })
              }}>
              Clear deck
            </Button>
            <ColorToggle />
          </HStack>
        </Stack>

        <Container maxW="2xl">
          <Text textAlign={{ base: 'center', sm: 'right' }} mb={4}>
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
            showFront={showFront}
            setShowFront={setShowFront}
          />

          <Progress progress={progress} />
        </Container>
      </VStack>
    )

  return (
    <Center minH="100vh">
      <VStack p={4} spacing={8} w="inherit">
        <Head />
        <VStack justifyContent="center" alignItems="center" w="100%">
          <HStack>
            <Heading textAlign="center" size="xl">
              FlashDecks
            </Heading>
            <ColorToggle />
          </HStack>
          <Spacer />
          <UploadButton setData={setData} />
        </VStack>
        <Text fontSize="lg" fontWeight="medium" w="100%" textAlign="center">
          [&#123; &ldquo;front&rdquo;: &ldquo;Hello&rdquo;, &ldquo;back&rdquo;:
          &ldquo;World&rdquo; &#125;]
        </Text>
      </VStack>
    </Center>
  )
}

export default Home
