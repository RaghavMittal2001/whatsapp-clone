import { configureStore } from '@reduxjs/toolkit'
import userreducer from './userslice.js'
export const store = configureStore({
  reducer: {
    user :userreducer
  },
})  