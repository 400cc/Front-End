import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface ICommunication {
	get(url: string, config?: any): Promise<any>;

	put(url: string, data: any, config?: any): Promise<any>;

	post(url: string, data: any, config?: any): Promise<any>;

	delete(url: string, config?: any): Promise<any>;
}

export class Http implements ICommunication {
	httpClient: AxiosInstance;

	constructor() {
		const axiosConfig = {
			// baseURL: import.meta.env.VITE_BASE_URL,
			// baseURL: 'http://localhost:8080',
			baseURL: 'https://api.400cc.araas.ai',
			withCredentials: false,
		};
		this.httpClient = axios.create(axiosConfig);
	}

	async get(url: string, config?: AxiosRequestConfig<any>) {
		return this.httpClient.get(url, {
			...config,
		});
	}

	async post(url: string, data: any, config?: AxiosRequestConfig<any>) {
		return this.httpClient.post(url, data, {
			...config,
		});
	}

	async put(url: string, data: any, config?: AxiosRequestConfig<any>) {
		return this.httpClient.put(url, data, {
			...config,
		});
	}

	async delete(url: string, config?: AxiosRequestConfig<any>) {
		return this.httpClient.delete(url, {
			...config,
		});
	}
}
