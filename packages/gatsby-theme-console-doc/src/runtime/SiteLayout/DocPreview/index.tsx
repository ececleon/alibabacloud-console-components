import React, { useEffect } from 'react'

const DocPreview: React.FC = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const myParam = urlParams.get('myParam')
  }, [])
  return <div>preview doc</div>
}

export default DocPreview
