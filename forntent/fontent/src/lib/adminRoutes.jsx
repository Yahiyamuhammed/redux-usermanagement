import { createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Home from "../pages/adminPages/adminHome";

const adminRoputer=createRoutesFromElements([
    {
        path:'/admin',
        element:<Home />
    }
])

export default adminRoputer