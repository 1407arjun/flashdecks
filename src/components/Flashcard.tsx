import CardType from '@/types/Card'
import Status from '@/types/Status'
import { QuestionIcon } from '@chakra-ui/icons'
import {
  Box,
  VStack,
  Text,
  Button,
  Card,
  Heading,
  HStack,
  Spacer,
  Tooltip,
  IconButton
} from '@chakra-ui/react'
import { useState } from 'react'

const colorScheme: { [key: string]: string } = {
  [Status.NEW]: 'gray',
  [Status.MASTERED]: 'green',
  [Status.REVIEW]: 'orange',
  [Status.WRONG]: 'red'
}

const Flashcard = ({
  card,
  handleRight,
  handleWrong,
  visible,
  handleVisible,
  showFront,
  setShowFront
}: {
  card: CardType
  handleRight: () => void
  handleWrong: () => void
  visible: boolean
  handleVisible: () => void
  showFront: boolean
  setShowFront: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <Card as={VStack} spacing={0}>
      <VStack roundedTop="md" w="full" px={4} pt={4} pb={8}>
        <HStack w="full">
          {visible && (
            <Tooltip label="Toggle card front">
              <IconButton
                onClick={() => setShowFront((prev) => !prev)}
                icon={<QuestionIcon />}
                fontSize="xl"
                aria-label="Toggle card front"
                size="md"
                variant="ghost"
              />
            </Tooltip>
          )}
          <Spacer />
          <Button
            as={Text}
            px={4}
            py={2}
            size="sm"
            fontWeight="semibold"
            colorScheme={colorScheme[card.status]}>
            {card.status.toUpperCase()}
          </Button>
        </HStack>
        {!visible &&
          (card.front.length > 30
            ? card.front.split('\n').map((c) => (
                <Text
                  key={c}
                  fontSize="lg"
                  fontWeight="semibold"
                  w="100%"
                  textAlign={
                    card.front.split('\n').length > 1 ? 'left' : 'center'
                  }>
                  {c.trim()}
                </Text>
              ))
            : card.front.split('\n').map((c) => (
                <Heading key={c} size="lg" textAlign="center">
                  {c.trim()}
                </Heading>
              )))}
        {visible &&
          showFront &&
          card.front.split('\n').map((c) => (
            <Text
              key={c}
              fontSize="lg"
              fontWeight="semibold"
              w="100%"
              textAlign={card.front.split('\n').length > 1 ? 'left' : 'center'}>
              {c.trim()}
            </Text>
          ))}
        {visible &&
          (card.back.length > 50
            ? card.back.split('\n').map((c) => (
                <Text
                  key={c}
                  fontSize="lg"
                  fontWeight="semibold"
                  w="100%"
                  textAlign={
                    card.back.split('\n').length > 1 ? 'left' : 'center'
                  }>
                  {c.trim()}
                </Text>
              ))
            : card.back.split('\n').map((c) => (
                <Heading key={c} size="lg" textAlign="center">
                  {c.trim()}
                </Heading>
              )))}
      </VStack>
      {!visible && (
        <Button
          roundedTop="none"
          roundedBottom="md"
          w="full"
          colorScheme="gray"
          onClick={handleVisible}>
          Flip card
        </Button>
      )}
      {visible && (
        <>
          <Button
            rounded="none"
            w="full"
            colorScheme="green"
            onClick={handleRight}>
            I knew it
          </Button>
          <Button
            roundedTop="none"
            roundedBottom="md"
            w="full"
            colorScheme="red"
            onClick={handleWrong}>
            I didn&apos;t know it
          </Button>
        </>
      )}
    </Card>
  )
}

export default Flashcard
