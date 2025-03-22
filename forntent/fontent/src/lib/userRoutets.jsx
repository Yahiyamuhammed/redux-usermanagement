import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/userPages/home";
import Login from "../pages/userPages/login";
import SignUp from "../pages/userPages/signUp";
import UpdateProfile from "../pages/userPages/updateProfile";
import AdminHome from "../pages/adminPages/adminHome";
import UpdateAdminUser from "../pages/adminPages/updateAdminUser";
import AdminCreateUser from "../pages/adminPages/adminCreateUser";
import AdminLogin from "../pages/adminPages/adminLogin";
const router=createBrowserRouter([
    {
        path:'',
        element:<Home/>
    },
    {
        path:'/login',
        element:<Login/>
    },
    {
        path:'/signup',
        element:<SignUp/>
    },
    {
        path:'/updateProfile',
        element:<UpdateProfile/>
    },
    {
        path:'/admin',
        element:< AdminHome />
    },
    {
        path:'/admin/adminUpdateUser/:id',
        element:<UpdateAdminUser/>
    },
    {
        path:'/admin/adminCreateUser',
        element:<AdminCreateUser/>
    },
    {
        path:'/admin/adminLogin',
        element: <AdminLogin/>
    }
])

export default router