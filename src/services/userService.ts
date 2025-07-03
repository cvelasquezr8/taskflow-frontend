import axios from 'axios';
import { User } from '../types';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5297';

const api = axios.create({
	baseURL: `${API_BASE_URL}/api`,
});

api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export const userService = {
	async getUsers(): Promise<User[]> {
		const res = await api.get<User[]>('/users');
		return res.data;
	},

	async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
		const res = await api.post<User>('/users', userData);
		return res.data;
	},

	async updateUser(id: string, updates: Partial<User>): Promise<User> {
		const res = await api.put<User>(`/users/${id}`, updates);
		return res.data;
	},

	async deleteUser(id: string): Promise<void> {
		await api.delete(`/users/${id}`);
	},

	async getUserById(id: string): Promise<User> {
		const res = await api.get<User>(`/users/${id}`);
		return res.data;
	},
};
