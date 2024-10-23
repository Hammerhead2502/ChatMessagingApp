import { createContext, useState } from 'react'

const AllUsersContext = createContext()

const AllUsersContextProvider = ({children}) => {
    const [allUsers, setAllUsers] = useState([])
  return (
    <AllUsersContext.Provider value={{allUsers,setAllUsers}}>
        {children}
    </AllUsersContext.Provider>
  )
}

export {AllUsersContext, AllUsersContextProvider}