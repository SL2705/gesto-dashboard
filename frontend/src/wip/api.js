import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

export async function fetchWipDashboard(family) {
  const { data } = await axios.get(`${API_BASE_URL}/wip/dashboard/${family}/`)
  return data
}

export async function fetchStageDetails(family, stage) {
  const { data } = await axios.get(`${API_BASE_URL}/wip/stage-details/${family}/${stage}/`)
  return data
}
