import axios from 'axios'

const BASE_API_URL = 'http://localhost:3000/api'
const AuthService = {
  login (email, password) {
    return axios.post('/auth/login', {
      email,
      password
    }, {
      baseURL: BASE_API_URL
    })
  },
  signup (data) {
    return axios.post('/auth/signup/', data, {
      baseURL: BASE_API_URL
    })
  }
}

export default AuthService
