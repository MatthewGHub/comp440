import { getSession } from 'next-auth/client'

import connectDB from '../../lib/db'

async function handler(req, res) {
  console.log('backend')
  if (req.method !== 'GET') {
    return
  }

  console.log('backend2')

  // const sessionProps = req ? { req } : undefined
  // if (sessionProps) {
  //   const session = await getSession(sessionProps)
  // }
  // if (!session) {
  // res.status(401).json({ message: 'Not authenticated!' })
  // return
  // }
  console.log('here')
  let query = `SELECT * FROM blogs`
  let data = await connectDB.query(query)
  connectDB.end()

  if (!data) {
    res.status(401).json({ message: 'Something went wrong!' })
    return
  }
  let result = Object.values(JSON.parse(JSON.stringify(data)))

  console.log('here')
  query = `SELECT * FROM comments`
  data = await connectDB.query(query)
  connectDB.end()

  let result2 = Object.values(JSON.parse(JSON.stringify(data)))

  res
    .status(200)
    .json({ message: 'Success!', data: { blogs: result, comments: result2 } })
}

export default handler
