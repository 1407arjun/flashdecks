import Head from 'next/head'

const PageHead = () => {
  const title = 'FlashDecks'
  const desc = 'Learn by spaced repetiton on your own decks.'
  const endpoint = 'https://flashdecks.arjuns.co'
  const domain = 'arjuns.co'
  const siteName = 'FlashDecks'

  return (
    <Head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <title>{title}</title>
      <meta name="description" content={desc} />
      <link rel="icon" href="/favicon.png" />

      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={`${endpoint}/ogicon.png`} />
      <meta property="og:url" content={endpoint} />
      <meta property="og:site_name" content={siteName} />

      <meta name="twitter:card" content="summary" />
      <meta property="twitter:domain" content={domain} />
      <meta property="twitter:url" content={endpoint} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={`${endpoint}/ogicon.png`} />
    </Head>
  )
}

export default PageHead
