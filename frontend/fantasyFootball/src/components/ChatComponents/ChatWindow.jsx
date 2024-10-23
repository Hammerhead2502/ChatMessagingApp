import {useState, useEffect, useContext} from 'react'
import { useCookies } from 'react-cookie'
import axios from "axios"
import {UserSelectedContext} from "../UtilityComponents/UserSelectedContext"
import Chat from './Chat'
import {ConversationContext} from "../UtilityComponents/ConversationContext"
import {SocketContext} from "../UtilityComponents/SocketContext"
import {UserStatusContext} from "../UtilityComponents/UserStatusContext"
import { SendHorizontal } from 'lucide-react';
import AIReply from "../ChatComponents/AIReply"

const ChatWindow = () => {
  const {socket, setSocket} = useContext(SocketContext)
  const {user, setUser} = useContext(UserSelectedContext)
  const {conversation, setConversation} = useContext(ConversationContext)
  const [cookie] = useCookies(["token", "userdata"])
  const {userStatus, setUserStatus} = useContext(UserStatusContext)
  const [lastSeen, setLastSeen] = useState({
    time: "",
    date: ""
  })
    const [message, setMessage] = useState("")
      const handleMessage = (e) => {
        setMessage(e.target.value)
      }
      const sendMessage = async(e) => {
        e.preventDefault()
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/send-message`, {senderID: cookie?.userdata?._id, recipientID: user[0]?._id, message: message }).then((res) => {
          if(res.status == 200){
            if(conversation === undefined){
              setConversation([])
              setConversation((prev) => {
                return [...prev, res?.data?.data]
              })
            }
            else{
              setConversation((prev) => {
                return [...prev, res?.data?.data]
              })
            }
            setMessage("")
          }
        }).catch((err) => console.log(err))
      }
      useEffect(() => {
        if(socket){
          socket.on("online users", (data) => {
            setUserStatus(data)
          })
        }
      }, [socket, setUserStatus])
      useEffect(() => {
        if(userStatus && user){
          let temp = new Date(userStatus[user[0]?._id]?.lastSeen)
          setLastSeen((prev) => {
            return {...prev, time: temp.toLocaleTimeString(["en", "US"], {
              hour: "2-digit",
              minute: "2-digit"
            }), date: temp.toLocaleDateString()}
          })
        }
      }, [userStatus, user])
    const getSelectedUserStatus = async () => {
      if(user[0]?._id){
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/getUser`, {userID: user[0]?._id}).then((res) => {
          if(res.status == 200){
            setUserStatus((prev) => {
              return {...prev, [user[0]?._id]:res?.data?.data}})
          }
        }).catch((err) => console.log(err))
      }
      }
      useEffect(() => {
        if(user){
          getSelectedUserStatus()
        }
      }, [user])
      return (
    <div className='flex-1 overflow-auto relative z-10 text-black text-center'>
      <div className='bg-gray-100 text-black'>
      {user && user.length ? <h1 className='text-md pt-4'>{user?.[0]?.fname}</h1> : <></>}
    {userStatus[user[0]?._id] ? <div><p className='text-sm mb-4'>{userStatus[user[0]?._id]?.status == "Offline" ? `Last seen ${lastSeen.date} at ${lastSeen.time}` : userStatus[user[0]?._id]?.status}</p><hr /></div> : <></>}
    </div>
    <div className={conversation?.length == 0 || conversation == undefined ? "" : ""} id='chat'>
      <Chat />
    </div>
    {user != "" ? <div className='flex-1 items-center justify-center sticky top-[100vh] mt-2 w-full bg-gray-100 py-4'>
    <input type='text' placeholder='Message' onChange={handleMessage} value={message} className='focus:outline-none border-none rounded-full h-10 inline w-3/5 bg-white pl-6'/>
    <SendHorizontal className='text-gray-400 inline ml-3 relative right-20 cursor-pointer' onClick={sendMessage} disabled={message === ""}/>
    <AIReply />
    </div> : <></>}
    </div>
  )
}

export default ChatWindow