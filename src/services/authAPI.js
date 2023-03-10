import Axios from 'axios'
import jwtDecode from 'jwt-decode'
import { LOGIN_API } from '../config'

function authenticate(credentials)
{
    return Axios
            .post(LOGIN_API, credentials)
            // promesse
            .then(response => response.data.token)
            // réponse
            .then(token => {
                window.localStorage.setItem('authToken', token)
                // ajouter à axios pour chaque req, le bearer token avec notre token
                Axios.defaults.headers["Authorization"]="Bearer " + token
                // par défault je défini le token dans le header
                return true
                // {}donc return obligatoire
            })
}

function logout()
{
    window.localStorage.removeItem('authToken')
    delete Axios.defaults.headers['Authorization']
}

function setup()
{
    // voir si on a un token
    const token = window.localStorage.getItem('authToken')
    if(token)
    {
        const jwtData = jwtDecode(token)
        // millisecondes vs secondes
        if((jwtData.exp * 1000) > new Date().getTime())
        {
            Axios.defaults.headers["Authorization"]="Bearer " + token
            // s'assurer que si le token est valide je remet le token dans le header
        }
    }
}

function isAuthenticated()
{
    const token = window.localStorage.getItem('authToken')
    if(token)
    {
        const jwtData = jwtDecode(token)
        // millisecondes vs secondes
        if((jwtData.exp * 1000) > new Date().getTime())
        {
            return true // ok
        }
        return false // token expiré
    }
    return false // pas de token
}

export default {
    authenticate: authenticate,
    logout: logout,
    setup: setup,
    isAuthenticated : isAuthenticated
}