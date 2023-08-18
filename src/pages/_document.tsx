import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <body className="min-h-[100vh] flex flex-1 flex-col">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}