import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../slices/userSlice";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";


export default function (){
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [message,setMessage]=useState('')
    const {userId}=useSelector(state=>state.user)
    const defaultEmail='yahiya@gmail.com'
    const defaultPassword=123456
    const dispatch= useDispatch()
    const navigate=useNavigate()
    useEffect(()=>{
        if(sessionStorage.getItem("token"))
            navigate('/')
    
    },[])
    
    const handleLogin=async(e)=>{
        e.preventDefault()
        try {
            const res=await API.post('user/login',{password,email})
            console.log(res.data)
            if(res.status==201){
                console.log('emtered 201 if loggin');

                sessionStorage.setItem("token", res.data.token);

                
                dispatch(setUser({userId:res.data.userExists._id,email:res.data.userExists.email,name:res.data.userExists.name,imagePath:res.data.userExists.profileImage}))
                navigate('/')
                
            }
             setMessage(res.data.message)
             console.log(message)
        } catch (error) {
            if(error)
                setMessage(error.response.data.message ||'login failed')
        }
    }
    return (
        <div className={styles.loginContainer}>
            <h2>Login</h2>
            <form onSubmit={handleLogin} className={styles.loginForm}>
                <label>Email:</label>
                <input 
                    type="email" 
                    placeholder="Enter Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />

                <label>Password:</label>
                <input 
                    type="password" 
                    placeholder="Enter Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />

                <button type="submit" className={styles.loginBtn}>Login</button>
            </form>

            <button className={styles.signupBtn} onClick={() => navigate('/signup')}>Signup</button>

            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
}