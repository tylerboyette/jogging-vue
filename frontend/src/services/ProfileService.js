import axios from 'axios'
const ProfileService = {
  update (data) {
    const token = localStorage.getItem('token');
    return axios.put('/profile/me', data, {
      headers:{
        'Authorization': `Bearer ${token}`,
      },
      baseURL: process.env.VUE_APP_BASE_API_URL
    })
  }
}

export default ProfileService
