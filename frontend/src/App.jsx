import { Route, Routes } from 'react-router-dom'
import './App.css'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Profile from './components/Profile'
import CreateProject from './components/CreateProject'
import Header from './components/Header'
import AllProjectList from './components/AllProjectList'



import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";



function App() {


  return (
    <>
      <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
        <ToastContainer />
        <Header className="fixed top-0 left-0 w-full bg-white shadow-md z-50" />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-project" element={<CreateProject />} />
            <Route path='/all-project' element={<AllProjectList />} />
            {/* You can add a default route or 404 */}
            <Route path="*" element={<h2 className="text-center text-red-500">Page not found</h2>} />
          </Routes>

        </main>
      </div>

    </>
  )
}

export default App
