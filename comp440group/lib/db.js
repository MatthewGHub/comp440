import mysql from 'serverless-mysql'
const connectDB = mysql({
  config: {
    host: 'localhost',
    port: 3306,
    database: 'Projdb23',
    user: 'root',
    password: 'root',
  },
})
export default connectDB
// export default async function excuteQuery({ query, values }) {
//   try {
//     console.log('in hur')
//     const results = await db.query(query)
//     await db.end()
//     return results
//   } catch (error) {
//     return { error }
//   }
// }
