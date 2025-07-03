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
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-secondary-900">
					Bienvenido de nuevo, {user?.firstName}!
				</h1>
				<p className="text-secondary-600 mt-1">
					Aquí está lo que está sucediendo con tus tareas hoy.
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-secondary-600">
									Total de tareas
								</p>
								<p className="text-3xl font-bold text-secondary-900">
									{stats.totalTasks}
								</p>
							</div>
							<CheckSquare className="w-8 h-8 text-primary-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-secondary-600">
									Completadas
								</p>
								<p className="text-3xl font-bold text-accent-600">
									{stats.completedTasks}
								</p>
							</div>
							<TrendingUp className="w-8 h-8 text-accent-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-secondary-600">
									En Progreso
								</p>
								<p className="text-3xl font-bold text-primary-600">
									{stats.inProgressTasks}
								</p>
							</div>
							<Clock className="w-8 h-8 text-primary-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-secondary-600">
									Prioridad Alta
								</p>
								<p className="text-3xl font-bold text-error-600">
									{stats.highPriorityTasks}
								</p>
							</div>
							<AlertCircle className="w-8 h-8 text-error-600" />
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Recent Tasks */}
				<Card>
					<CardHeader>
						<CardTitle>Tareas Recientes</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{recentTasks.length === 0 ? (
								<p className="text-secondary-600 text-center py-4">
									No se encontraron tareas recientes.
								</p>
							) : (
								recentTasks.map((task) => (
									<div
										key={task.id}
										className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
									>
										<div className="flex-1">
											<h4 className="font-medium text-secondary-900">
												{task.title}
											</h4>
											<p className="text-sm text-secondary-600 mt-1">
												{task.description}
											</p>
										</div>
										<div className="flex items-center space-x-2 ml-4">
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
					<CardHeader>
						<CardTitle>Estadísticas Rápidas</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center justify-between p-3 bg-accent-50 rounded-lg">
								<div className="flex items-center">
									<Calendar className="w-5 h-5 text-accent-600 mr-3" />
									<span className="font-medium text-secondary-900">
										Tareas de Hoy
									</span>
								</div>
								<span className="text-lg font-bold text-accent-600">
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
									<Clock className="w-5 h-5 text-primary-600 mr-3" />
									<span className="font-medium text-secondary-900">
										Tareas Pendientes
									</span>
								</div>
								<span className="text-lg font-bold text-primary-600">
									{stats.pendingTasks}
								</span>
							</div>

							{user?.role === 'admin' && (
								<div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
									<div className="flex items-center">
										<Users className="w-5 h-5 text-secondary-600 mr-3" />
										<span className="font-medium text-secondary-900">
											Total de Usuarios
										</span>
									</div>
									<span className="text-lg font-bold text-secondary-600">
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
