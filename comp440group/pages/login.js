import { getSession, signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import TextField from '@mui/material/TextField'
import * as React from 'react'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import { Grid } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import AbcIcon from '@mui/icons-material/Abc'
import Divider from '@mui/material/Divider'
import PasswordIcon from '@mui/icons-material/Password'
import Link from 'next/link'

export default function Employees({ session }) {
  const router = useRouter()

  // const { employee } = session

  const [goodAlert, setGoodAlert] = React.useState('')
  const [badAlert, setBadAlert] = React.useState('')
  const [loading, setLoading] = React.useState('')

  const [disableButton, setDisableButton] = React.useState(false)

  const [loginStuff, setLoginStuff] = React.useState({
    username: '',
    password: '',
  })

  const onClick = async (e) => {
    e.preventDefault()
    setDisableButton(true)
    setLoading(true)

    const result = await signIn('credentials', {
      redirect: false,
      username: loginStuff.username,
      password: loginStuff.password,
      type: 'login',
    })

    if (!result.error) {
      // set some auth state
      router.replace('/query')
    } else {
      console.log(result.error)
      setBadAlert(true)
      setLoading(false)
      setTimeout(() => {
        setBadAlert(false)
        setDisableButton(false)
      }, 2500)
    }
  }

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
      >
        <Grid item>
          <Link href="/">
            <Button variant="contained">Initialize DB</Button>
          </Link>
        </Grid>
        <Grid item>
          <Typography
            fontFamily="cursive"
            variant="h3"
            sx={{
              mt: 3,
              ml: 3,
            }}
          >
            Log In
          </Typography>
        </Grid>

        <Grid item>
          <Link href="/register">
            <Button variant="contained">Register</Button>
          </Link>
        </Grid>
      </Grid>
      <Divider flexItem sx={{ my: 1 }} />

      <FormControl sx={{ minWidth: 400 }}>
        <Grid item sx={{ border: 1, p: 1, mt: 3, ml: 3 }}>
          <Grid item>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              sx={{ mt: 1, mx: 2 }}
            >
              <AbcIcon fontSize="small" />
              <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                Username
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                id="outlined-basic"
                defaultValue={loginStuff.username}
                variant="outlined"
                onChange={(e) =>
                  setLoginStuff((prevState) => ({
                    ...prevState,
                    username: e.target.value,
                  }))
                }
                autoComplete="off"
                size="small"
                sx={{ ml: 2, mb: 1 }}
              />
            </Grid>
            <Divider flexItem />
          </Grid>
          <Grid item>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              sx={{ mt: 1, mx: 2 }}
            >
              <PasswordIcon />
              <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                Password
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <TextField
              id="outlined-basic"
              defaultValue={loginStuff.password}
              variant="outlined"
              onChange={(e) =>
                setLoginStuff((prevState) => ({
                  ...prevState,
                  password: e.target.value,
                }))
              }
              autoComplete="off"
              size="small"
              sx={{ ml: 2, mb: 1, mr: 1 }}
              type="password"
            />
          </Grid>
          <Divider flexItem />

          <Grid container direction="row" sx={{ mt: 1 }}>
            <Grid item>
              {/* <Link as="/register" href="/register">
                <Button variant="text" size="small">
                  Register
                </Button>
              </Link> */}
            </Grid>
            <Grid item sx={{ ml: 2, ml: 'auto' }}>
              <Button
                onClick={onClick}
                variant="outlined"
                disabled={
                  loginStuff.username === '' ||
                  loginStuff.password === '' ||
                  disableButton
                }
              >
                Login
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
                <Alert severity="error">There was an error logging in!</Alert>
              </Grid>
            )}
            {goodAlert && (
              <Grid sx={{ m: 1 }} item>
                <Alert severity="success">User successfully created!</Alert>
              </Grid>
            )}
          </Grid>
        </Grid>
      </FormControl>
    </Grid>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req })

  // const { query } = context

  if (session) {
    return {
      redirect: {
        destination: '/blogs',
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}
