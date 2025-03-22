import { createSlice } from "@reduxjs/toolkit";
// const initialState={
//     userId:'67d1e91bc0a935dd2f8c5071',
//     email:'yahiya@gmail.com',
//     name:'yahiya',
//     imagePath:'uploads\\1741887519449.png'
// }
const initialState={
    userId:null,
    email:null,
    name:null,
    imagePath:null
}

const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        setUser:(state,action)=>{
            console.log('entered set state');

            console.log(action.payload.email);
            
            
            state.email=action.payload.email
            state.userId=action.payload.userId
            state.name=action.payload.name
            state.imagePath=action.payload.imagePath || null
            

            console.log(state.email);
            console.log(state.userId);
            console.log(state.imagePath);
            
        },
        userLogout:(state)=>{
            state.email=null,
            state.userId=null,
            state.imagePath=null,
            state.name=null
        }
    }
})

export const {setUser,userLogout} = authSlice.actions
export default authSlice.reducer