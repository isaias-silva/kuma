import axios from "axios";

const axiosService = axios.create({ baseURL: 'http://localhost:8081' })
export default axiosService