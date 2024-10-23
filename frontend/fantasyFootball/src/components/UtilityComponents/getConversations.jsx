import {createContext, useEffect, useState} from 'react'
import { useCookies } from 'react-cookie'
import axios from "axios"

const GetAllConversationsContext = createContext()

const GetAllConversationsProvider = ({children}) => {
    const [cookie] = useCookies(["token", "userdata"])
    const [allConversations, setAllConversations] = useState([]) 
    const getData = async() => {
        await axios.get(`http://localhost:3000/getConversations/${cookie?.userdata?._id}`).then((res) => {
            if(res.status == 200){
                setAllConversations(res?.data?.data)
            }
        })
    }
    useEffect(() => {
        if(cookie?.userdata?._id)
        {
            getData()
        }
    }, [cookie?.userdata?._id])
    useEffect(() => {}, [setAllConversations, allConversations, getData])
    return <GetAllConversationsContext.Provider value={{allConversations, setAllConversations}}>
        {children}
    </GetAllConversationsContext.Provider>
}

export {GetAllConversationsProvider, GetAllConversationsContext}