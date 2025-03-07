/* eslint-disable react/prop-types */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Auth from "./pages/auth/Auth"
import Chat from "./pages/chat/Chat"
import Profile from "./pages/profile/Profile"
import "@/App.css"
import { useAppStore } from "./store"
import { useEffect, useState } from "react"
import { apiClient } from "./lib/apiClient"
import { GET_USER_INFO } from "./utils/constans"

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore()
  const isAuthenticated = !!userInfo
  // if (!isAuthenticated) console.log("Access denied. Please log in to continue.")
  return isAuthenticated ? children : <Navigate to='/auth' />
}

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore()
  const isAuthenticated = !!userInfo
  return isAuthenticated ? <Navigate to='/chat' /> : children;
}

function App() {
  const { userInfo, setUserInfo } = useAppStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, { withCredentials: true })
        // console.log(response);
        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data)
        } else {
          setUserInfo(undefined)
        }
      } catch (error) {
        console.log(error);
        setUserInfo(undefined)
      } finally {
        setLoading(false)
      }
    }
    if (!userInfo) {
      getUserData()
    } else {
      setLoading(false)
    }
  }, [userInfo, setUserInfo])

  if (loading) {
    return <div>loading...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          } />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          } />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
        <Route path="/*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
