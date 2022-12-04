import { getSession } from 'next-auth/client'

import connectDB from '../../../lib/db'

async function handler(req, res) {
  if (req.method !== 'POST') {
    return
  }

  let body = JSON.parse(req.body)
  let { user1, user2 } = body
  console.log(user1, user2)

  let query = `select f.leadername 
  from follows f
  where f.followername = '${user1}'
  and f.leadername in (
  select f2.leadername
  from follows f2
  where f2.followername = '${user2}')`
  let data = await connectDB.query(query)
  connectDB.end()

  if (!data) {
    res.status(401).json({ message: 'Something went wrong!' })
    return
  }
  let result = Object.values(JSON.parse(JSON.stringify(data)))
  console.log(result)

  res.status(200).json({ message: 'Success!', data: { results: result } })
}

export default handler
