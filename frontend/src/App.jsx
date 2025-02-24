import { Route, Routes } from 'react-router-dom'
import './App.css'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Profile from './components/Profile'
import CreateProject from './components/CreateProject'



function App() {


  return (
    <>
      
      <Routes>
        <Route path='/signin' element={<SignIn />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-project" element={<CreateProject />} />
        {/* You can add a default route or 404 */}
        <Route path="*" element={<h2>Page not found</h2>} />
      </Routes>
    </>
  )
}

export default App
