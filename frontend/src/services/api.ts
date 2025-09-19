/**
 * API service for CORE OPC Calculator
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  AuthResponse, 
  LoginRequest, 
  User, 
  Product, 
  Customer, 
  OverpackBox,
  EnhancedShippingCalculation,
  ItemRequest
} from '../types';

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8002',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    // Load token from localStorage on initialization
    this.loadToken();
  }

  private loadToken(): void {
    this.token = localStorage.getItem('access_token');
  }

  private saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  private clearToken(): void {
    this.token = null;
    localStorage.removeItem('access_token');
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/api/v1/auth/login', credentials);
    this.saveToken(response.data.access_token);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/api/v1/auth/me');
    return response.data;
  }

  async refreshToken(): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/api/v1/auth/refresh');
    this.saveToken(response.data.access_token);
    return response.data;
  }

  logout(): void {
    this.clearToken();
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Product methods
  async getProducts(params?: {
    customer_id?: string;
    active_only?: boolean;
    page?: number;
    size?: number;
  }): Promise<{ data: Product[]; total: number; page: number; size: number }> {
    const response: AxiosResponse<Product[]> = await this.api.get('/api/v1/products/', { params });
    return {
      data: response.data,
      total: response.data.length,
      page: 1,
      size: response.data.length
    };
  }

  async getProductById(id: number): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.get(`/api/v1/products/${id}`);
    return response.data;
  }

  async getProductBySku(sku: string, customerId?: string): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.get(`/api/v1/products/sku/${sku}`, {
      params: { customer_id: customerId }
    });
    return response.data;
  }

  async createProduct(product: Partial<Product>): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.post('/api/v1/products/', product);
    return response.data;
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.put(`/api/v1/products/${id}`, product);
    return response.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.api.delete(`/api/v1/products/${id}`);
  }

  // Customer methods
  async getCustomers(active_only: boolean = true): Promise<Customer[]> {
    const response: AxiosResponse<Customer[]> = await this.api.get('/api/v1/customers/', {
      params: { active_only }
    });
    return response.data;
  }

  async getCustomerById(id: string): Promise<Customer> {
    const response: AxiosResponse<Customer> = await this.api.get(`/api/v1/customers/${id}`);
    return response.data;
  }

  async createCustomer(customer: Partial<Customer>): Promise<Customer> {
    const response: AxiosResponse<Customer> = await this.api.post('/api/v1/customers/', customer);
    return response.data;
  }

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    const response: AxiosResponse<Customer> = await this.api.put(`/api/v1/customers/${id}`, customer);
    return response.data;
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.api.delete(`/api/v1/customers/${id}`);
  }

  // Overpack Box methods
  async getOverpackBoxes(params?: {
    customer_id?: string;
    active_only?: boolean;
    page?: number;
    size?: number;
  }): Promise<{ data: OverpackBox[]; total: number; page: number; size: number }> {
    const response: AxiosResponse<OverpackBox[]> = await this.api.get('/api/v1/overpack-boxes/', { params });
    return {
      data: response.data,
      total: response.data.length,
      page: 1,
      size: response.data.length
    };
  }

  async getOverpackBoxById(id: number): Promise<OverpackBox> {
    const response: AxiosResponse<OverpackBox> = await this.api.get(`/api/v1/overpack-boxes/${id}`);
    return response.data;
  }

  async createOverpackBox(box: Partial<OverpackBox>): Promise<OverpackBox> {
    const response: AxiosResponse<OverpackBox> = await this.api.post('/api/v1/overpack-boxes/', box);
    return response.data;
  }

  async updateOverpackBox(id: number, box: Partial<OverpackBox>): Promise<OverpackBox> {
    const response: AxiosResponse<OverpackBox> = await this.api.put(`/api/v1/overpack-boxes/${id}`, box);
    return response.data;
  }

  async deleteOverpackBox(id: number): Promise<void> {
    await this.api.delete(`/api/v1/overpack-boxes/${id}`);
  }

  // Zone lookup methods
  async lookupZone(zipCode: string): Promise<{ zip_code: string; zone: number; estimated?: boolean }> {
    const response: AxiosResponse<{ zip_code: string; zone: number; estimated?: boolean }> = await this.api.get(`/api/v1/zone-lookup/lookup/${zipCode}`);
    return response.data;
  }

  // Enhanced Calculation methods
  async calculateShipping(request: {
    items: ItemRequest[];
    destination_zip: string;
    service_level: string;
    origin_zip?: string;
    customer_id: string;
  }): Promise<EnhancedShippingCalculation> {
    console.log('=== API SERVICE DEBUG START ===');
    console.log('API Base URL:', this.api.defaults.baseURL);
    console.log('Request URL:', '/api/v1/calculations/calculate');
    console.log('Request payload:', JSON.stringify(request, null, 2));
    console.log('Request headers:', this.api.defaults.headers);
    console.log('Auth token present:', !!this.token);
    
    try {
      const response: AxiosResponse<EnhancedShippingCalculation> = await this.api.post('/api/v1/calculations/calculate', request);
      console.log('API response status:', response.status);
      console.log('API response data:', response.data);
      console.log('=== API SERVICE DEBUG END - SUCCESS ===');
      return response.data;
    } catch (error: any) {
      console.log('=== API SERVICE DEBUG END - ERROR ===');
      console.error('API error:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error headers:', error.response?.headers);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    const response: AxiosResponse<{ status: string }> = await this.api.get('/health');
    return response.data;
  }

  // System Settings
  async getSystemSettings(): Promise<SystemSettings> {
    const response: AxiosResponse<SystemSettings> = await this.api.get('/api/v1/system-settings/');
    return response.data;
  }

  async updateSystemSettings(settings: SystemSettingsUpdate): Promise<SystemSettings> {
    const response: AxiosResponse<SystemSettings> = await this.api.put('/api/v1/system-settings/', settings);
    return response.data;
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;
