import { getSession } from 'next-auth/client'

import connectDB from '../../../lib/db'

async function handler(req, res) {
  if (req.method !== 'GET') {
    return
  }

  let query = `select username
  from users 
  where username not in (select created_by from blogs)`
  let data = await connectDB.query(query)
  connectDB.end()

  if (!data) {
    res.status(401).json({ message: 'Something went wrong!' })
    return
  }
  let result = Object.values(JSON.parse(JSON.stringify(data)))
  console.log(result)

  res.status(200).json({ message: 'Success!', data: { users: result } })
}

export default handler
