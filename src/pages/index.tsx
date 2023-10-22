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
import Head from '../components/Head'
import UploadButton from '../components/UploadButton'
import DeckType from '@/types/Deck'
import CardType from '@/types/Card'
import ProgressType from '@/types/Progress'
import Status from '@/types/Status'

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
    [Status.NEW]: 0,
    [Status.MASTERED]: 0,
    [Status.REVIEW]: 0,
    [Status.WRONG]: 0
  })

  useEffect(() => {
    setProgress({
      [Status.NEW]: 0,
      [Status.MASTERED]: 0,
      [Status.REVIEW]: 0,
      [Status.WRONG]: 0
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
        deck.pick() || {
          front: '',
          back: '',
          status: ''
        }
      )
    }
  }, [deck])

  useEffect(() => {
    if (deck && deck.dump() && deck.dump().cards) {
      const cards = deck.dump().cards
      let mastered = 0,
        reviewing = 0,
        wrong = 0
      cards.forEach((c: { status: Status }) => {
        if (c.status === Status.MASTERED) mastered++
        else if (c.status === Status.REVIEW) reviewing++
        else if (c.status === Status.WRONG) wrong++
      })
      // setProgress([mastered, reviewing, wrong, cards.length])
    }
  }, [card])

  return (
    <Center minH="100vh">
      <VStack p={8} spacing={8} w={data.length === 0 ? 'inherit' : '100%'}>
        <Head />
        <HStack justifyContent="center" alignItems="center" w="100%">
          <Heading>Custom Spaced Repetition</Heading>
          <Spacer />
          {data.length !== 0 && <UploadButton setData={setData} />}
          <ColorToggle />
        </HStack>
        {data.length === 0 && <UploadButton setData={setData} />}
        {deck && data.length > 0 && (
          <div
            id="main"
            style={{
              color: 'black',
              minHeight: '100vh',
              background: 'white',
              textAlign: 'center'
            }}>
            <p
              style={{
                marginBottom: '1rem',
                fontSize: '1.25rem',
                fontWeight: 500,
                color:
                  card.status === 'mastered'
                    ? 'green'
                    : card.status === 'reviewing'
                    ? 'yellow'
                    : card.status === 'wrong'
                    ? 'red'
                    : 'black'
              }}>
              {card.status}
            </p>
            <h1 style={{ marginBottom: '2rem', fontSize: '3rem' }}>
              {card.front}
            </h1>
            {visible && (
              <p style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>
                {card.back}
              </p>
            )}
            {!visible && (
              <button
                style={{
                  width: '100%',
                  background: 'white',
                  color: 'black',
                  fontWeight: 600,
                  textAlign: 'center',
                  padding: '1rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
                onClick={() => setVisible(true)}>
                Show meaning
              </button>
            )}
            {visible && (
              <div>
                <button
                  style={{
                    width: '100%',
                    background: 'green',
                    color: 'white',
                    fontWeight: 600,
                    textAlign: 'center',
                    padding: '1rem',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setVisible(false)
                    //@ts-ignore
                    card.update(1)
                    setCard(() => {
                      const next = deck.pick()
                      // localStorage.setItem("progress", JSON.stringify(deck.dump().cards));
                      return next
                    })
                  }}>
                  I knew the meaning
                </button>
                <button
                  style={{
                    width: '100%',
                    background: 'red',
                    color: 'white',
                    fontWeight: 600,
                    textAlign: 'center',
                    padding: '1rem',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setVisible(false)
                    //@ts-ignore
                    card.update(0)
                    setCard(() => {
                      const next = deck.pick()
                      // localStorage.setItem("progress", JSON.stringify(deck.dump().cards));
                      return next
                    })
                  }}>
                  I didn&apos;t know the meaning
                </button>
              </div>
            )}
            {!visible && (
              <button
                style={{
                  width: '100%',
                  background: 'white',
                  marginTop: '1rem',
                  color: 'black',
                  fontWeight: 600,
                  textAlign: 'center',
                  padding: '1rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  const data =
                    'data:text/json;charset=utf-8,' +
                    encodeURIComponent(JSON.stringify(deck.dump().cards))
                  const a = document.createElement('a')
                  a.setAttribute('href', data)
                  a.setAttribute('download', 'progress.json')
                  a.click()
                }}>
                Download progress
              </button>
            )}
            {/* <Progress progress={progress} /> */}
          </div>
        )}
      </VStack>
    </Center>
  )
}

export default Home
