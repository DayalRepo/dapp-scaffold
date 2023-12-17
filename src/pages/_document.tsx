import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'
import { link } from 'fs';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }

  render() {
    return (
      <Html>
        <head>
  <meta charset="utf-8"/>
  <link rel="icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="theme-color" content="#000000"/>
  <meta name="description" content="Web site created using create-react-app"/>
  <link rel="apple-touch-icon" href="/logo.jpg"/>
  <link rel="manifest" href="/manifest.json"/>
  <title>AMIGOS ODYSSEY</title>
  <link href="/static/css/main.c5685a7e.css" rel="stylesheet">
  <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
  <script defer="defer" src="/static/js/main.0108abfd.js"></script>
</head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
