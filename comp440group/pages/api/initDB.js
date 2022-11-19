import { getSession } from 'next-auth/react'
const Runner = require('run-my-sql-file')
import path from 'path'

async function handler(req, res) {
  if (req.method !== 'POST') {
    return
  }

  const session = await getSession({ req: req })

  // if (!session) {
  //   res.status(401).json({ message: 'Not authenticated!' })
  //   return
  // }

  const hold = path.join(process.cwd(), 'pages/api', 'ProjDB.sql')

  Runner.connectionOptions({
    host: 'localhost',
    user: 'root',
    password: 'root',
  })

  Runner.runFile(hold, (err) => {
    if (err) {
      console.log(err)
      res.status(401).json({ message: 'Error!' })
    } else {
      console.log('Script sucessfully executed!')
    }
  })

  res.status(200).json({ message: 'Success!' })
}

export default handler
