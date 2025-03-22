import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";
import { setUser, userLogout } from "../../slices/userSlice";
import styles from "./UserHome.module.css";


export default function(){
    // const email=useSelector(state=>{state.auth.email})
    const {userId,email,imagePath,name} = useSelector((state) => state.user);
    const navigate=useNavigate()
    const [token,setToken]=useState( sessionStorage.getItem("token"))
    const dispatch=useDispatch()
    // const {userId}=useSelector(state=>state.user)
    

    useEffect(()=>{
        const fetchUser=async()=>{
            console.log('inside fetch user');
            
            try {
                const res = await API.get("user/getUser",{token});
                console.log(res.data);
                
                dispatch(setUser(res.data)); // Save user in Redux
            } catch (error) {
                console.log("Failed to fetch user:", error.response?.data?.message || error.message);
            }
        }
        console.log('inside use effect');
        
        if(token)
            fetchUser()
        else
            console.log('no token found on home');
            

    },[])
    const handleLogout =()=>{
        console.log('loged out');
        
        sessionStorage.removeItem("token")
        setToken(null)
        dispatch(userLogout())
    }

    console.log('this is the image path',imagePath)

    if (!token) {
        return (
            <div className={styles.userHomeContainer}>
                <h1>You are not logged in</h1>
                <button className={styles.userHomeBtn} onClick={() => navigate('/login')}>Login</button>
                <button className={styles.userHomeBtn} onClick={() => navigate('/signup')}>Signup</button>
            </div>
        );
    }

    return (
        <div className={styles.userHomeContainer}>
            {imagePath ? (
                <img src={`http://localhost:3000/${imagePath}`} alt="Profile" className={styles.profileImage} />
            ) : (
                <div className={styles.profileImage} style={{ backgroundColor: "#ddd", display: "inline-block" }} />
            )}

            {/* Display User Name & Email */}
            {name && <h2>{name}</h2>}
            {email && <p>{email}</p>}

            <button className={styles.userHomeBtn} onClick={() => navigate('/updateProfile')}>Update Profile</button>
            <button className={`${styles.userHomeBtn} ${styles.logoutBtn}`} onClick={handleLogout}>Logout</button>
        </div>
    );



}