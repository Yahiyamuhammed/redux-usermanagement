import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOutAdmin, setAdmin } from "../../slices/adminSlice";
import adminAPI from "../../api/axiosAdminInstance";
import styles from './AdminHome.module.css';


export default  function(){
    const [users,setusers]=useState([])
    const [ogUsers,setOgUsers]=useState('')
    const searchRef=useRef()
    const navigate=useNavigate()
    const {isSignedIn}=useSelector((state)=>state.admin)
    const dispatch=useDispatch()
    const token=sessionStorage.getItem("adminToken")


    console.log('this is to show logged in ',isSignedIn);
    useEffect(() => {
        console.log("Updated isSignedIn after logout:", isSignedIn);
    }, [isSignedIn]); 

    useEffect(() => {
        if (!token) 
            return;
        const fetchData = async () => {
            try {
                const res = await adminAPI.get('/admin/viewUser',{token});
                console.log('token already availiable');

                dispatch(setAdmin())
                
                setusers(res.data);
                setOgUsers(res.data)
                console.log(res.data);
                
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchData();
    }, [isSignedIn]);
    const deleteUser=async (id)=>{
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) 
            return;

        try {
            const res=await adminAPI.delete(`/admin/adminDeleteUser/${id}`)
            setusers((prev)=>prev.filter(val=>val._id!=id))
            setOgUsers((prev) => prev.filter((val) => val._id !== id)); 
            console.log(users,ogUsers,'thjis are users after delte')
        } catch (error) {
            
        }
    }
    const handleSearch=async (e)=>{
        e.preventDefault()
        console.log('got inside handle search');
        
            // e.preventDefault()
        try {
            // setOgUsers(users)
            // if (ogUsers.length === 0) {
            //     setOgUsers(users);
            // }
            const res=await adminAPI.post('/admin/userSearch',{name:searchRef.current.value})
            console.log(res.data)
            if(res.status==200)
            {   
                
                setusers(res.data.result)
            }
               
        } catch (error) {
            if (error.response) {
                console.log("Error Status:", error.response.status);
                console.log("Error Message:", error.response.data.message);
                setusers('')
                
            } else {
                console.log("Server Error:", error);
                
            }
        }
       
    }
    const handleCancel =()=>{
        setusers(ogUsers)
        searchRef.current.value=''
    }
    if (!token) {
        return (
            <div className={styles.loginPrompt}>
                <h1>You are not logged in</h1>
                <button onClick={() => navigate("/admin/adminLogin")} className={styles.btn}>Login</button>
            </div>
        );
    }

    return (
        <div className={styles.adminContainer}>
            <h1 className={styles.adminTitle}>Admin Dashboard</h1>

            <div className={styles.adminActions}>
                <button onClick={() => navigate("/admin/adminCreateUser")} className={styles.primaryBtn}>Create User</button>
                
                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <input ref={searchRef} type="text" placeholder="Search users..." className={styles.searchInput} />
                    <button type="submit" className={styles.searchBtn}>Search</button>
                </form>

                <button onClick={handleCancel} className={styles.secondaryBtn}>Cancel Search</button>
                <button
                    onClick={() => {
                        dispatch(logOutAdmin());
                        sessionStorage.removeItem("adminToken");
                    }}
                    className={styles.dangerBtn}
                >
                    Logout
                </button>
            </div>

            {users.length > 0 ? (
                <div className={styles.userGrid}>
                    {users.map((val) => (
                        <div key={val._id} className={styles.userCard}>
                            <div className={styles.imageContainer}>
                                {val.profileImage ? (
                                    <img src={`http://localhost:3000/${val.profileImage}`} alt="Profile" className={styles.profileImage} />
                                ) : (
                                    <div className={styles.placeholderImage}>No Image</div> 
                                )}
                            </div>
                            <h3>{val.name}</h3>
                            <p>Email: {val.email}</p>
                            <p>ID: {val._id}</p>
                            <div className={styles.cardButtons}>
                                <button
                                    onClick={() => navigate(`/admin/adminUpdateUser/${val._id}`, { state: { name: val.name, email: val.email } })}
                                    className={styles.editBtn}
                                >
                                    Update User
                                </button>
                                <button onClick={() => deleteUser(val._id)} className={styles.deleteBtn}>
                                    Delete User
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className={styles.noUsers}>No users found</p>
            )}
        </div>
    );

}