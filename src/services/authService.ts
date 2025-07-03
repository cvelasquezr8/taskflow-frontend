import axios from 'axios';
import { LoginCredentials, RegisterCredentials, User } from '../types';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5297';

export const authService = {
	async login(
		credentials: LoginCredentials,
	): Promise<{ user: User; token: string }> {
		const res = await axios.post(
			`${API_BASE_URL}/api/auth/login`,
			credentials,
		);
		const { token, user } = res.data;
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

		return { user, token };
	},

	async register(
		credentials: RegisterCredentials,
	): Promise<{ user: User; token: string }> {
		const res = await axios.post(
			`${API_BASE_URL}/api/auth/register`,
			credentials,
		);
		const { token, user } = res.data;

		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

		return { user, token };
	},

	logout(): void {
		localStorage.removeItem('auth-storage');
		delete axios.defaults.headers.common['Authorization'];
	},
};
