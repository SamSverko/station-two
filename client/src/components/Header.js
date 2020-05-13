// dependencies
import React from 'react'

const Header = ({ text, emoji, emojiDescription }) => {
  const emojiAriaLabel = `${emojiDescription} emoji`
  return (
    <>
      <h1>{text}&nbsp;<span aria-label={emojiAriaLabel} role='img'>{emoji}</span></h1>
      <hr />
    </>
  )
}

export default Header
