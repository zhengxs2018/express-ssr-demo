import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <link type="text/css" rel="stylesheet" href="./fonts.css" />
          <link type="text/css" rel="stylesheet" href="node_modules/@zoomus/websdk/dist/css/bootstrap.css" />
          <link type="text/css" rel="stylesheet" href="node_modules/@zoomus/websdk/dist/css/react-select.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
