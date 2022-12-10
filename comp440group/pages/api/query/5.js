import { getSession } from 'next-auth/client'

import connectDB from '../../../lib/db'

async function handler(req, res) {
  if (req.method !== 'GET') {
    return
  }

  let query = `select blogs.created_by
  from blogs 
  where blogs.created_by not in (select blogs.created_by
  from comments, blogs
  where comments.sentiment = 'negative' and comments.blogid = blogs.blogid)`
  let data = await connectDB.query(query)
  connectDB.end()

  if (!data) {
    res.status(401).json({ message: 'Something went wrong!' })
    return
  }
  let result = Object.values(JSON.parse(JSON.stringify(data)))
  console.log(result)
  let result23 = []
  result.map((e) => {
    if (result23.indexOf(e.created_by) === -1) {
      result23.push(e.created_by)
    }
  })
  // console.log('result23')
  // console.log(result23)
  let result55 = []
  result23.map((e) => {
    result55.push({ created_by: e })
  })
  // console.log('result55')
  // console.log(result55)
  res.status(200).json({ message: 'Success!', data: { users: result55 } })
}

export default handler
