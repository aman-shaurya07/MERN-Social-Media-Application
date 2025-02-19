import React from 'react'
import {Link} from "react-router-dom"
import { useEffect, useState } from "react";


const Navbar = () => {

    const [user, setUser] = useState(null);

    // useEffect(() => {
    //     const storedUser = localStorage.getItem("user");
    //     try {
    //         setUser(storedUser ? JSON.parse(storedUser) : null);
    //     } catch (error) {
    //         console.error("Error parsing localStorage user:", error);
    //         setUser(null);
    //     }
    // }, []);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        setUser(storedUserId);
    }, []);

    console.log(user);
    

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setUser(null);
    }

    return (

        <div className="h-24 flex items-center justify-between">
            
            <div className=" w-[20%] text-blue-500">
                <Link to="/">SOCIALINK</Link>
            </div>


            <div className="hidden md:flex w-[50%] text-sm items-center justify-between "></div>

            
            {user? (
                <div className="w-[30%] flex items-center justify-end  gap-4">
                    <Link to="/profile">Profile</Link>
                    <Link onClick = {handleLogout}>Logout</Link>
                </div>
            ):(
                <div className="w-[30%] flex items-center justify-end gap-4">
                    <Link to="/login">Login/Register</Link>
                </div>
            )}

        </div>
    )
}

export default Navbar
