import { getSession } from 'next-auth/client'
import connectDB from '../../lib/db'

async function handler(req, res) {
  if (req.method !== 'POST') {
    return
  }

  const session = await getSession({ req: req })

  if (!session) {
    res.status(401).json({ message: 'Not authenticated!' })
    return
  }

  let body = JSON.parse(req.body)
  body.subject = body.subject.replace(/'/g, "\\'")
  body.description = body.description.replace(/'/g, "\\'")

  const date = new Date()
  const [month, day, year] = [
    date.getMonth() + 1,
    date.getDate(),
    date.getFullYear(),
  ]
  const dateString = `${year}-${month}-${day}`
  const tagArray = body.tags.split(',')

  // ONLY TWO PER DAY
  let query = `SELECT * FROM blogs WHERE created_by='${session.user.username}' and pdate='${dateString}'`
  let data = await connectDB.query(query)
  connectDB.end()

  if (data.length >= 2) {
    res.status(401).json({ message: 'Already posted twice today!' })
    return
  }

  query = `INSERT into blogs (subject, description, pdate, created_by) values ('${body.subject}', '${body.description}', '${dateString}', '${session.user.username}')`
  data = await connectDB.query(query)
  connectDB.end()

  if (!data) {
    res.status(401).json({ message: 'Something went wrong' })
    return
  }

  let blogId = ''
  if (data) {
    blogId = data['insertId']
  }

  // INSERT THE TAGS
  tagArray.map(async (e) => {
    query = `INSERT into blogstags (blogid, tag) values ('${blogId}', '${e}')`
    data = await connectDB.query(query)
  })

  if (!data) {
    res.status(401).json({ message: 'Something went wrong' })
    return
  }

  connectDB.end()

  res.status(200).json({ message: 'Success!' })
}

export default handler
