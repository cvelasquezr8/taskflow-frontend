export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: UserRole;
	avatar?: string;
	createdAt: string;
	isActive: boolean;
	supervisorId?: string;
}

export type UserRole = 'admin' | 'supervisor' | 'employee';

export interface Task {
	id: string;
	title: string;
	description: string;
	status: TaskStatus;
	priority: TaskPriority;
	assignedTo: string;
	assignedBy: string;
	createdAt: string;
	updatedAt: string;
	dueDate?: string;
	tags?: string[];
}

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	loading: boolean;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterCredentials {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}

export interface ApiResponse<T> {
	data: T;
	message: string;
	success: boolean;
}

export interface SupervisorAssignment {
	supervisorId: string;
	employeeIds: string[];
}
