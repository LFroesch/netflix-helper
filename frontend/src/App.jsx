import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/home/HomePage";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authUser";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import WatchPage from "./pages/WatchPage";
import SearchPage from "./pages/SearchPage";
import SearchHistoryPage from "./pages/SearchHistoryPage";
import NotFoundPage from "./pages/NotFoundPage";
import PersonPage from "./pages/PersonPage";
import WatchlistPage from "./pages/WatchlistPage";
import InfoPage from "./pages/InfoPage";


function App() {
  const {user, isCheckingAuth, authCheck} = useAuthStore()
  useEffect(() => {
    authCheck();
  }, [authCheck])


  if (isCheckingAuth) {
    return (
      <div className="h-screen">
        <div className="flex items-center justify-center h-full bg-black">
          <Loader className="animate-spin text-red-600 size-10"/>
        </div>
      </div>
    )
  }

  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={!user ? <LoginPage/> : <Navigate to={"/"} />} />
      <Route path="/signup" element={!user ? <SignUpPage/> : <Navigate to={"/"} />} />
      <Route path="/watch/:id" element={user ? <WatchPage/> : <Navigate to={"/login"} />} />
      <Route path='/search' element={user ? <SearchPage /> : <Navigate to={"/login"} />} />
      <Route path='/history' element={user ? <SearchHistoryPage /> : <Navigate to={"/login"} />} />
      <Route path='/person/:id' element={user ? <PersonPage /> : <Navigate to={"/login"} />} />
      <Route path='/watchlist' element={user ? <WatchlistPage /> : <Navigate to={"/login"} />} />
      <Route path='/info' element={user ? <InfoPage /> : <Navigate to={"/login"} />} />
      <Route path='/*' element={user? <NotFoundPage/> : <Navigate to={"/login"} />}/>

    </Routes>
    <Footer />
    <Toaster/>
    </>
  )
}

export default App
