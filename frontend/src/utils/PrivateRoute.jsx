import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({children}) => {

    const {user, loading} = useAuth();

    if(loading) return <p>Loading....</p>

    if(!user) return <Navigate to="/signin" />



  return children;
}

export default PrivateRoute;
