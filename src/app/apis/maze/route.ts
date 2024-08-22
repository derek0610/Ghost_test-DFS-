import { MAZES } from './constants'

export async function GET() {
  return Response.json({
    data: MAZES,
  })
}
