import axios from 'axios'

const BASE_API_URL = 'http://localhost:3000/api'

const EntryService = {
  list () {
    const token = localStorage.getItem('token');
    return axios.get('/entries', {
      headers:{
        'Authorization': `Bearer ${token}`,
      },
      baseURL: BASE_API_URL
    })
  },
  get(id) {
    const token = localStorage.getItem('token');
    return axios.get(`entries/${id}/`, {
      headers:{
        'Authorization': `Bearer ${token}`,
      },
      baseURL: BASE_API_URL
    })
  },
  create(data) {
    const token = localStorage.getItem('token');
    return axios.post(`entries/`, data, {
      headers:{
        'Authorization': `Bearer ${token}`,
      },
      baseURL: BASE_API_URL
    })
  },
  update(id, data) {
    const token = localStorage.getItem('token');
    return axios.put(`entries/${id}/`, data, {
      headers:{
        'Authorization': `Bearer ${token}`,
      },
      baseURL: BASE_API_URL
    })
  },
  delete(id) {
    const token = localStorage.getItem('token');
    return axios.delete(`entries/${id}/`, {
      headers:{
        'Authorization': `Bearer ${token}`,
      },
      baseURL: BASE_API_URL
    })
  },
  report(){
    const token = localStorage.getItem('token');
    return axios.get("entries/report", {
      headers:{
        'Authorization': `Bearer ${token}`,
      },
      baseURL: BASE_API_URL
    })
  }
}

export default EntryService
