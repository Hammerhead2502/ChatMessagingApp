import { useState, createContext, useEffect } from "react";

const UserSelectedContext = createContext()

function UserSelectedProvider  ({children}) {
    const [user, setUser] = useState("")
    useEffect(() => {}, [user])
    return <UserSelectedContext.Provider value={{user, setUser}}>
        {children}
    </UserSelectedContext.Provider>
}

export {UserSelectedContext, UserSelectedProvider}