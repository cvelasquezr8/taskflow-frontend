import { create } from 'zustand';
import { User, UserRole } from '../types';
import { userService } from '../services/userService';

interface UserState {
	users: User[];
	loading: boolean;
	error: string | null;
}

interface UserStore extends UserState {
	fetchUsers: () => Promise<void>;
	createUser: (user: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
	updateUser: (id: string, updates: Partial<User>) => Promise<void>;
	deleteUser: (id: string) => Promise<void>;
	updateUserRole: (id: string, role: UserRole) => Promise<void>;
	clearError: () => void;
}

export const useUserStore = create<UserStore>((set, _) => ({
	users: [],
	loading: false,
	error: null,

	fetchUsers: async () => {
		set({ loading: true, error: null });
		try {
			const users = await userService.getUsers();
			set({ users, loading: false });
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'Failed to fetch users',
				loading: false,
			});
		}
	},

	createUser: async (userData) => {
		set({ loading: true, error: null });
		try {
			const newUser = await userService.createUser(userData);
			set((state) => ({
				users: [...state.users, newUser],
				loading: false,
			}));
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'Failed to create user',
				loading: false,
			});
		}
	},

	updateUser: async (id, updates) => {
		set({ loading: true, error: null });
		try {
			const updatedUser = await userService.updateUser(id, updates);
			set((state) => ({
				users: state.users.map((user) =>
					user.id == id ? updatedUser : user,
				),
				loading: false,
			}));
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'Failed to update user',
				loading: false,
			});
		}
	},

	deleteUser: async (id) => {
		set({ loading: true, error: null });
		try {
			await userService.deleteUser(id);
			set((state) => ({
				users: state.users.filter((user) => user.id !== id),
				loading: false,
			}));
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'Failed to delete user',
				loading: false,
			});
		}
	},

	updateUserRole: async (id, role) => {
		set({ loading: true, error: null });
		try {
			const updatedUser = await userService.updateUser(id, { role });
			set((state) => ({
				users: state.users.map((user) =>
					user.id == id ? updatedUser : user,
				),
				loading: false,
			}));
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'Failed to update user role',
				loading: false,
			});
		}
	},

	clearError: () => {
		set({ error: null });
	},
}));
