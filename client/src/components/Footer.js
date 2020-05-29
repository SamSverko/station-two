// dependencies
import packageJson from '../../package.json'
import React from 'react'

const Footer = () => {
  return <p className='mt-3 text-muted'>v{packageJson.version}</p>
}

export default Footer
