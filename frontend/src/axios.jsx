import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/', // Replace with your backend API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    console.log('Token:', token); // For debugging
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle token expiration and refresh the token if needed
instance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to an expired token (403), try refreshing the token
    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite loop

      try {
        // Send request to backend to refresh the access token using the refresh token from cookies
        const response = await instance.post('/auth/refresh-token', {}, {
          withCredentials: true, // Ensure cookies are sent with the request
        });

        const newAccessToken = response.data.accessToken;

        // Save the new access token to localStorage
        localStorage.setItem('accessToken', newAccessToken);

        // Retry the original request with the new access token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axios(originalRequest); // Retry the original request
      } catch (refreshError) {
        // If refresh fails, log out the user or show an error message
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); // Reject all other errors
  }
);

export default instance;
