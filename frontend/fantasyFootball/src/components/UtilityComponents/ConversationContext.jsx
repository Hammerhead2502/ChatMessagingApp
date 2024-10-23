import {createContext} from 'react'
import {UserSelectedContext} from "../UtilityComponents/UserSelectedContext"
import {useContext, useEffect, useState} from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'

const ConversationContext = createContext()

const ConversationContextProvider = ({children}) => {
    const [cookie] = useCookies(["token", "userdata"])
    const {user, setUser} = useContext(UserSelectedContext)
  const [conversation, setConversation] = useState([])
  const getData = async() => {
    await axios.get(`http://localhost:3000/getConversations/${cookie?.userdata?._id}`).then((res) => {
      if(res.status == 200){
        let temp = res?.data?.data.filter((conv) => {
          if(Object.values(conv?.participants[0]).includes(cookie.userdata._id) && Object.values(conv?.participants[0]).includes(user[0]?._id))
              {  
                return conv
              }
      })  
      let val = temp[0]?.participants[0] && Object.values(temp[0]?.participants[0]).includes(cookie.userdata._id) && Object.values(temp[0]?.participants[0]).includes(user[0]?._id)
      if(temp?.length === 0 || val)
          {
           setConversation(temp[0]?.messages)
          }
      }
    })
  }
  useEffect(() => {
    if(user){
      getData()
    }
}, [user])
  return (
    <ConversationContext.Provider value={{conversation, setConversation}}>
      {children}
    </ConversationContext.Provider>
  )
}

export {ConversationContext, ConversationContextProvider}