import { getSession } from 'next-auth/client'

import connectDB from '../../../lib/db'

async function handler(req, res) {
  if (req.method !== 'GET') {
    return
  }

  let query = `select p1.username as User_One, p2.username as User_Two, p2.hobby as Common_Hobby
  from hobbies as p1
  join hobbies as p2 on p1.hobby = p2.hobby and p1.username < p2.username`
  let data = await connectDB.query(query)
  connectDB.end()

  if (!data) {
    res.status(401).json({ message: 'Something went wrong!' })
    return
  }
  let result = Object.values(JSON.parse(JSON.stringify(data)))

  res.status(200).json({ message: 'Success!', data: { pairs: result } })
}

export default handler
