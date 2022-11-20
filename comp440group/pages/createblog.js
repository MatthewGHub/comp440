import { getSession, signOut, useSession } from 'next-auth/client'
import React from 'react'
import { Grid, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
// import excuteQuery from '../lib/db.js'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/router'

function Homepage({ user }) {
  const router = useRouter()

  const theme = useTheme()
  const { data: session, status } = useSession()
  // console.log(user)
  // const user23 = JSON.parse(user)
  // console.log(user23)

  const [value, setValue] = React.useState('Controlled')
  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const [newBlogStuff, setNewBlogStuff] = React.useState({
    subject: '',
    description: '',
    tags: '',
  })

  const [goodAlert, setGoodAlert] = React.useState('')
  const [badAlert, setBadAlert] = React.useState('')
  const [badAlertP2, setBadAlertP2] = React.useState(false)

  const [loading, setLoading] = React.useState('')
  const [disableButton, setDisableButton] = React.useState(false)

  const onClick = async () => {
    if (
      newBlogStuff.subject === '' ||
      newBlogStuff.description === '' ||
      newBlogStuff.tags === ''
    ) {
      return
    }
    setDisableButton(true)
    setLoading(true)
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/createBlog`, {
      method: 'POST',
      body: JSON.stringify(newBlogStuff),
    })

    const finished = await res.json()

    if (finished.message === 'Success!') {
      setLoading(false)
      setDisableButton(false)
      setGoodAlert(true)
      await new Promise(() => {
        setTimeout(() => {
          setGoodAlert(false)
          router.replace('/blogs')
        }, 3500)
      })
    } else if (finished.message === 'Already posted twice today!') {
      setLoading(false)
      setDisableButton(false)
      setBadAlert(true)
      setBadAlertP2(true)
      await new Promise(() => {
        setTimeout(() => {
          setBadAlert(false)
          setBadAlertP2(false)
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
      {!user && (
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
      {user && (
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          style={{ paddingBottom: '2.5rem' }}
        >
          <Grid item sx={{ marginLeft: 'auto', marginTop: 2, marginRight: 2 }}>
            <Link href="/blogs">
              <Button variant="contained">Blogs</Button>
            </Link>
          </Grid>

          <Grid item sx={{ marginTop: 2, marginRight: 2 }}>
            <Button
              variant="contained"
              onClick={() =>
                signOut({
                  callbackUrl: `${process.env.NEXTAUTH_URL}`,
                })
              }
            >
              Sign out
            </Button>
          </Grid>
        </Grid>
      )}

      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        style={{ paddingBottom: '2.5rem' }}
      >
        <Grid item>
          <h1>Create Blog </h1>
        </Grid>
        <Grid item>
          <Box
            sx={{
              width: 700,
            }}
          >
            <Typography variant="h5" sx={{ ml: 2 }}>
              Subject
            </Typography>
            <TextField
              fullWidth
              defaultValue={newBlogStuff.subject}
              onChange={(e) =>
                setNewBlogStuff((prevState) => ({
                  ...prevState,
                  subject: e.target.value,
                }))
              }
            />
            <Typography variant="h5" sx={{ ml: 2 }}>
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              defaultValue={newBlogStuff.description}
              onChange={(e) =>
                setNewBlogStuff((prevState) => ({
                  ...prevState,
                  description: e.target.value,
                }))
              }
            />
            <Typography variant="h5" sx={{ ml: 2 }}>
              Tags
            </Typography>
            <TextField
              fullWidth
              defaultValue={newBlogStuff.tags}
              onChange={(e) =>
                setNewBlogStuff((prevState) => ({
                  ...prevState,
                  tags: e.target.value,
                }))
              }
            />
          </Box>
        </Grid>
        <Button
          variant="contained"
          sx={{ textAlign: 'center', mt: 2 }}
          onClick={onClick}
        >
          Submit
        </Button>
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

        {badAlert && badAlertP2 && (
          <Grid sx={{ m: 1 }} item>
            <Alert severity="error">
              You have already posted twice today! Try again tomorrow.
            </Alert>
          </Grid>
        )}
        {badAlert && !badAlertP2 && (
          <Grid sx={{ m: 1 }} item>
            <Alert severity="error">There was an error!</Alert>
          </Grid>
        )}
        {goodAlert && (
          <Grid sx={{ m: 1 }} item>
            <Alert severity="success">Blog post created!</Alert>
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

  if (!session) {
    return {
      redirect: {
        destination: '/',
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
    props: { user: JSON.stringify(session.user) },
  }
}

export default Homepage
