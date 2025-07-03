import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import {
	Edit,
	Calendar,
	User,
	Clock,
	CheckCircle,
	AlertCircle,
} from 'lucide-react';
import { Task, User as UserType, TaskStatus } from '../../types';

interface TaskCardProps {
	task: Task;
	users: UserType[];
	viewMode: 'grid' | 'list';
	onEdit: (task: Task) => void;
	canEdit: boolean;
	canAssign: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
	task,
	users,
	viewMode,
	onEdit,
	canEdit,
	canAssign,
}) => {
	const { user } = useAuthStore();
	const { updateTask } = useTaskStore();
	const { showToast } = useToast();

	const assignedUser = users.find((u) => u.id == task.assignedTo);

	const getStatusBadgeVariant = (status: TaskStatus) => {
		switch (status) {
			case 'completed':
				return 'success';
			case 'in-progress':
				return 'info';
			case 'pending':
				return 'warning';
			case 'cancelled':
				return 'error';
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

	const getStatusIcon = (status: TaskStatus) => {
		switch (status) {
			case 'completed':
				return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
			case 'in-progress':
				return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
			case 'pending':
				return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
			default:
				return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
		}
	};

	const handleStatusChange = async (newStatus: TaskStatus) => {
		try {
			await updateTask(task.id, { status: newStatus });
			showToast({
				type: 'success',
				title: 'Tarea Actualizada',
				message: `El estado de la tarea se cambió a ${newStatus}`,
			});
		} catch (error) {
			showToast({
				type: 'error',
				title: 'Error',
				message: 'Falló al actualizar el estado de la tarea',
			});
		}
	};

	const canUpdateStatus = task.assignedTo == user?.id || canAssign;

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	};

	const isOverdue =
		task.dueDate &&
		new Date(task.dueDate) < new Date() &&
		task.status !== 'completed';

	if (viewMode === 'list') {
		return (
			<Card
				className={`transition-all hover:shadow-md ${
					isOverdue ? 'border-error-200 bg-error-50' : ''
				}`}
			>
				<CardContent className="p-3 sm:p-4">
					<div className="flex flex-col sm:flex-row sm:items-center gap-3">
						<div className="flex-1 min-w-0">
							<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
								<h3 className="font-semibold text-secondary-900 text-sm sm:text-base truncate">
									{task.title}
								</h3>
								<div className="flex items-center gap-2 flex-wrap">
									<Badge
										variant={getStatusBadgeVariant(
											task.status,
										)}
										size="sm"
									>
										{getStatusIcon(task.status)}
										<span className="ml-1 capitalize text-xs">
											{task.status.replace('-', ' ')}
										</span>
									</Badge>
									<Badge
										variant={getPriorityBadgeVariant(
											task.priority,
										)}
										size="sm"
									>
										<span className="text-xs">
											{task.priority}
										</span>
									</Badge>
								</div>
							</div>

							<p className="text-xs sm:text-sm text-secondary-600 mb-3 line-clamp-2">
								{task.description}
							</p>

							<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-secondary-500">
								{assignedUser && (
									<div className="flex items-center gap-1">
										<User className="w-3 h-3" />
										<span>
											{assignedUser.firstName}{' '}
											{assignedUser.lastName}
										</span>
									</div>
								)}
								{task.dueDate && (
									<div
										className={`flex items-center gap-1 ${
											isOverdue ? 'text-error-600' : ''
										}`}
									>
										<Calendar className="w-3 h-3" />
										<span>
											Fecha de entrega{' '}
											{formatDate(task.dueDate)}
										</span>
									</div>
								)}
							</div>
						</div>

						<div className="flex items-center gap-2 sm:ml-4">
							{canUpdateStatus && task.status !== 'completed' && (
								<div className="flex gap-1">
									{task.status === 'pending' && (
										<Button
											size="sm"
											variant="outline"
											onClick={() =>
												handleStatusChange(
													'in-progress',
												)
											}
											className="text-xs px-2 py-1"
										>
											Comenzar
										</Button>
									)}
									{task.status === 'in-progress' && (
										<Button
											size="sm"
											variant="outline"
											onClick={() =>
												handleStatusChange('completed')
											}
											className="text-xs px-2 py-1"
										>
											Completar
										</Button>
									)}
								</div>
							)}

							{canEdit && (
								<Button
									size="sm"
									variant="ghost"
									onClick={() => onEdit(task)}
									className="p-1 sm:p-2"
								>
									<Edit className="w-3 h-3 sm:w-4 sm:h-4" />
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card
			className={`transition-all hover:shadow-md ${
				isOverdue ? 'border-error-200 bg-error-50' : ''
			}`}
		>
			<CardContent className="p-4 sm:p-6">
				<div className="flex items-start justify-between mb-3">
					<div className="flex items-center gap-2 flex-wrap">
						<Badge
							variant={getStatusBadgeVariant(task.status)}
							size="sm"
						>
							{getStatusIcon(task.status)}
							<span className="ml-1 capitalize text-xs">
								{task.status.replace('-', ' ')}
							</span>
						</Badge>
						<Badge
							variant={getPriorityBadgeVariant(task.priority)}
							size="sm"
						>
							<span className="text-xs">{task.priority}</span>
						</Badge>
					</div>

					{canEdit && (
						<Button
							size="sm"
							variant="ghost"
							onClick={() => onEdit(task)}
							className="p-1 sm:p-2 flex-shrink-0"
						>
							<Edit className="w-3 h-3 sm:w-4 sm:h-4" />
						</Button>
					)}
				</div>

				<h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2 text-sm sm:text-base">
					{task.title}
				</h3>
				<p className="text-xs sm:text-sm text-secondary-600 mb-4 line-clamp-3">
					{task.description}
				</p>

				<div className="space-y-2 mb-4">
					{assignedUser && (
						<div className="flex items-center gap-2 text-xs sm:text-sm text-secondary-600">
							<User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
							<span className="truncate">
								{assignedUser.firstName} {assignedUser.lastName}
							</span>
						</div>
					)}

					{task.dueDate && (
						<div
							className={`flex items-center gap-2 text-xs sm:text-sm ${
								isOverdue
									? 'text-error-600'
									: 'text-secondary-600'
							}`}
						>
							<Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
							<span>Vence {formatDate(task.dueDate)}</span>
							{isOverdue && (
								<span className="text-xs font-medium">
									(Vencida)
								</span>
							)}
						</div>
					)}
				</div>

				{task.tags && task.tags.length > 0 && (
					<div className="flex flex-wrap gap-1 mb-4">
						{task.tags.map((tag, index) => (
							<span
								key={index}
								className="px-2 py-1 text-xs bg-secondary-100 text-secondary-700 rounded-full"
							>
								{tag}
							</span>
						))}
					</div>
				)}

				{canUpdateStatus && task.status !== 'completed' && (
					<div className="flex gap-2">
						{task.status === 'pending' && (
							<Button
								size="sm"
								variant="outline"
								onClick={() =>
									handleStatusChange('in-progress')
								}
								className="flex-1 text-xs sm:text-sm"
							>
								Comenzar Tarea
							</Button>
						)}
						{task.status === 'in-progress' && (
							<Button
								size="sm"
								variant="primary"
								onClick={() => handleStatusChange('completed')}
								className="flex-1 text-xs sm:text-sm"
							>
								Marcar como Completada
							</Button>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
};
