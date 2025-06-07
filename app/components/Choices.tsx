import { index } from '@react-router/dev/routes'
import React from 'react'

const ChoiceList = ['診断指標','基本データ','診断結果',"会社情報",'財務データ','自社情報','業種']

function Choices() {
  return (
    <div className='w-xs'>
      選択肢
      {ChoiceList.map((word, index) => (
        <div key={index}>
          {String.fromCharCode(65 + index)}. {word}
        </div>
      ))}

    </div>
  )
}

export default Choices