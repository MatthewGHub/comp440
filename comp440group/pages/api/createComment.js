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
  console.log(session)
  console.log(body)
  body.description = body.description.replace(/'/g, "\\'")

  // check if comment wrote blog

  const date = new Date()
  const [month, day, year] = [
    date.getMonth() + 1,
    date.getDate(),
    date.getFullYear(),
  ]
  const cdate = `${year}-${month}-${day}`

  // ONLY TWO PER DAY
  let query = `SELECT * FROM comments WHERE posted_by='${session.user.username}' and cdate='${cdate}'`
  let data = await connectDB.query(query)
  connectDB.end()

  if (data.length >= 3) {
    res.status(401).json({ message: 'Already posted three times today!' })
    return
  }

  query = `SELECT * FROM comments WHERE posted_by='${session.user.username}' and blogid='${body.blogid}'`
  let tst = connectDB.escape(query)
  console.log(tst)

  data = await connectDB.query(query)
  connectDB.end()

  if (data.length > 0) {
    res.status(401).json({ message: 'You already posted on this blog!' })
    return
  }

  query = `SELECT * FROM blogs WHERE created_by='${session.user.username}' and blogid='${body.blogid}'`
  data = await connectDB.query(query)
  connectDB.end()

  if (data.length > 0) {
    res.status(401).json({ message: 'You can not post on a blog you created!' })
    return
  }

  query = `INSERT into comments (sentiment, description, cdate, blogid, posted_by) values ('${body.sentiment}', '${body.description}', '${cdate}', '${body.blogid}' ,'${session.user.username}')`
  data = await connectDB.query(query)
  connectDB.end()

  res.status(200).json({ message: 'Success!' })
}

export default handler
