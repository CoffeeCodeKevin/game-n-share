import Head from 'next/head';

export default ({children, title='Game-n-share | Play, Track, Share'}) => (
  <div>
    <Head>
      <title> { title } </title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
    </Head>
    <main>
      { children }
    </main>
  </div>
)
