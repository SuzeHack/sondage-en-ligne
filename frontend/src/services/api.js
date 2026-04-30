import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api',
  headers: { 'Content-Type': 'application/json' }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('pollify_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login:    (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  me:       ()     => API.get('/auth/me'),
};

export const sondagesAPI = {
  getAll:  ()         => API.get('/sondages'),
  getOne:  (id)       => API.get(`/sondages/${id}`),
  create:  (data)     => API.post('/sondages', data),
  update:  (id, data) => API.put(`/sondages/${id}`, data),
  delete:  (id)       => API.delete(`/sondages/${id}`),
  publier: (id)       => API.put(`/sondages/${id}/publier`),
};

export const questionsAPI = {
  create:       (data)         => API.post('/questions', data),
  update:       (id, data)     => API.put(`/questions/${id}`, data),
  delete:       (id)           => API.delete(`/questions/${id}`),
  addOption:    (id, data)     => API.post(`/questions/${id}/options`, data),
  deleteOption: (id, optionId) => API.delete(`/questions/${id}/options/${optionId}`),
};

export const participationsAPI = {
  participer:           (data) => API.post('/participations', data),
  getResultats:         (id)   => API.get(`/participations/sondage/${id}`),
  getMesParticipations: ()     => API.get('/participations/mes-participations'),
};

export const usersAPI = {
  getAll:          ()         => API.get('/users'),
  getOne:          (id)       => API.get(`/users/${id}`),
  changerRole:     (id, role) => API.put(`/users/${id}/role`, { role }),
  supprimer:       (id)       => API.delete(`/users/${id}`),
  getStatistiques: ()         => API.get('/users/statistiques'),
};

export default API;