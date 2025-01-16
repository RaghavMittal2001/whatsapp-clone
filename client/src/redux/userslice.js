import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  _id:'',
  name:'',
  email:'',
  profile_pic:'',
  token:'',
  onlineuser:[],
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setuser:(state,action)=>{
      state._id=action.payload._id,
      state.email=action.payload.email,
      state.name=action.payload.name,
      state.profile_pic=action.payload.profile_pic
    },
    settoken:(state,action)=>{
      state.token=action.payload
    },
    unsetuser:(state)=>{  
      state._id='',
      state.email='',
      state.name='',
      state.token='',
      state.profile_pic=''
    },
    setonlineuser :(state,action)=>{
      state.onlineuser=action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setuser,settoken,unsetuser ,setonlineuser} = userSlice.actions

export default userSlice.reducer