import React from 'react'
import { motion } from "framer-motion"
import { useState, useEffect, useContext } from 'react'
import { useCookies } from 'react-cookie'
import {GetAllConversationsContext} from "../UtilityComponents/getConversations"
import { Menu} from 'lucide-react'
import axios from 'axios'
import SideBarOptions from './SideBarOptions'
import {UserSelectedContext} from "../UtilityComponents/UserSelectedContext"
import { LogOut } from 'lucide-react';
import {AllUsersContext} from "../UtilityComponents/AllUsersContext"

const SideBar = () => {
  const {allUsers, setAllUsers} = useContext(AllUsersContext)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [cookie, setCookie, removeCookie] = useCookies(["token", "userdata"])
  const {allConversations, setAllConversations} = useContext(GetAllConversationsContext)
  const [msg, setMsg] = useState([])
  const { user, setUser } = useContext(UserSelectedContext)
    const handleUser = (e) => {
        e.preventDefault()
        setUser(allUsers.filter((user) => user._id == e.target.value))
   }
   const getUsersData = async () => {
	await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getUsers`).then((res) => {
		if(res.status == 200){
			setAllUsers(res?.data?.data.filter((user) => user._id != cookie?.userdata?._id))
		}
	}).catch((err) => console.log(err))
   }
  useEffect(() => {
	getUsersData()
  }, [setAllUsers])
  useEffect(() => {
    if(allUsers){
      setMsg (allUsers.map((userr) => {
        return allConversations.filter((conv, index) => {
          if(Object.values(conv?.participants[0]).includes(cookie.userdata._id) && Object.values(conv?.participants[0]).includes(userr._id))
              {  
				return conv
              }
      })  
      }))      
  }
  }, [allUsers, setMsg])
 	const handleLogout = async(e) => {
		e.preventDefault()
		await axios.post(`${import.meta.env.VITE_BACKEND_URL}/logout`, {userID : cookie?.userdata?._id}).then((res) => {
		  if(res?.status == 200){
			removeCookie("token")
		removeCookie("userdata")
		window.location.reload()
		  }
		}).catch((err) => console.log("Something went wrong"))
	  }
  return (
    <motion.div
			className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 h-screen ${
				isSidebarOpen ? "w-64" : "w-20"
			}`}
			animate={{ width: isSidebarOpen ? 360 : 80 }}
		>
			<div className='h-full bg-gray-100 p-4 flex flex-col border-r border-gray-300'>
                <div className='grid grid-cols-6'>
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className='p-1 rounded-full hover:bg-white transition-colors max-w-fit inline pt-10'
				>
					<Menu size={24} style={{ color: "black"}} />
				</motion.button>
                {isSidebarOpen && <motion.button initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: "auto" }} transition={{ duration: 0.2, delay: 0.3 }} className='text-black font-semibold text-4xl pt-2'>MDMessenger</motion.button> }
                </div>
								{isSidebarOpen && <motion.h1 initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: "auto" }} transition={{ duration: 0.2, delay: 0.3 }} className='text-black font-semibold text-xl text-center mt-10'>Users List</motion.h1> }
				<nav className='mt-8 flex-grow border-t'>
						<div>
						{allUsers && allUsers.length ? allUsers.map((userr, index) => {
						  return <div key={index}>
							{isSidebarOpen && <SideBarOptions option={userr.fname} value={userr._id} func={handleUser} font={"text-xl font-bold"} messages={msg} index={index}/>}
						  </div>
						}) : <></>}
						
					  </div>			 
				</nav>
				{isSidebarOpen && <LogOut className='text-black cursor-pointer' onClick={handleLogout} size={40}/>}
			</div>
		</motion.div>
  )
}

export default SideBar