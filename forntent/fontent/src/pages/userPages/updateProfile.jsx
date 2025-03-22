import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import API from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../slices/userSlice";
import styles from './UpdateProfile.module.css';



export default function(){
    const {email,name,userId} = useSelector(state=>state.user)
    const [message,setMessage]=useState('')
    const [selectedFile,setSelectedFile]=useState(null)
    const navigate=useNavigate()
    const dispatch=useDispatch()


    const updatedName=useRef()
    const updatedEmail=useRef()

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const uploadUserImage= async ()=>{
        if (!selectedFile) return;
        try {
            const formData = new FormData();
            formData.append("profileImage", selectedFile);

            const res = await API.post(`/user/uploadProfile/${userId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("Profile uploaded:", res.data);
            // sessionStorage.setItem("token", res.data.token);
            return res.data.profileImageUrl; // Return the uploaded image URL (if your backend provides it)
        } catch (error) {
            console.error("Error uploading profile image:", error);
            setMessage(error.response.data.message||"Failed to upload profile image.");
            return null;
        }
    }
    const updateUser=async (e)=>{
        e.preventDefault()
        await uploadUserImage()
        try{
            const res=await API.put(`/user/updateUser/${userId}`,
                { name: updatedName.current.value,email: updatedEmail.current.value, })
                console.log(res);
                
            if(res.status==200)
            {
                dispatch(setUser({userId:res.data.updatedUser._id,email:res.data.updatedUser.email,name:res.data.updatedUser.name,imagePath:res.data.updatedUser.profileImage}))
                navigate('/')
            }
            else
                setMessage(res.data)
            console.log(message);
            
        }
        catch(error)
        {
            if (error)
                console.log(error);
            setMessage(error.response.data.message||'profile update failed')
                
        }
    }
    if (!userId) {
        return (
            <div className={styles.updateContainer}>
                <h1>You are not logged in</h1>
                <button className={styles.updateBtn} onClick={() => navigate('/login')}>Login</button>
            </div>
        );
    }

    return (
        <div className={styles.updateContainer}>
            <h2>Update Profile</h2>
            <form onSubmit={updateUser} className={styles.updateForm}>
                <label>Name:</label>
                <input ref={updatedName} type="text" defaultValue={name} required />

                <label>Email:</label>
                <input ref={updatedEmail} type="email" defaultValue={email} required />

                <label>Upload Profile Picture:</label>
                <input type="file" onChange={handleFileChange} accept="image/*" className={styles.fileInput} />

                <button type="submit" className={styles.updateBtn}>Submit</button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );

}