import { getSession, signOut, useSession } from 'next-auth/client'
import React from 'react'
import { Grid, Button } from '@mui/material'
import { useTheme } from '@mui/material/styles'
// import excuteQuery from '../lib/db.js'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Link from '@mui/material/Link'

function Homepage() {
  const theme = useTheme()
  const { data: session, status } = useSession()
  // console.log(user)
  // const user23 = JSON.parse(user)
  // console.log(user23)

  const [goodAlert, setGoodAlert] = React.useState('')
  const [badAlert, setBadAlert] = React.useState('')
  const [loading, setLoading] = React.useState('')
  const [disableButton, setDisableButton] = React.useState(false)

  const onClickIDB = async () => {
    setDisableButton(true)
    setLoading(true)
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/initDB`, {
      method: 'POST',
    })

    const finished = await res.json()
    console.log('hi finshed')
    console.log(finished)

    if (finished.message === 'Success!') {
      setLoading(false)
      setDisableButton(false)
      setGoodAlert(true)
      await new Promise(() => {
        setTimeout(() => {
          setGoodAlert(false)
        }, 3500)
      })
    } else {
      setLoading(false)
      setDisableButton(false)
      setBadAlert(true)
      await new Promise(() => {
        setTimeout(() => {
          setBadAlert(false)
        }, 3500)
      })
    }
  }

  return (
    <>
      {!session && (
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          style={{ paddingBottom: '2.5rem' }}
        >
          <Grid item sx={{ marginLeft: 'auto', marginTop: 2, marginRight: 2 }}>
            <Link href="/login">
              <Button variant="contained">Sign In</Button>
            </Link>
          </Grid>
          <Grid item sx={{ marginTop: 2, marginRight: 2 }}>
            <Link href="/register">
              <Button variant="contained">Register</Button>
            </Link>
          </Grid>
        </Grid>
      )}
      {session && (
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          style={{ paddingBottom: '2.5rem' }}
        >
          <Grid item sx={{ marginLeft: 'auto', marginTop: 2, marginRight: 2 }}>
            <Link href="/createblog">
              <Button variant="contained">Post Blog</Button>
            </Link>
          </Grid>
          <Grid item sx={{ marginTop: 2, marginRight: 2 }}>
            <Link href="/blogs">
              <Button variant="contained">View Blogs</Button>
            </Link>
          </Grid>
        </Grid>
      )}

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        style={{ paddingBottom: '2.5rem' }}
      >
        <Grid item>
          <h1>Welcome </h1>
        </Grid>
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        style={{ paddingBottom: '2.5rem' }}
      >
        <Grid item>
          <Button
            onClick={onClickIDB}
            variant="outlined"
            disabled={disableButton}
          >
            Initialize Database
          </Button>
        </Grid>
      </Grid>
      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
      >
        {loading && (
          <Grid item sx={{ mt: 1 }}>
            <CircularProgress />
          </Grid>
        )}

        {badAlert && (
          <Grid sx={{ m: 1 }} item>
            <Alert severity="error">There was an error!</Alert>
          </Grid>
        )}
        {goodAlert && (
          <Grid sx={{ m: 1 }} item>
            <Alert severity="success">DB initiated!</Alert>
          </Grid>
        )}
      </Grid>
    </>
  )
}

// Homepage.getInitialProps = async (context) => {
//   const session = await getSession({ req: context.req })
//   if (!session) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     }
//   }

//   return {
//     user: JSON.stringify(session.user),
//   }
// }

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req })

  if (session) {
    return {
      redirect: {
        destination: '/blogs',
        permanent: false,
      },
    }
  }
  // console.log('in hyhy')
  // console.log(session)
  // const query = `SELECT username, firstName, lastName, email FROM users WHERE email='${session.user.email}'`
  // const data = await connectDB.query(query)
  // connectDB.end()

  // let user = {}
  // if (data.length > 0) {
  //   user.username = data[0]['username']
  //   user.firstName = data[0]['firstName']
  //   user.lastName = data[0]['lastName']
  //   user.email = data[0]['email']
  // } else {
  //   console.log('error')
  // }
  // console.log(user)

  // return {
  //   props: { user: JSON.stringify(session.user) },
  // }
  return {
    props: {},
  }
}

export default Homepage
