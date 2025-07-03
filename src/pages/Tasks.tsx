import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/taskStore';
import { useUserStore } from '../store/userStore';
import { useSettingsStore } from '../store/settingsStore';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useToast } from '../components/ui/Toast';
import { TaskModal } from '../features/tasks/TaskModal';
import { TaskCard } from '../features/tasks/TaskCard';
import { TaskFilters } from '../features/tasks/TaskFilters';
import {
	Plus,
	Search,
	Filter,
	Grid3X3,
	List,
	Calendar,
	Users,
} from 'lucide-react';
import { Task } from '../types';

export const Tasks: React.FC = () => {
	const { user } = useAuthStore();
	const {
		tasks,
		loading,
		error,
		filters,
		fetchTasks,
		setFilters,
		clearFilters,
	} = useTaskStore();
	const { users, fetchUsers } = useUserStore();
	const { settings, setViewMode } = useSettingsStore();
	const { showToast } = useToast();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [viewMode, setLocalViewMode] = useState<'grid' | 'list'>(
		settings.defaultViewMode,
	);
	const [searchTerm, setSearchTerm] = useState('');
	const [showFilters, setShowFilters] = useState(false);

	useEffect(() => {
		fetchTasks();
		if (user?.role === 'admin' || user?.role === 'supervisor') {
			fetchUsers();
		}
	}, [fetchTasks, fetchUsers, user?.role, filters]);

	useEffect(() => {
		if (error) {
			showToast({
				type: 'error',
				title: 'Error',
				message: error,
			});
		}
	}, [error, showToast]);

	useEffect(() => {
		setLocalViewMode(settings.defaultViewMode);
	}, [settings.defaultViewMode]);

	// Filter tasks based on user role and supervisor assignments
	const filteredTasks = React.useMemo(() => {
		let result = tasks;

		// Role-based filtering with supervisor assignments
		if (user?.role === 'employee') {
			result = result.filter((task) => task.assignedTo == user.id);
		} else if (user?.role === 'supervisor') {
			// Supervisors see tasks assigned to their team members or tasks they assigned
			const teamMemberIds = users
				.filter((u) => u.supervisorId == user.id)
				.map((u) => u.id);

			result = result.filter(
				(task) =>
					task.assignedBy == user.id ||
					task.assignedTo == user.id ||
					teamMemberIds.includes(task.assignedTo),
			);
		}

		// Search filtering
		if (searchTerm) {
			result = result.filter(
				(task) =>
					task.title
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					task.description
						.toLowerCase()
						.includes(searchTerm.toLowerCase()),
			);
		}

		return result;
	}, [tasks, user, users, searchTerm]);

	// Filter available users for task assignment based on role
	const availableUsers = React.useMemo(() => {
		if (user?.role === 'admin') {
			return users; // Admins can assign to anyone
		} else if (user?.role === 'supervisor') {
			// Supervisors can only assign to their team members
			return users.filter((u) => u.supervisorId == user.id);
		}
		return []; // Employees can't assign tasks
	}, [users, user]);

	const handleCreateTask = () => {
		setSelectedTask(null);
		setIsModalOpen(true);
	};

	const handleEditTask = (task: Task) => {
		setSelectedTask(task);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedTask(null);
	};

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const handleViewModeChange = (mode: 'grid' | 'list') => {
		setLocalViewMode(mode);
		setViewMode(mode); // Update global settings
		showToast({
			type: 'success',
			title: 'Vista Actualizada',
			message: `Se cambió a la vista ${mode}. Esta preferencia ha sido guardada.`,
		});
	};

	const getStatusStats = () => {
		const stats = {
			total: filteredTasks.length,
			pending: filteredTasks.filter((t) => t.status === 'pending').length,
			inProgress: filteredTasks.filter((t) => t.status === 'in-progress')
				.length,
			completed: filteredTasks.filter((t) => t.status === 'completed')
				.length,
		};
		return stats;
	};

	const stats = getStatusStats();

	const canCreateTasks =
		user?.role === 'admin' || user?.role === 'supervisor';
	const canAssignTasks =
		user?.role === 'admin' || user?.role === 'supervisor';

	if (loading && tasks.length === 0) {
		return (
			<div className="flex items-center justify-center h-64">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-secondary-900">
						Tareas
					</h1>
					<p className="text-secondary-600 mt-1">
						{user?.role === 'employee'
							? 'Administra tus tareas asignadas'
							: user?.role === 'supervisor'
							? 'Administra las tareas de tu equipo'
							: 'Administra y asigna tareas a los miembros del equipo'}
					</p>
				</div>

				{canCreateTasks && (
					<Button
						onClick={handleCreateTask}
						className="flex items-center gap-2"
					>
						<Plus className="w-4 h-4" />
						Crear Tarea
					</Button>
				)}
			</div>

			{/* Team Info for Supervisors */}
			{user?.role === 'supervisor' && (
				<Card className="border-primary-200 bg-primary-50">
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<Users className="w-5 h-5 text-primary-600" />
							<div>
								<h3 className="font-medium text-primary-900">
									Tu equipo:{' '}
									{
										users.filter(
											(u) => u.supervisorId == user.id,
										).length
									}{' '}
									members
								</h3>
								<p className="text-sm text-primary-700">
									Puedes ver y gestionar tareas para:{' '}
									{users
										.filter(
											(u) => u.supervisorId == user.id,
										)
										.map((u) => u.firstName)
										.join(', ') ||
										'No team members assigned yet'}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-secondary-600">
									Total de tareas
								</p>
								<p className="text-2xl font-bold text-secondary-900">
									{stats.total}
								</p>
							</div>
							<List className="w-8 h-8 text-primary-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-secondary-600">
									Pendientes
								</p>
								<p className="text-2xl font-bold text-yellow-600">
									{stats.pending}
								</p>
							</div>
							<Calendar className="w-8 h-8 text-yellow-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-secondary-600">
									En Progreso
								</p>
								<p className="text-2xl font-bold text-primary-600">
									{stats.inProgress}
								</p>
							</div>
							<Users className="w-8 h-8 text-primary-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-secondary-600">
									Completadas
								</p>
								<p className="text-2xl font-bold text-accent-600">
									{stats.completed}
								</p>
							</div>
							<Grid3X3 className="w-8 h-8 text-accent-600" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Search and Filters */}
			<Card>
				<CardContent className="p-4">
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
								<Input
									placeholder="Buscar tareas..."
									value={searchTerm}
									onChange={handleSearch}
									className="pl-10"
								/>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								onClick={() => setShowFilters(!showFilters)}
								className="flex items-center gap-2"
							>
								<Filter className="w-4 h-4" />
								Filtros
							</Button>

							<div className="flex border border-secondary-200 rounded-lg">
								<Button
									variant={
										viewMode === 'grid'
											? 'primary'
											: 'ghost'
									}
									size="sm"
									onClick={() => handleViewModeChange('grid')}
									className="rounded-r-none border-r"
								>
									<Grid3X3 className="w-4 h-4" />
								</Button>
								<Button
									variant={
										viewMode === 'list'
											? 'primary'
											: 'ghost'
									}
									size="sm"
									onClick={() => handleViewModeChange('list')}
									className="rounded-l-none"
								>
									<List className="w-4 h-4" />
								</Button>
							</div>
						</div>
					</div>

					{showFilters && (
						<div className="mt-4 pt-4 border-t border-secondary-200">
							<TaskFilters
								filters={filters}
								onFiltersChange={setFilters}
								users={availableUsers}
								canFilterByAssignee={canAssignTasks}
								onClearFilters={clearFilters}
							/>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Tasks Grid/List */}
			{filteredTasks.length === 0 ? (
				<Card>
					<CardContent className="p-12 text-center">
						<List className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-secondary-900 mb-2">
							No se encontraron tareas
						</h3>
						<p className="text-secondary-600 mb-4">
							{searchTerm
								? 'Intenta ajustar tu búsqueda o filtros'
								: canCreateTasks
								? user?.role === 'supervisor'
									? 'Comienza creando tareas para tu equipo'
									: 'Comienza creando tu primera tarea'
								: 'No se han asignado tareas a ti aún'}
						</p>
						{canCreateTasks && !searchTerm && (
							<Button onClick={handleCreateTask}>
								<Plus className="w-4 h-4 mr-2" />
								Crear tarea
							</Button>
						)}
					</CardContent>
				</Card>
			) : (
				<div
					className={
						viewMode === 'grid'
							? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
							: 'space-y-4'
					}
				>
					{filteredTasks.map((task) => (
						<TaskCard
							key={task.id}
							task={task}
							users={users}
							viewMode={viewMode}
							onEdit={handleEditTask}
							canEdit={
								canAssignTasks || task.assignedTo == user?.id
							}
							canAssign={canAssignTasks}
						/>
					))}
				</div>
			)}

			{/* Task Modal */}
			<TaskModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				task={selectedTask}
				users={availableUsers}
				canAssign={canAssignTasks}
			/>
		</div>
	);
};
