import { Center, Heading } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from '@/components/Head'

const Home: NextPage = () => {
  return (
    <Center minH="100vh">
      <Head />
      <Heading>Welcome to Next.js</Heading>
    </Center>
  )
}

export default Home
