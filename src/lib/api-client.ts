const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface FetchOptions extends RequestInit {
    token?: string;
}

class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private getHeaders(token?: string): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const error = await response.json().catch(() => ({
                message: response.statusText,
            }));
            throw new Error(error.message || 'API request failed');
        }

        return response.json();
    }

    async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'GET',
            headers: this.getHeaders(options?.token),
            ...options,
        });

        return this.handleResponse<T>(response);
    }

    async post<T>(
        endpoint: string,
        data?: unknown,
        options?: FetchOptions
    ): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            headers: this.getHeaders(options?.token),
            body: JSON.stringify(data),
            ...options,
        });

        return this.handleResponse<T>(response);
    }

    async put<T>(
        endpoint: string,
        data?: unknown,
        options?: FetchOptions
    ): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'PUT',
            headers: this.getHeaders(options?.token),
            body: JSON.stringify(data),
            ...options,
        });

        return this.handleResponse<T>(response);
    }

    async patch<T>(
        endpoint: string,
        data?: unknown,
        options?: FetchOptions
    ): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'PATCH',
            headers: this.getHeaders(options?.token),
            body: JSON.stringify(data),
            ...options,
        });

        return this.handleResponse<T>(response);
    }

    async delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'DELETE',
            headers: this.getHeaders(options?.token),
            ...options,
        });

        return this.handleResponse<T>(response);
    }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
