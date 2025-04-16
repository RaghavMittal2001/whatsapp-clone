import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  _id:'',
  name:'',
  email:'',
  profile_pic:'',
  token:'',
  page:0,//varible to keep track of sidebar page
  onlineuser:[],
  socketconnection:null,
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
    logout:(state)=>{  
      state._id='',
      state.email='',
      state.name='',
      state.token='',
      state.profile_pic='',
      state.socketconnection=null
    },
    setonlineuser :(state,action)=>{
      state.onlineuser=action.payload
    },
    setsocketconnection:(state,action)=>{
      state.socketconnection=action.payload
    },
    setpage:(state,action)=>{
      state.page=action.payload
    }
  }, 
})

// Action creators are generated for each case reducer function
export const { setuser,settoken,logout ,setonlineuser,setsocketconnection,setpage} = userSlice.actions

export default userSlice.reducer