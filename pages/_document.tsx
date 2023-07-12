import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
		<Html lang="en">
			<Head>
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
				<link rel="manifest" href="/site.webmanifest"/>
				<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#345bbf"/>
				<meta name="msapplication-TileColor" content="#345bbf"/>
				<meta name="theme-color" content="#ffffff"/>
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
