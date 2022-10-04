import { MosaicTile } from '@prisma/client'
import React, { Dispatch } from 'react'
import styles from '../styles/Tile.module.css'

type DisplayedTile = MosaicTile & { lineBreak?: boolean; handleColorChange: ({ x, y, color }: MosaicTile) => void }

const Tile = ({ x, y, color, lineBreak = false, handleColorChange }: DisplayedTile) => {
  return (
    <>
      {lineBreak && <br />}
      <div
        key={'tile' + x + y}
        style={{ backgroundColor: '#' + `${color}` }}
        className={styles.tile}
        onClick={() => handleColorChange({ x, y, color })}></div>
    </>
  )
}

export default Tile
