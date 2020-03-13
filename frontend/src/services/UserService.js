import axios from 'axios'

const UserService = {
  list () {
    const token = localStorage.getItem('token');
    return axios.get('/users', {
      headers:{
        'Authorization': `Bearer ${token}`,
      },
      baseURL: process.env.VUE_APP_BASE_API_URL
    })
  },
  get(id) {
    const token = localStorage.getItem('token');
    return axios.get(`users/${id}/`, {
      headers:{
        'Authorization': `Bearer ${token}`,
      },
      baseURL: process.env.VUE_APP_BASE_API_URL
    })
  },
  create(data) {
    const token = localStorage.getItem('token');
    return axios.post(`users/`, data, {
      headers:{
        'Authorization': `Bearer ${token}`,
      },
      baseURL: process.env.VUE_APP_BASE_API_URL
    })
  },
  update(id, data) {
    const token = localStorage.getItem('token');
    return axios.put(`users/${id}/`, data, {
      headers:{
        'Authorization': `Bearer ${token}`,
      },
      baseURL: process.env.VUE_APP_BASE_API_URL
    })
  },
  delete(id) {
    const token = localStorage.getItem('token');
    return axios.delete(`users/${id}/`, {
      headers:{
        'Authorization': `Bearer ${token}`,
      },
      baseURL: process.env.VUE_APP_BASE_API_URL
    })
  },
}

export default UserService
