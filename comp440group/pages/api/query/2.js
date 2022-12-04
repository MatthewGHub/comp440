import { getSession } from 'next-auth/client'

import connectDB from '../../../lib/db'

async function handler(req, res) {
  if (req.method !== 'GET') {
    return
  }

  let query = `select posted_by as username, count(posted_by) as comment_count
  from comments
  group by posted_by
  having count(posted_by) = (select count(posted_by) from comments group by posted_by order by count(posted_by) desc limit 1)`
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
