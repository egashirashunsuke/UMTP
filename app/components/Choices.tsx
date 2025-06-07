import { index } from '@react-router/dev/routes'
import React from 'react'

type ChoicesProps = {
  choices: string[]
}

function Choices({ choices }: ChoicesProps) {
  return (
    <div className='w-xs'>
      選択肢
      {choices.map((word, index) => (
        <div key={index}>
          {String.fromCharCode(65 + index)}. {word}
        </div>
      ))}

    </div>
  )
}

export default Choices