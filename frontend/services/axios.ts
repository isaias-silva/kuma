import axios from "axios";

const axiosService = axios.create({ baseURL: 'http://localhost:8080' })
export default axiosService