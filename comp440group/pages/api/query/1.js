import { getSession } from 'next-auth/client'

import connectDB from '../../../lib/db'

async function handler(req, res) {
  if (req.method !== 'POST') {
    return
  }

  let body = JSON.parse(req.body)
  console.log(body)

  let query = `select blogs.blogid, blogs.description, blogs.subject
  from blogs
  where blogs.blogid in (select blogs.blogid
  from blogs 
  where blogs.created_by = '${body}' 
  and blogs.blogid not in (select comments.blogid
  from comments
  where comments.sentiment = 'negative'))`
  let data = await connectDB.query(query)
  connectDB.end()

  if (!data) {
    res.status(401).json({ message: 'Something went wrong!' })
    return
  }
  let result = Object.values(JSON.parse(JSON.stringify(data)))
  console.log(result)
  let hold = []
  result.map((e) => {
    if (hold.indexOf(e.blogid) === -1) {
      hold.push(e.blogid)
    }
  })

  res.status(200).json({ message: 'Success!', data: { blogs: result } })
}

export default handler
