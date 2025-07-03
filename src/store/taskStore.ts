import { create } from 'zustand';
import { Task, TaskStatus, TaskPriority } from '../types';
import { taskService } from '../services/taskService';

interface TaskState {
	tasks: Task[];
	loading: boolean;
	error: string | null;
	filters: {
		status?: TaskStatus;
		priority?: TaskPriority;
		assignedTo?: string;
		search?: string;
	};
}

interface TaskStore extends TaskState {
	fetchTasks: () => Promise<void>;
	createTask: (
		task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
	) => Promise<void>;
	updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
	deleteTask: (id: string) => Promise<void>;
	setFilters: (filters: Partial<TaskState['filters']>) => void;
	clearError: () => void;
	clearFilters: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
	tasks: [],
	loading: false,
	error: null,
	filters: {},

	fetchTasks: async () => {
		set({ loading: true, error: null });
		try {
			const tasks = await taskService.getTasks(get().filters);
			set({ tasks, loading: false });
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'Failed to fetch tasks',
				loading: false,
			});
		}
	},

	createTask: async (taskData) => {
		set({ loading: true, error: null });
		try {
			const newTask = await taskService.createTask(taskData);
			set((state) => ({
				tasks: [...state.tasks, newTask],
				loading: false,
			}));
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'Failed to create task',
				loading: false,
			});
		}
	},

	updateTask: async (id, updates) => {
		set({ loading: true, error: null });
		try {
			const updatedTask = await taskService.updateTask(id, updates);
			set((state) => ({
				tasks: state.tasks.map((task) =>
					task.id == id ? updatedTask : task,
				),
				loading: false,
			}));
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'Failed to update task',
				loading: false,
			});
		}
	},

	deleteTask: async (id) => {
		set({ loading: true, error: null });
		try {
			await taskService.deleteTask(id);
			set((state) => ({
				tasks: state.tasks.filter((task) => task.id !== id),
				loading: false,
			}));
		} catch (error) {
			set({
				error:
					error instanceof Error
						? error.message
						: 'Failed to delete task',
				loading: false,
			});
		}
	},

	setFilters: (filters) => {
		set((state) => ({
			filters: { ...state.filters, ...filters },
		}));
		get().fetchTasks();
	},

	clearFilters: () => {
		set({ filters: {} });
	},

	clearError: () => {
		set({ error: null });
	},
}));
