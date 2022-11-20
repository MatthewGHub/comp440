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
import EmailIcon from '@mui/icons-material/Email'
import PasswordIcon from '@mui/icons-material/Password'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import Link from 'next/link'

export default function Employees({ session }) {
  const router = useRouter()

  // const { employee } = session

  const [goodAlert, setGoodAlert] = React.useState('')
  const [badAlert, setBadAlert] = React.useState('')
  const [loading, setLoading] = React.useState('')

  const [showPassword, setShowPassword] = React.useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = React.useState(false)

  const [disableButton, setDisableButton] = React.useState(false)
  const [errorEmail, setErrorEmail] = React.useState(true)

  const [registerStuff, setRegisterStuff] = React.useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  })

  const onChangeEmail = (e) => {
    setRegisterStuff((prevState) => ({
      ...prevState,
      email: e.target.value,
    }))
    if (validateEmail(e.target.value)) {
      setErrorEmail(false)
    } else {
      setErrorEmail(true)
    }
  }

  const validateEmail = (mail) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true
    }
    return false
  }

  const onClick = async (e) => {
    e.preventDefault()
    setDisableButton(true)
    setLoading(true)

    const result = await signIn('credentials', {
      redirect: false,
      username: registerStuff.username,
      firstName: registerStuff.firstName,
      lastName: registerStuff.lastName,
      email: registerStuff.email,
      password: registerStuff.password,
      passwordConfirm: registerStuff.passwordConfirm,
      type: 'register',
    })

    if (!result.error) {
      // set some auth state
      router.replace('/blogs')
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
            Register
          </Typography>
        </Grid>
        <Grid item>
          <Link href="/login">
            <Button variant="contained">Login</Button>
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
                defaultValue={registerStuff.username}
                variant="outlined"
                onChange={(e) =>
                  setRegisterStuff((prevState) => ({
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
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              sx={{ mt: 1, mx: 2 }}
            >
              <AbcIcon fontSize="small" />
              <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                First Name
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                id="outlined-basic"
                defaultValue={registerStuff.firstName}
                variant="outlined"
                onChange={(e) =>
                  setRegisterStuff((prevState) => ({
                    ...prevState,
                    firstName: e.target.value,
                  }))
                }
                autoComplete="off"
                size="small"
                sx={{ ml: 2, mb: 1 }}
              />
            </Grid>
            <Divider flexItem />
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              sx={{ mt: 1, mx: 2 }}
            >
              <AbcIcon fontSize="small" />
              <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                Last Name
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <TextField
              id="outlined-basic"
              defaultValue={registerStuff.lastName}
              variant="outlined"
              onChange={(e) =>
                setRegisterStuff((prevState) => ({
                  ...prevState,
                  lastName: e.target.value,
                }))
              }
              autoComplete="off"
              size="small"
              sx={{ ml: 2, mb: 1 }}
            />
          </Grid>
          <Divider flexItem />
          <Grid item>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              sx={{ mt: 1, mx: 2 }}
            >
              <EmailIcon fontSize="small" />
              <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                Email
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <TextField
              error={errorEmail}
              id="outlined-basic"
              defaultValue={registerStuff.email}
              variant="outlined"
              onChange={onChangeEmail}
              autoComplete="off"
              size="small"
              sx={{ ml: 2, mb: 1 }}
            />
          </Grid>
          <Divider flexItem />
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
              defaultValue={registerStuff.password}
              variant="outlined"
              onChange={(e) =>
                setRegisterStuff((prevState) => ({
                  ...prevState,
                  password: e.target.value,
                }))
              }
              autoComplete="off"
              size="small"
              sx={{ ml: 2, mb: 1, mr: 1 }}
              type={!showPassword && 'password'}
            />
            {showPassword && (
              <VisibilityOffIcon onClick={() => setShowPassword(false)} />
            )}
            {!showPassword && (
              <VisibilityIcon onClick={() => setShowPassword(true)} />
            )}
          </Grid>
          <Divider flexItem />

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
                Password Confirm
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <TextField
              id="outlined-basic"
              defaultValue={registerStuff.passwordConfirm}
              variant="outlined"
              onChange={(e) =>
                setRegisterStuff((prevState) => ({
                  ...prevState,
                  passwordConfirm: e.target.value,
                }))
              }
              autoComplete="off"
              size="small"
              sx={{ ml: 2, mb: 1, mr: 1 }}
              type={!showPasswordConfirm && 'password'}
            />
            {showPasswordConfirm && (
              <VisibilityOffIcon
                onClick={() => setShowPasswordConfirm(false)}
              />
            )}
            {!showPasswordConfirm && (
              <VisibilityIcon onClick={() => setShowPasswordConfirm(true)} />
            )}
          </Grid>
          <Divider flexItem />

          <Grid container direction="row" sx={{ mt: 1 }}>
            <Grid item>
              {/* <Link as="/" href="/">
                <Button variant="text" size="small">
                  Login
                </Button>
              </Link> */}
            </Grid>
            <Grid item sx={{ ml: 2, ml: 'auto' }}>
              <Button
                onClick={onClick}
                variant="outlined"
                // disabled={disableButton}
                disabled={
                  registerStuff.firstName === '' ||
                  registerStuff.lastName === '' ||
                  registerStuff.email === '' ||
                  registerStuff.username === '' ||
                  registerStuff.password === '' ||
                  registerStuff.passwordConfirm === '' ||
                  registerStuff.password !== registerStuff.passwordConfirm ||
                  disableButton ||
                  errorEmail
                }
              >
                Register
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
                <Alert severity="error">There was an error registering!</Alert>
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

  const { query } = context

  if (session) {
    return {
      redirect: {
        destination: '/homepage',
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}
