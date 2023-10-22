import CardType from '@/types/Card'
import Status from '@/types/Status'
import { Box, VStack, Text, Button, Card, Heading } from '@chakra-ui/react'

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
  handleVisible
}: {
  card: CardType
  handleRight: () => void
  handleWrong: () => void
  visible: boolean
  handleVisible: () => void
}) => {
  return (
    <Card as={VStack} spacing={0}>
      <VStack roundedTop="md" w="full" px={4} pt={4} pb={8}>
        <Box w="full" textAlign="end">
          <Button
            as={Text}
            px={4}
            py={2}
            size="sm"
            fontWeight="semibold"
            colorScheme={colorScheme[card.status]}>
            {card.status.toUpperCase()}
          </Button>
        </Box>
        <Heading size={card.front.length > 20 ? 'md' : 'lg'}>
          {card.front}
        </Heading>
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
