import React, { Dispatch, useEffect, useState } from 'react'

import styles from '../styles/ColorSelector.module.css'

type ColorProps = {
  numberOfColors: number
  selectedColor: string
  setSelectedColor: Dispatch<React.SetStateAction<string>>
}

function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = ''
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const ColorSelector = ({ numberOfColors, selectedColor, setSelectedColor }: ColorProps) => {
  const [colorArray, setColorArray] = useState<string[]>([])

  useEffect(() => {
    let colorArr = []
    for (let i = 0; i < numberOfColors; i++) {
      colorArr.push(getRandomColor())
    }
    setColorArray(colorArr)
    setSelectedColor(colorArr[0])
  }, [numberOfColors, setSelectedColor])

  return (
    <div className={styles.paletteWrapper}>
      {colorArray &&
        colorArray.map((color, i) => (
          <div
            onClick={() => setSelectedColor(color)}
            style={{ backgroundColor: '#' + color }}
            className={`${styles.paletteTile} ${selectedColor === color && styles.selected}`}
            key={color + i}></div>
        ))}
    </div>
  )
}

export default ColorSelector
