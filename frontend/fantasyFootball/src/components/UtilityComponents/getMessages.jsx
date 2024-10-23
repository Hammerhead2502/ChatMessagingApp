import { useEffect, useState } from "react"
import getConversations from "../UtilityComponents/getConversations"

const getMessages = () => {
    const [messages, setMessages] = useState([])
    const {conversation, setConversation} = getConversations()
    useEffect(() => {
        if(conversation && messages == undefined || []){
            setMessages(conversation[0]?.messages)
        }
        }, [conversation, messages ,setMessages])
    return {messages, setMessages}
}

export default getMessages