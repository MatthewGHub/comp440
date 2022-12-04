import { getSession } from 'next-auth/client'

import connectDB from '../../lib/db'

async function handler(req, res) {
  if (req.method !== 'GET') {
    return
  }

  console.log('backend getUsers')
  // const session = await getSession()
  // if (!session) {
  //   res.status(401).json({ message: 'Not authenticated!' })
  //   return
  // }
  console.log('here')
  let query = `SELECT * FROM users`
  let data = await connectDB.query(query)
  connectDB.end()

  if (!data) {
    res.status(401).json({ message: 'Something went wrong!' })
    return
  }
  let result = Object.values(JSON.parse(JSON.stringify(data)))

  res.status(200).json({ message: 'Success!', data: { users: result } })
}

export default handler
