import { createSlice } from '@reduxjs/toolkit'

const userAuth = () => {
  const isAuth = localStorage.getItem('isAuth')

  if (isAuth && JSON.parse(isAuth) === true) {
    return true
  }

  return false
}

const initialState = {
  isAuth: userAuth(),
}

export const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticateUser: (state) => {
        state.isAuth = true
    },
    unauthenticateUser: (state) => {
        state.isAuth = false
    }
  },
})

export const {authenticateUser,unauthenticateUser} = slice.actions
export default slice.reducer