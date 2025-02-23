import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
      },
});


//Request Interceptor
axiosInstance.interceptors.request.use(
    (config) =>{
        const token = localStorage.getItem('accessToken');

        if(token){
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config;
    },
    (error) =>{
        return Promise.reject(error);
    }
);


// Response Interceptor for handling token refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if(error.response.status === 403 && !originalRequest._retry){
            originalRequest._retry = true;

            try{
               // Send request to backend to refresh the access token using the refresh token from cookies
                const response = await axios.post('/auth/refresh-token', {}, {
                    withCredentials: true, // Ensure cookies are sent with the request
                    });
                    const newAccessToken = response.data.accessToken;

                    // Save the new access token to localStorage
                    localStorage.setItem('accessToken', newAccessToken);
            
                    // Retry the original request with the new access token
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axios(originalRequest);
            }catch(refreshError){
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);

    }
);

export default axiosInstance;