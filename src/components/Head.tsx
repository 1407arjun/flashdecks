import Head from 'next/head'

const PageHead = () => {
  const title = 'Page Title'
  const desc = 'Page Desc'
  const endpoint = 'https://example.com'
  const domain = 'example.com'
  const siteName = 'Page Name'
  const twitterHandle = ''

  return (
    <Head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <title>{title}</title>
      <meta name="description" content={desc} />
      <link rel="icon" href="/favicon.ico" />

      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={`${endpoint}/ogicon.png`} />
      <meta property="og:url" content={endpoint} />
      <meta property="og:site_name" content={siteName} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta property="twitter:domain" content={domain} />
      <meta property="twitter:url" content={endpoint} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={`${endpoint}/ogicon.png`} />
    </Head>
  )
}

export default PageHead
