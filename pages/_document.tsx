import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Elena Bushell - Personal Website"
          />
          <meta property="og:site_name" content="elenabushell.com" />
          <meta
            property="og:description"
            content="Elena Bushell - Personal Website"
          />
          <meta property="og:title" content="Elena Bushell" />
        </Head>
        <body className="bg-black antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
