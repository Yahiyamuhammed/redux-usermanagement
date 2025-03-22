import { createSlice }from "@reduxjs/toolkit"

// const initialState={
//     name:'admin',
//     isSignedIn:true
// }
const initialState={
    name:null,
    isSignedIn:false
}
const adminAuth = createSlice({
    name:'ADMIN',
    initialState,
    reducers:{
        setAdmin:(state)=>{
            console.log('called set admin');
            
            state.isSignedIn=true,
            state.name='admin'
        },
        logOutAdmin:(state)=>{
            state.isSignedIn=false,
            state.name=null
        }
    }
})
export const {setAdmin,logOutAdmin} = adminAuth.actions
export default adminAuth.reducer