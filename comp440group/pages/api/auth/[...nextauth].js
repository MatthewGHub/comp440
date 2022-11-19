import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import connectDB from '../../../lib/db'

import { signOut } from 'next-auth/react'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

const validateEmail = (email) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true
  } else {
    return false
  }
}

const validatePassword = (password) => {
  if (
    /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])((?=.*\W)|(?=.*_))^[^ ]+$/.test(password)
  ) {
    return true
  } else {
    return false
  }
}

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    secret: 'a-very-long-secret',
    // Set to true to use encryption (default: false)
    // encryption: true,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      async authorize(credentials) {
        if (credentials.type === 'login') {
          if (
            typeof credentials.username !== 'string' ||
            typeof credentials.password !== 'string'
          ) {
            throw new Error('Error.')
          }
          if (credentials.username === '' || credentials.password === '') {
            throw new Error('Error.')
          }
          const username = credentials.username
          const password = credentials.password

          // const data = await excuteQuery({
          //   query: `SELECT * FROM users WHERE username='${username}'`,
          // })

          const query = `SELECT * FROM users WHERE username='${username}'`
          const data = await connectDB.query(query)
          connectDB.end()

          let user = {}
          if (data.length > 0) {
            user.username = data[0]['username']
            user.firstName = data[0]['firstName']
            user.lastName = data[0]['lastName']
            user.email = data[0]['email']
            user.password = data[0]['password']

            return loginUser({ password, user })
          } else {
            console.log('error')
            throw new Error('Error.')
          }
        } else if (credentials.type === 'register') {
          const username = credentials.username
          const firstName = credentials.firstName
          const lastName = credentials.lastName
          const email = credentials.email
          const password = credentials.password
          const passwordConfirm = credentials.passwordConfirm

          if (
            typeof username !== 'string' ||
            typeof firstName !== 'string' ||
            typeof lastName !== 'string' ||
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            typeof passwordConfirm !== 'string'
          ) {
            throw new Error('Error.')
          }

          if (
            username === '' ||
            firstName === '' ||
            lastName === '' ||
            email === '' ||
            password === '' ||
            passwordConfirm === ''
          ) {
            throw new Error('Error.')
          }
          if (credentials.password !== credentials.passwordConfirm) {
            throw new Error('Error.')
          }

          const newUser = {
            username,
            firstName,
            lastName,
            email,
            password,
          }

          return registerUser({ newUser })
        }
      },
    }),
  ],
  pages: {
    signIn: '/',
    error: '/',
  },
  // SQL or MongoDB database (or leave empty)
  database: process.env.DATABASE_URL,
  callbacks: {
    session: async (session) => {
      const query = `SELECT * FROM users WHERE email='${session.token.email}'`
      const data = await connectDB.query(query)
      connectDB.end()

      let user = {}
      if (data.length > 0) {
        user.username = data[0]['username']
        user.firstName = data[0]['firstName']
        user.lastName = data[0]['lastName']
        user.email = data[0]['email']
      }

      session.user = user

      return Promise.resolve(session)
    },
  },
})

const loginUser = async ({ password, user }) => {
  // const isMatch = await bcrypt.compare(password, user.password)
  // if (!isMatch) {
  //   throw new Error('Password Incorrect.')
  // }

  return user
}

const registerUser = async ({ newUser }) => {
  // const hashPass = await bcrypt.hash(newUser.password, 12)

  const query = `INSERT into users (username, firstName, lastName, email, password) values ('${newUser.username}', '${newUser.firstName}', '${newUser.lastName}', '${newUser.email}', '${newUser.password}')`
  const data = await connectDB.query(query)
  connectDB.end()

  newUser.password = ''

  if (data) {
    return newUser
  } else {
    throw new Error('Error.')
  }
}
