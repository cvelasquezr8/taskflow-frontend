import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/taskStore';
import { useUserStore } from '../store/userStore';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
	CheckSquare,
	Clock,
	Users,
	AlertCircle,
	TrendingUp,
	Calendar,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
	const { user } = useAuthStore();
	const { tasks, loading: tasksLoading, fetchTasks } = useTaskStore();
	const { users, loading: usersLoading, fetchUsers } = useUserStore();

	useEffect(() => {
		fetchTasks();
		if (user?.role === 'admin') {
			fetchUsers();
		}
	}, [fetchTasks, fetchUsers, user?.role]);

	if (tasksLoading && tasks.length === 0) {
		return (
			<div className="flex items-center justify-center h-64">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	// Filter tasks based on user role
	const safeTasks = Array.isArray(tasks) ? tasks : [];

	const filteredTasks =
		user?.role === 'employee'
			? safeTasks.filter((task) => task.assignedTo == user.id)
			: safeTasks;

	const stats = {
		totalTasks: filteredTasks.length,
		completedTasks: filteredTasks.filter(
			(task) => task.status === 'completed',
		).length,
		pendingTasks: filteredTasks.filter((task) => task.status === 'pending')
			.length,
		inProgressTasks: filteredTasks.filter(
			(task) => task.status === 'in-progress',
		).length,
		highPriorityTasks: filteredTasks.filter(
			(task) => task.priority === 'high' || task.priority === 'urgent',
		).length,
	};

	const recentTasks = filteredTasks
		.sort(
			(a, b) =>
				new Date(b.updatedAt).getTime() -
				new Date(a.updatedAt).getTime(),
		)
		.slice(0, 5);

	const getStatusBadgeVariant = (status: string) => {
		switch (status) {
			case 'completed':
				return 'success';
			case 'in-progress':
				return 'info';
			case 'pending':
				return 'warning';
			default:
				return 'default';
		}
	};

	const getPriorityBadgeVariant = (priority: string) => {
		switch (priority) {
			case 'urgent':
				return 'error';
			case 'high':
				return 'warning';
			case 'medium':
				return 'info';
			case 'low':
				return 'default';
			default:
				return 'default';
		}
	};

	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Welcome Section */}
			<div className="text-center sm:text-left">
				<h1 className="text-xl sm:text-2xl font-bold text-secondary-900">
					Bienvenido de nuevo, {user?.firstName}!
				</h1>
				<p className="text-secondary-600 mt-1 text-sm sm:text-base">
					Aquí está lo que está sucediendo con tus tareas hoy.
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
				<Card>
					<CardContent className="p-3 sm:p-4 lg:p-6">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
							<div className="mb-2 sm:mb-0">
								<p className="text-xs sm:text-sm font-medium text-secondary-600">
									Total de tareas
								</p>
								<p className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary-900">
									{stats.totalTasks}
								</p>
							</div>
							<CheckSquare className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 self-end sm:self-auto" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-3 sm:p-4 lg:p-6">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
							<div className="mb-2 sm:mb-0">
								<p className="text-xs sm:text-sm font-medium text-secondary-600">
									Completadas
								</p>
								<p className="text-xl sm:text-2xl lg:text-3xl font-bold text-accent-600">
									{stats.completedTasks}
								</p>
							</div>
							<TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-accent-600 self-end sm:self-auto" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-3 sm:p-4 lg:p-6">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
							<div className="mb-2 sm:mb-0">
								<p className="text-xs sm:text-sm font-medium text-secondary-600">
									En Progreso
								</p>
								<p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-600">
									{stats.inProgressTasks}
								</p>
							</div>
							<Clock className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 self-end sm:self-auto" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-3 sm:p-4 lg:p-6">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
							<div className="mb-2 sm:mb-0">
								<p className="text-xs sm:text-sm font-medium text-secondary-600">
									Prioridad Alta
								</p>
								<p className="text-xl sm:text-2xl lg:text-3xl font-bold text-error-600">
									{stats.highPriorityTasks}
								</p>
							</div>
							<AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-error-600 self-end sm:self-auto" />
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
				{/* Recent Tasks */}
				<Card>
					<CardHeader className="pb-3 sm:pb-4">
						<CardTitle className="text-lg sm:text-xl">
							Tareas Recientes
						</CardTitle>
					</CardHeader>
					<CardContent className="p-3 sm:p-6 pt-0">
						<div className="space-y-3 sm:space-y-4">
							{recentTasks.length === 0 ? (
								<p className="text-secondary-600 text-center py-4 text-sm sm:text-base">
									No se encontraron tareas recientes.
								</p>
							) : (
								recentTasks.map((task) => (
									<div
										key={task.id}
										className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-secondary-50 rounded-lg gap-2 sm:gap-4"
									>
										<div className="flex-1 min-w-0">
											<h4 className="font-medium text-secondary-900 text-sm sm:text-base truncate">
												{task.title}
											</h4>
											<p className="text-xs sm:text-sm text-secondary-600 mt-1 line-clamp-2">
												{task.description}
											</p>
										</div>
										<div className="flex items-center gap-2 flex-shrink-0">
											<Badge
												variant={getPriorityBadgeVariant(
													task.priority,
												)}
												size="sm"
											>
												{task.priority}
											</Badge>
											<Badge
												variant={getStatusBadgeVariant(
													task.status,
												)}
												size="sm"
											>
												{task.status}
											</Badge>
										</div>
									</div>
								))
							)}
						</div>
					</CardContent>
				</Card>

				{/* Quick Actions or Additional Stats */}
				<Card>
					<CardHeader className="pb-3 sm:pb-4">
						<CardTitle className="text-lg sm:text-xl">
							Estadísticas Rápidas
						</CardTitle>
					</CardHeader>
					<CardContent className="p-3 sm:p-6 pt-0">
						<div className="space-y-3 sm:space-y-4">
							<div className="flex items-center justify-between p-3 bg-accent-50 rounded-lg">
								<div className="flex items-center">
									<Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-accent-600 mr-2 sm:mr-3 flex-shrink-0" />
									<span className="font-medium text-secondary-900 text-sm sm:text-base">
										Tareas de Hoy
									</span>
								</div>
								<span className="text-lg sm:text-xl font-bold text-accent-600">
									{
										filteredTasks.filter((task) => {
											if (!task.dueDate) return false;
											const today =
												new Date().toDateString();
											const dueDate = new Date(
												task.dueDate,
											).toDateString();
											return today === dueDate;
										}).length
									}
								</span>
							</div>

							<div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
								<div className="flex items-center">
									<Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 mr-2 sm:mr-3 flex-shrink-0" />
									<span className="font-medium text-secondary-900 text-sm sm:text-base">
										Tareas Pendientes
									</span>
								</div>
								<span className="text-lg sm:text-xl font-bold text-primary-600">
									{stats.pendingTasks}
								</span>
							</div>

							{user?.role === 'admin' && (
								<div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
									<div className="flex items-center">
										<Users className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-600 mr-2 sm:mr-3 flex-shrink-0" />
										<span className="font-medium text-secondary-900 text-sm sm:text-base">
											Total de Usuarios
										</span>
									</div>
									<span className="text-lg sm:text-xl font-bold text-secondary-600">
										{usersLoading ? (
											<LoadingSpinner size="sm" />
										) : (
											users.length
										)}
									</span>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};
