import {useEffect, useContext} from 'react'
import { useCookies } from 'react-cookie'
import ChatWindow from './ChatComponents/ChatWindow'
import { io } from "socket.io-client";
import { SocketContext } from './UtilityComponents/SocketContext';
import SideBar from "./HomeComponents/SideBar"

const Home = () => {
  const {socket, setSocket} = useContext(SocketContext)
  const [cookie, setCookie, removeCookie] = useCookies(["token", "userdata"])
  useEffect(() => {
    if(cookie?.userdata){
      const socket = io(import.meta.env.VITE_BACKEND_URL, {
        query: {
          userID: cookie?.userdata?._id,
    }});
    socket.on("connect", () => {
      // console.log(socket.id); 
    })
    setSocket(socket)
    return () => socket.disconnect()
    }   
  }, [cookie?.userdata])
  return (
    <div className='flex h-screen text-white'>
      <div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-white' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div>
    <SideBar />
    <ChatWindow />
    </div>
  )
}

export default Home
