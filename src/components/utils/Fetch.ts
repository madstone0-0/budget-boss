import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from "axios";
import { API_BASE } from "../constants";
import useStore from "../stores";
import { IFetch } from "../types";

class Fetch implements IFetch {
    private instance: AxiosInstance;
    constructor() {
        const instance = axios.create({
            baseURL: API_BASE,
            headers: {
                Accept: "application/json",
            },
        });
        instance.interceptors.response.use(
            this.handleSuccess,
            this.handleError,
        );
        this.instance = instance;
    }

    handleSuccess(res: AxiosResponse) {
        return res;
    }

    handleError(error: AxiosError) {
        // switch (error.response?.status) {
        //     case 401:
        //         this.setAuth(false);
        //         break;
        //     default:
        //         break;
        // }
        console.log(`Error: ${error}`);
        return Promise.reject(error);
    }

    // redirectTo(path: string) {
    //
    // }

    async get(url: string, options?: AxiosRequestConfig) {
        const res = await this.instance.get(url, { ...options });
        return res;
    }

    async post(url: string, data: any, options?: AxiosRequestConfig) {
        const res = await this.instance.post(url, data, { ...options });
        return res;
    }

    async put(url: string, data: any, options?: AxiosRequestConfig) {
        const res = await this.instance.put(url, data, { ...options });
        return res;
    }

    async delete(url: string, options?: AxiosRequestConfig) {
        const res = await this.instance.delete(url, { ...options });
        return res;
    }
}

export const fetch = new Fetch();
export default Fetch;
