import React, { useState, useEffect } from 'react'
import Link from 'next/link'

function Home(): JSX.Element {
  return (
    <div className="mod-empty">
      <p>no data, you could add one</p>
      <Link href="/edit">
        <a>add a post</a>
      </Link>
    </div>
  )
}

export default Home
