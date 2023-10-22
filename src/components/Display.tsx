import { Heading, VStack, Text } from "@chakra-ui/react"

const Display = ({ heading, text }: { heading: string; text: string }) => {
    return (
        <VStack
            p={4}
            borderWidth={1}
            borderColor="gray"
            rounded="md"
            spacing={4}
            align="start">
            <Heading size="lg">{heading}:</Heading>
            <VStack align="start">
                {text.split("\r\n").map((a) => {
                    return <Text key={a}>{a}</Text>
                })}
            </VStack>
        </VStack>
    )
}

export default Display
