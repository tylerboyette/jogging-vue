import axios from 'axios'

const AuthService = {
  login (email, password) {
    return axios.post('/auth/login', {
      email,
      password
    }, {
      baseURL: process.env.VUE_APP_BASE_API_URL
    })
  },
  signup (data) {
    return axios.post('/auth/signup/', data, {
      baseURL: process.env.VUE_APP_BASE_API_URL
    })
  }
}

export default AuthService
