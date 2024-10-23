import { useCookies } from 'react-cookie'
import {UserSelectedContext} from "../UtilityComponents/UserSelectedContext"
import {useContext, useEffect, useRef} from "react"
import {SocketContext} from "../UtilityComponents/SocketContext"
import {ConversationContext} from "../UtilityComponents/ConversationContext"

const Chat = () => {
  const {conversation, setConversation} = useContext(ConversationContext)
  const [cookie] = useCookies(["token", "userdata"])
  const {user, setUser} = useContext(UserSelectedContext)
  const {socket, setSocket} = useContext(SocketContext)
  const lastMessage = useRef()
  useEffect(() => {
    setTimeout(() => {
      if(lastMessage.current){
        lastMessage.current.scrollIntoView({behavior : "smooth"})
      }
    }, 100)
  }, [conversation])
  useEffect(() => {
        if(socket){
          socket.on("message",(data) => { 
            setConversation((prev) => {
                return [...prev, data]
            });
        })
        }
        return () => {
          if(socket)
          socket.off("message");
        };
      }, [socket, conversation, setConversation])
  return (
    <>
    {conversation && conversation.length ? conversation.map((msg, index) => {
        return <div key={index} className='' ref={lastMessage}>
            {msg.senderID == cookie.userdata._id && <div className="chat chat-end">
        <div className="chat-bubble bg-[#399918] mr-10 text-white">{msg?.message}</div>
      </div>}
      {msg.senderID == user[0]?._id && <div className="chat chat-start">
        <div className="chat-bubble bg-gray-100 ml-10 text-black">
        {msg?.message}
        </div>
      </div>}
      </div>
    }): user == "" ? <h1 className='p-10'>Select a chat to start messaging</h1> :<div><h1 className='p-10'>Say Hi to start a chat</h1></div>}
</>
  )
}

export default Chat

