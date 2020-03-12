import axios from 'axios'

const BASE_API_URL = 'http://localhost:3000/api'
const ProfileService = {
  update (data) {
    const token = localStorage.getItem('token');
    return axios.put('/profile/me', data, {
      headers:{
        'Authorization': `Bearer ${token}`,
      },
      baseURL: BASE_API_URL
    })
  }
}

export default ProfileService
