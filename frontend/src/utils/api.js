import axios from 'axios'

const API_BASE_URL = '/api'

export const uploadPCAP = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Upload failed')
  }
}

export const analyzePCAP = async (filename) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze`, { filename })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Analysis failed')
  }
}

export const downloadReport = async (filename) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/download/${filename}`, {
      responseType: 'blob'
    })
    return response.data
  } catch (error) {
    throw new Error('Download failed')
  }
}
