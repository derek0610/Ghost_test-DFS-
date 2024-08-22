import { Ghost } from 'lucide-react'
import MazeScene from './components/MazeScene'
import type { Maze } from '@/types'

async function Home() {
  const res = await fetch(`http://localhost:3000/apis/maze`)
  const { data }: { data: Maze[] } = await res.json()

  return (
    <main className="p-8 bg-[#233B5F]">
      <div className="flex flex-col items-center justify-center">
        {data.slice(0, 3).map((maze, index) => {
          let ghostPosition: [number, number] | null = null
          let keyPosition: [number, number] | null = null

          maze.forEach((row, rowIndex) => {
            const startColumnIndex = row.indexOf('start')
            const keyColumnIndex = row.indexOf('end')
            if (startColumnIndex !== -1) {
              ghostPosition = [rowIndex, startColumnIndex]
            }
            if (keyColumnIndex !== -1) {
              keyPosition = [rowIndex, keyColumnIndex]
            }
          })

          return (
            <MazeScene
              key={index}
              data={maze}
              ghostIndex={ghostPosition}
              keyIndex={keyPosition}
            />
          )
        })}
      </div>
    </main>
  )
}

export default Home
