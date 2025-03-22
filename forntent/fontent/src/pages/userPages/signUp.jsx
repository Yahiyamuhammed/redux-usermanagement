import { useEffect, useState } from "react"
import API from "../../api/axiosInstance"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "../../slices/userSlice"
import styles from "./Signup.module.css";



export default function (){
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const {userId}=useSelector(state=>state.user)

    const [ name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [message,setMessage]=useState('')
    useEffect(()=>{
            if(sessionStorage.getItem("token"))
                navigate('/')
        
        },[])

    const handleSignup=async(e)=>{
        e.preventDefault()
        try {
            const res=await API.post('user/createUser',{name,password,email})
            console.log(res.data);
            
             setMessage(res.data.message)
             if(res.status==201){
                    console.log('emtered 200 if signup');

                    sessionStorage.setItem("token", res.data.token);
                             
                   dispatch(setUser({userId:res.data.newUser._id,email:res.data.newUser.email,name:res.data.newUser.name}))
                    navigate('/')
                             
                         }
             console.log(message)
        } catch (error) {
            if(error)
                setMessage(error.response.data.message ||'signup failed')
        }
    }
    return (
        <div className={styles.signupContainer}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup} className={styles.signupForm}>
                <label>Name:</label>
                <input 
                    type="text" 
                    placeholder="Enter Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />

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

                <button type="submit" className={styles.signupBtn}>Sign Up</button>
            </form>

            <button className={styles.loginBtn} onClick={() => navigate('/login')}>Login</button>

            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
}