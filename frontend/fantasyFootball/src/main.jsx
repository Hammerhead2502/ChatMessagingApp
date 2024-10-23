import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Home from './components/Home.jsx'
import Login from "./components/LoginComponents/Login.jsx"
import SignUp from "./components/LoginComponents/SignUp.jsx"
import { GoogleOAuthProvider } from "@react-oauth/google";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import ProtectedRoutes from './components/UtilityComponents/ProtectedRoutes.jsx'
import {SocketProvider} from "./components/UtilityComponents/SocketContext.jsx"
import {UserSelectedProvider} from "./components/UtilityComponents/UserSelectedContext.jsx"
import {UserStatusContextProvider} from "./components/UtilityComponents/UserStatusContext.jsx"
import {ConversationContextProvider} from "./components/UtilityComponents/ConversationContext.jsx"
import {GetAllConversationsProvider} from "./components/UtilityComponents/getConversations.jsx"
import {AllUsersContextProvider} from "./components/UtilityComponents/AllUsersContext.jsx"

const router = createBrowserRouter([
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/",
        element: <Home />
    },
    ]
  },
{
  path: "/login",
  element: <Login />
},
{
  path: "/sign-up",
  element: <SignUp />
}
])

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENTID}>
    <SocketProvider>
      <AllUsersContextProvider>
      <UserSelectedProvider>
        <GetAllConversationsProvider>
        <ConversationContextProvider>
        <UserStatusContextProvider>
  <RouterProvider router={router}>  
    </RouterProvider>
    </UserStatusContextProvider>
    </ConversationContextProvider>
    </GetAllConversationsProvider>
    </UserSelectedProvider>
    </AllUsersContextProvider>
    </SocketProvider>   
    </GoogleOAuthProvider>
)
