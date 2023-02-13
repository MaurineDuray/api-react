import { Navigate} from 'react-router-dom'
import { useContext } from 'react'
// useContext = hook
import AuthContext from '../contexts/AuthContext'

const PrivateRoute = (props) => {

    const {isAuthenticated} = useContext(AuthContext)

    return isAuthenticated ? (
        props.children
        // retourne l'enfant
    ) : (
        <Navigate to="/login" />
        // redirection
    )
}

export default PrivateRoute