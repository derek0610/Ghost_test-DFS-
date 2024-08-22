'use client'

import type { Maze } from '@/types'
import { useState, useEffect, useCallback, useRef } from 'react'
import { Ghost, Key } from 'lucide-react'

interface MazeSceneProps {
  data: Maze
  ghostIndex: [number, number] | null
  keyIndex: [number, number] | null
}

const wallColor = 'bg-sky-800'
const pathColor = 'bg-sky-100'
const currentPathColor = 'bg-sky-300'
const ghostColor = 'text-red-400'
const keyColor = 'text-red-400'

const MazeScene = ({ data, ghostIndex, keyIndex }: MazeSceneProps) => {
  const [path, setPath] = useState<[number, number][]>(
    ghostIndex ? [ghostIndex] : []
  )
  const [ghostPosition, setGhostPosition] = useState<[number, number] | null>(
    ghostIndex
  )
  const [isTraversing, setIsTraversing] = useState(false)

  // 儲存 setTimeout 的 id，用於中斷
  const traversalRef = useRef<number | null>(null)

  useEffect(() => {
    if (isTraversing) {
      traverseMaze()
    }
    // 中斷traverseMaze
    return () => {
      if (traversalRef.current !== null) {
        clearTimeout(traversalRef.current)
        traversalRef.current = null
      }
    }
  }, [isTraversing])

  const handleStartReset = () => {
    if (isTraversing) {
      // 重置
      setIsTraversing(false)
      setPath(ghostIndex ? [ghostIndex] : [])
      setGhostPosition(ghostIndex)
    } else {
      // 開始
      setIsTraversing(true)
    }
  }

  const traverseMaze = useCallback(() => {
    if (!ghostIndex) return
    const visited: boolean[][] = data.map(row => row.map(() => false))
    const stack: [number, number][] = [ghostIndex]
    const directions = [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0],
    ]

    const moveGhost = () => {
      if (!isTraversing || stack.length === 0) return

      const currentPosition = stack[stack.length - 1]
      const [y, x] = currentPosition

      setGhostPosition(currentPosition)
      setPath([...stack])

      visited[y][x] = true

      if (data[y][x] === 'end') return

      let moved = false

      for (const [dy, dx] of directions) {
        const [newY, newX] = [y + dy, x + dx]
        if (
          newX >= 0 &&
          newY >= 0 &&
          newX < data.length &&
          newY < data[0].length &&
          data[newY][newX] !== 'wall' &&
          !visited[newY][newX]
        ) {
          stack.push([newY, newX])
          moved = true
          break
        }
      }

      if (!moved) {
        stack.pop()
      }

      traversalRef.current = setTimeout(moveGhost, 300) as unknown as number
    }

    moveGhost()
  }, [data, ghostIndex, isTraversing])

  return (
    <div className="p-4 border-gray-600 border-t flex flex-col items-center">
      {data.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-8 h-8 flex items-center justify-center 
                ${cell === 'wall' ? wallColor : pathColor} 
                ${
                  path.some(([r, c]) => r === rowIndex && c === colIndex)
                    ? currentPathColor
                    : ''
                }
                   `}
            >
              {ghostPosition &&
                ghostPosition[0] === rowIndex &&
                ghostPosition[1] === colIndex && (
                  <Ghost className={ghostColor} size={20} />
                )}
              {keyIndex &&
                keyIndex[0] === rowIndex &&
                keyIndex[1] === colIndex && (
                  <Key className={keyColor} size={20} />
                )}
            </div>
          ))}
        </div>
      ))}
      <div
        className="cursor-pointer rounded p-1 my-4 w-[300px] bg-white hover:bg-gray-300 flex justify-center items-center transition"
        onClick={handleStartReset}
      >
        {isTraversing ? 'Reset' : 'Start'}
      </div>
    </div>
  )
}

export default MazeScene
