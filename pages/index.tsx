import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import useSWR, { useSWRConfig } from 'swr'
import { MosaicTile } from '@prisma/client'
import React, { useState, useEffect } from 'react'
import Tile from '../components/Tile'
import ColorSelector from '../components/ColorSelector'

const NO_OF_COLORS = 10

const Home: NextPage = () => {
  const { mutate } = useSWRConfig()

  const [selectedColor, setSelectedColor] = useState('#000000')
  const [dataArray, setDataArray] = useState<MosaicTile[]>()

  const fetcher: (url: RequestInfo) => Promise<any> = (url) => fetch(url).then((r) => r.json())

  const { data, error } = useSWR<MosaicTile[]>('/api/tiles', fetcher)
  useEffect(() => {
    setDataArray(data)
  }, [data])

  if (error) {
    console.error(error)
    return <div>failed to load</div>
  }

  let currX = 0
  let lineBreak = false

  const handleColorChange = ({ x, y, color }: MosaicTile) => {
    if (Array.isArray(dataArray) && Array.isArray(data)) {
      let changedTile = dataArray.find((tile) => tile.x === x && tile.y === y)
      if (changedTile?.color && selectedColor) {
        mutate(
          '/api/tiles',
          async () => {
            const updatedTile = await fetch('/api/tiles', {
              method: 'PUT',
              body: JSON.stringify({ x, y, selectedColor })
            })
            if (updatedTile.status === 200) {
              let dataCopy = [...dataArray]
              let changedLocalTile = dataCopy.find((tile) => tile.x === x && tile.y === y)
              if (changedLocalTile && changedLocalTile.color) changedLocalTile.color = selectedColor
              setDataArray(dataCopy)
              return dataCopy
            }
            return []
          },
          { optimisticData: dataArray, rollbackOnError: true }
        )
      }
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Mosaic Game</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to the Mosaic Game</h1>
        <ColorSelector numberOfColors={NO_OF_COLORS} selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
        <div className={styles.mosaicTable}>
          {dataArray &&
            dataArray.map((tile) => {
              lineBreak = false
              if (tile.x > currX) {
                // creating a new row & first element of row
                currX = currX + 1
                lineBreak = true
              }
              // creating an element of a row
              return (
                <Tile
                  key={tile.x + '.' + tile.y}
                  x={tile.x}
                  y={tile.y}
                  color={tile.color}
                  lineBreak={lineBreak}
                  handleColorChange={handleColorChange}
                />
              )
            })}
        </div>
      </main>
    </div>
  )
}

export default Home
