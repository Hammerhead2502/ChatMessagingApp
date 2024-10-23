import {createContext, useState} from 'react'

const UserStatusContext = createContext()
const UserStatusContextProvider = ({children}) => {
    const [userStatus, setUserStatus] = useState([])
  return (
    <UserStatusContext.Provider value={{userStatus, setUserStatus}}>
        {children}
    </UserStatusContext.Provider>
  )
}

export {UserStatusContext, UserStatusContextProvider}