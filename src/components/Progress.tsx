import ProgressType from '@/types/Progress'
import Status from '@/types/Status'
import { VStack, Text, Progress } from '@chakra-ui/react'

const typeset: { [key: string]: string } = {
  [Status.MASTERED]: 'have mastered',
  [Status.REVIEW]: 'are reviewing',
  [Status.WRONG]: 'are learning'
}

const colorScheme: { [key: string]: string } = {
  [Status.MASTERED]: 'green',
  [Status.REVIEW]: 'orange',
  [Status.WRONG]: 'red'
}

const ProgressBar = ({
  type,
  count,
  total
}: {
  type: Status
  count: number
  total: number
}) => {
  return (
    <VStack w="100%" align="start">
      <Text>
        You {typeset[type]} {count} out of {total} cards
      </Text>
      <Progress
        w="100%"
        value={(count * 100) / total}
        colorScheme={colorScheme[type]}
        height={8}
      />
    </VStack>
  )
}

const ProgressBars = ({ progress }: { progress: ProgressType }) => {
  return (
    <VStack mt={8} align="start" spacing={4}>
      <ProgressBar
        type={Status.MASTERED}
        count={progress.mastered}
        total={progress.total}
      />
      <ProgressBar
        type={Status.REVIEW}
        count={progress.reviewing}
        total={progress.total}
      />
      <ProgressBar
        type={Status.WRONG}
        count={progress.wrong}
        total={progress.total}
      />
    </VStack>
  )
}

export default ProgressBars
