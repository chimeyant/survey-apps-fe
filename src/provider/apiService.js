import axios from "axios";
import AuthProviders from "./authProviders";

class ApiService {
    constructor() {
        const apiUrl = import.meta.env.VITE_API_URL;
        const auth = new AuthProviders();

        this.axiosInstance = axios.create({
            baseURL: apiUrl,
            timeout: 6000,
        });

        this.axiosInstance.interceptors.request.use(
            (config) => {
                // Add authorization header if the user is authenticated
                if (auth.logged && auth.token) {
                    config.headers.Authorization = auth.token;
                }

                if (config.headers["Content-Type"] === "multipart/form-data") {
                    config.headers["Content-Type"] = undefined;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        this.axiosInstance.interceptors.response.use(
            (response) => {
                if (
                    response.onUploadProgress &&
                    typeof response.onUploadProgress === "function"
                ) {
                    response.onUploadProgress({
                        loaded: 0,
                        total: 0,
                        percentCompleted: 0,
                    });
                }
                return response;
            },
            (error) => Promise.reject(error)
        );
    }

    async get(endpoint, params) {
        try {
            const response = await this.axiosInstance.get(endpoint, { params });
            return {
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async post(endpoint, payload) {
        try {
            const response = await this.axiosInstance.post(endpoint, payload);
            return {
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async put(endpoint, payload) {
        try {
            const response = await this.axiosInstance.put(endpoint, payload);
            return {
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async delete(endpoint) {
        try {
            const response = await this.axiosInstance.delete(endpoint);
            return {
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async uploadFile(file, doctype, onProgress) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder_name", doctype);

        try {
            const response = await this.axiosInstance.post(
                "api/v1/media-file/upload",
                formData,
                {
                    timeout: 30000,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);

                        if (onProgress) {
                            onProgress(progress)
                        }
                    }
                }
            );

            return {
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async downloadFile(url) {
        try {
            const response = await this.axiosInstance.get(url, {
                responseType: "blob",
                timeout: 60000,
            });
            return response;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export default new ApiService();
