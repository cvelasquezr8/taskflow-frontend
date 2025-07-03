import axios from 'axios';
import { Task, TaskStatus, TaskPriority } from '../types';
import { useAuthStore } from '../store/authStore';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5297';

interface TaskFilters {
	status?: TaskStatus;
	priority?: TaskPriority;
	assignedTo?: string;
	search?: string;
}

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

export const taskService = {
	async getTasks(filters: TaskFilters = {}): Promise<Task[]> {
		const res = await api.get<Task[]>('/tasks');
		let tasks = res.data;

		if (filters.status) {
			tasks = tasks.filter((task) => task.status === filters.status);
		}
		if (filters.priority) {
			tasks = tasks.filter((task) => task.priority === filters.priority);
		}
		if (filters.assignedTo) {
			tasks = tasks.filter(
				(task) => task.assignedTo == filters.assignedTo,
			);
		}
		if (filters.search) {
			const searchLower = filters.search.toLowerCase();
			tasks = tasks.filter(
				(task) =>
					task.title.toLowerCase().includes(searchLower) ||
					task.description.toLowerCase().includes(searchLower),
			);
		}
		return tasks;
	},

	async getTaskById(id: string): Promise<Task> {
		const res = await api.get<Task>(`/tasks/${id}`);
		return res.data;
	},

	async createTask(
		taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
	): Promise<Task> {
		const res = await api.post<Task>('/tasks', taskData);
		return res.data;
	},

	async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
		const res = await api.put<Task>(`/tasks/${id}`, updates);
		return res.data;
	},

	async deleteTask(id: string): Promise<void> {
		await api.delete(`/tasks/${id}`);
	},
};
