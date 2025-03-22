import { useRef, useState } from "react"

import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import adminAPI from "../../api/axiosAdminInstance"
import styles from "./AdminCreateUser.module.css";

export default function(){
    const [message,setMessage]=useState('')
    const nameRef=useRef()
    const emailRef=useRef()
    const passRef=useRef()
    const navigate=useNavigate()
    const {isSignedIn}=useSelector((state)=>state.admin)
    const handleCreate=async (e)=>{
        e.preventDefault()
        try {
            const res=await adminAPI.post('/admin/adminCreateUser',{name:nameRef.current.value,email:emailRef.current.value,password:passRef.current.value})
            console.log(res.data,res.status);
            
            if(res.status == 201)
            {
                setMessage('user created')
                navigate('/admin')
            }
            else
                setMessage(res.data.message)
        } catch (error) {
            if (error.response) {
                
                if (error.response.status === 409) {
                    setMessage(error.response.data.message); 
                } else {
                    setMessage(error.response.data.message || 'An error occurred.');
                }
            } else {
                setMessage('Server error, please try again.');
            }
        }
    }
    if (!sessionStorage.getItem("adminToken")) {
        return (
            <div className={styles.loginPrompt}>
                <h1>You are not logged in</h1>
                <button onClick={() => navigate("/admin/adminLogin")} className={styles.loginBtn}>Login</button>
            </div>
        );
    }

    return (
        <div className={styles.createUserContainer}>
            <h2>Create User</h2>
            <form onSubmit={handleCreate} className={styles.createUserForm}>
                <input type="text" ref={nameRef} placeholder="Name" required className={styles.inputField} />
                <input type="email" ref={emailRef} placeholder="Email" required className={styles.inputField} />
                <input type="password" ref={passRef} placeholder="Password" required className={styles.inputField} />
                <button type="submit" className={styles.submitBtn}>Sign Up</button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
}