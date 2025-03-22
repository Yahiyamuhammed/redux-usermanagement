import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../slices/userSlice";
import { useNavigate } from "react-router-dom";
import { setAdmin } from "../../slices/adminSlice";
import adminAPI from "../../api/axiosAdminInstance";
import styles from "./AdminLogin.module.css";


export default function (){
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [message,setMessage]=useState('')
    const {isSignedIn}=useSelector((state)=>state.admin)
    const dispatch= useDispatch()
    const navigate=useNavigate()

    const defaultEmail='admin@gmail.com'
    const defaultPass=1234

    useEffect(()=>{
        if(sessionStorage.getItem("adminToken"))
            navigate('/admin')
        
        },[])
    
    const handleLogin=async(e)=>{
        e.preventDefault()
        try {
            const res=await adminAPI.post('admin/adminLogin',{password,email})
            console.log(res.data)
            if(res.status==201){
                console.log('emtered 201 if loggin');
                sessionStorage.setItem("adminToken", res.data.token);

                dispatch(setAdmin())
                navigate('/admin')
                
            }
             setMessage(res.data.message)
             console.log(message)
        } catch (error) {
            
            if(error.response)
                setMessage(error.response.data.message || 'some error occured')
        }
    }
    return (
        <div className={styles.adminLoginContainer}>
            <h2>Admin Login</h2>
            <form className={styles.adminLoginForm} onSubmit={handleLogin}>
                <input type="email" placeholder="Email" defaultValue={defaultEmail} value={email} onChange={(e) => setEmail(e.target.value)} className={styles.inputField} />
                <input type="password" placeholder="Current Password" defaultValue={defaultPass} value={password} onChange={(e) => setPassword(e.target.value)} className={styles.inputField} />
                <button type="submit" className={styles.loginBtn}>Login</button>
            </form>
            <p className={styles.message}>{message}</p>
        </div>
    );
}