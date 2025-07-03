import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, LoginCredentials, RegisterCredentials } from '../types';
import { authService } from '../services/authService';

interface AuthStore extends AuthState {
	login: (credentials: LoginCredentials) => Promise<void>;
	register: (credentials: RegisterCredentials) => Promise<void>;
	logout: () => void;
	setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
	persist(
		(set, _) => ({
			user: null,
			token: null,
			isAuthenticated: false,
			loading: false,

			login: async (credentials: LoginCredentials) => {
				set({ loading: true });
				try {
					const response = await authService.login(credentials);
					set({
						user: response.user,
						token: response.token,
						isAuthenticated: true,
						loading: false,
					});
				} catch (error) {
					set({ loading: false });
					throw error;
				}
			},

			register: async (credentials: RegisterCredentials) => {
				set({ loading: true });
				try {
					const response = await authService.register(credentials);
					set({
						user: response.user,
						token: response.token,
						isAuthenticated: true,
						loading: false,
					});
				} catch (error) {
					set({ loading: false });
					throw error;
				}
			},

			logout: () => {
				authService.logout();
				set({
					user: null,
					token: null,
					isAuthenticated: false,
					loading: false,
				});
			},

			setLoading: (loading: boolean) => {
				set({ loading });
			},
		}),
		{
			name: 'auth-storage',
			partialize: (state) => ({
				user: state.user,
				token: state.token,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
);
