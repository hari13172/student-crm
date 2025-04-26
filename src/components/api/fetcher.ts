import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { AuthorizedHeader } from "./header";

class ApiService {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor(baseURL: string, headers: Record<string, string> = {}) {
    this.baseURL = baseURL;
    this.headers = headers;
  }

  // Helper method to make API calls
  private async makeRequest<T>(
    method: "get" | "post" | "put" | "delete",
    endpoint: string,
    data: any = null,
    customHeaders: Record<string, string> = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: AxiosRequestConfig = {
      method,
      url,
      headers: { ...this.headers, ...customHeaders },
      data,
    };

    try {
      const response: AxiosResponse<T> = await axios(config);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Use the server's error message directly
          const { data, status } = error.response;
          const errorMessage = data.detail || "An error occurred";
          throw new Error(`${status}: ${errorMessage}`);
        } else if (error.request) {
          // No response received from the server
          throw new Error("No response received from the server");
        } else {
          // Request setup error
          throw new Error(`Request setup error: ${error.message}`);
        }
      } else {
        // Handle non-Axios errors
        throw new Error(`Unknown error: ${error.message}`);
      }
    }
  }

  // Utility function to build URL with query parameters
  buildUrl(
    url: string,
    page?: number,
    size?: number,
    sort?: string,
    filters?: Record<string, any>,
    search?: string
  ): string {
    try {
      const queryParams = new URLSearchParams();
      if (page !== undefined) queryParams.append("page", page.toString());
      if (size !== undefined) queryParams.append("size", size.toString());
      if (sort) queryParams.append("sort", sort);
      if (filters && Object.keys(filters).length > 0) {
        queryParams.append("filters", JSON.stringify(filters));
      }
      if (search) queryParams.append("search", search);

      return `${url}?${queryParams.toString()}`;
    } catch (error) {
      throw error;
    }
  }

  // GET request with query parameters
  get<T>(
    endpoint: string,
    {
      page,
      size,
      sort,
      filters,
      search,
    }: {
      page?: number;
      size?: number;
      sort?: string;
      filters?: Record<string, any>;
      search?: string;
    } = {},
    customHeaders: Record<string, string> = {},
    props: Record<string, any> = {}
  ): UseQueryResult<T> {
    const url = this.buildUrl(endpoint, page, size, sort, filters, search);
    return useQuery<T>({
      queryKey: [endpoint, page, size, sort, filters], // Include query params in the query key
      queryFn: () => this.makeRequest<T>("get", url, null, customHeaders),
      retry: 1,
      ...props,
    });
  }

  // POST request
  post<T>(
    endpoint: string,
    customHeaders: Record<string, string> = {},
    action?: { onSuccess?: (data: T) => void; onError?: (error: Error) => void }
  ): UseMutationResult<T, Error, any> {
    return useMutation<T, Error, any>({
      mutationFn: (data: any) =>
        this.makeRequest<T>("post", endpoint, data, customHeaders),
      onSuccess: action?.onSuccess,
      onError: action?.onError,
    });
  }

  // PUT request
  put<T>(
    endpoint: string,
    customHeaders: Record<string, string> = {},
    action?: { onSuccess?: (data: T) => void; onError?: (error: Error) => void }
  ): UseMutationResult<T, Error, any> {
    return useMutation<T, Error, any>({
      mutationFn: (data: any) =>
        this.makeRequest<T>("put", endpoint, data, customHeaders),
      onSuccess: action?.onSuccess,
      onError: action?.onError,
    });
  }

  // DELETE request
  delete<T>(
    endpoint: string,
    customHeaders: Record<string, string> = {},
    action?: { onSuccess?: (data: T) => void; onError?: (error: Error) => void }
  ): UseMutationResult<T, Error, void> {
    return useMutation<T, Error, void>({
      mutationFn: (data: any) =>
        this.makeRequest<T>("delete", endpoint, data, customHeaders),
      onSuccess: action?.onSuccess,
      onError: action?.onError,
    });
  }

  // Download file
  async download(
    endpoint: string,
    {
      page,
      size,
      sort,
      filters,
      search,
    }: {
      page?: number;
      size?: number;
      sort?: string;
      filters?: Record<string, any>;
      search?: string;
    } = {},
    customHeaders: Record<string, string> = {}
  ): Promise<Blob> {
    const url = this.buildUrl(endpoint, page, size, sort, filters, search);
    try {
      const response = await axios.get(this.baseURL + url, {
        headers: { ...this.headers, ...customHeaders },
        responseType: "blob",
      });
      const blob = new Blob([response.data]);
      return blob;
    } catch (error) {
      throw error;
    }
  }
}

const api = new ApiService(
  import.meta.env.VITE_APP_API_URL,
  AuthorizedHeader()
);

export { api };
