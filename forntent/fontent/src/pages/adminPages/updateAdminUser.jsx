import { useRef, useState } from "react"

import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "../../slices/userSlice"
import adminAPI from "../../api/axiosAdminInstance"
import styles from "./AdminUpdateUser.module.css";


export default function (){
    const {id}=useParams()
    const location=useLocation()
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const {isSignedIn}=useSelector((state)=>state.admin)
    // console.log(location);
    
    
    const {name,email}=location.state || {}
    // console.log("Received Name:", name);
    // console.log("Received Email:", email);
    const updatedEmail=useRef()
    const updatedName=useRef()
    const [message,setMessage]=useState('')


    const updateUser=async(e)=>{
        e.preventDefault()
        try {
            const res=await adminAPI.put(`/admin/adminUpdateUser/${id}`,{email:updatedEmail.current.value,name:updatedName.current.value})
            console.log(res)
            if(res.status==200)
                {
                    dispatch(setUser({userId:res.data.updatedUser._id,email:res.data.updatedUser.email,name:res.data.updatedUser.name}))
                    navigate('/admin')
                }
                else
                    setMessage(res.data)
                    console.log(message);
        } catch (error) {
            console.log('some error');
            
            if(error)
                console.log(error);
            setMessage(error)                
        }
        
        

    }
    if (!sessionStorage.getItem("adminToken")) {
        return (
            <div className={styles.updateUserContainer}>
                <h1>You are not logged in. Login to continue</h1>
                <button onClick={() => navigate('/admin/adminLogin')}>Login</button>
            </div>
        );
    }

    return (
        <div className={styles.updateUserContainer}>
            <h2>Update User</h2>
            <form className={styles.updateUserForm} onSubmit={updateUser}>
                <input ref={updatedName} type="text" defaultValue={name} className={styles.inputField} />
                <input ref={updatedEmail} type="email" defaultValue={email} className={styles.inputField} />
                <button type="submit" className={styles.submitBtn}>Submit</button>
            </form>
            <p className={styles.message}>{message}</p>
        </div>
    );
}