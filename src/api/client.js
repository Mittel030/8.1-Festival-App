const API_BASE_URL = '/api'

export const apiClient = {
  async getFeatured() {
    try {
      const response = await fetch(`${API_BASE_URL}/featured.php`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching featured:', error)
      throw error
    }
  },

  async getFestivalInfo() {
    try {
      const response = await fetch(`${API_BASE_URL}/festival-info.php`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching festival info:', error)
      throw error
    }
  },

  async getSchedule(day = 'saturday') {
    try {
      const response = await fetch(`${API_BASE_URL}/schedule.php?day=${day}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching schedule:', error)
      throw error
    }
  },

  async getLocations() {
    try {
      const response = await fetch(`${API_BASE_URL}/locations.php`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching locations:', error)
      throw error
    }
  },
}
