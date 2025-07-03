import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../components/ui/Toast';
import { Task, User, TaskStatus, TaskPriority } from '../../types';

interface TaskModalProps {
	isOpen: boolean;
	onClose: () => void;
	task?: Task | null;
	users: User[];
	canAssign: boolean;
}

export const TaskModal: React.FC<TaskModalProps> = ({
	isOpen,
	onClose,
	task,
	users,
	canAssign,
}) => {
	const { user } = useAuthStore();
	const { createTask, updateTask, deleteTask, loading } = useTaskStore();
	const { showToast } = useToast();

	const [formData, setFormData] = useState({
		title: '',
		description: '',
		status: 'pending' as TaskStatus,
		priority: 'medium' as TaskPriority,
		assignedTo: '',
		dueDate: '',
		tags: '',
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (task) {
			setFormData({
				title: task.title,
				description: task.description,
				status: task.status,
				priority: task.priority,
				assignedTo: task.assignedTo,
				dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
				tags: task.tags?.join(', ') || '',
			});
		} else {
			setFormData({
				title: '',
				description: '',
				status: 'pending',
				priority: 'medium',
				assignedTo: user?.role === 'employee' ? user.id : '',
				dueDate: '',
				tags: '',
			});
		}
		setErrors({});
	}, [task, user, isOpen]);

	const statusOptions = [
		{ value: 'pending', label: 'Pendientes' },
		{ value: 'in-progress', label: 'En Progreso' },
		{ value: 'completed', label: 'Completadas' },
		{ value: 'cancelled', label: 'Canceladas' },
	];

	const priorityOptions = [
		{ value: 'low', label: 'Baja' },
		{ value: 'medium', label: 'Media' },
		{ value: 'high', label: 'Alta' },
		{ value: 'urgent', label: 'Urgente' },
	];

	const userOptions = users.map((u) => ({
		value: u.id,
		label: `${u.firstName} ${u.lastName} (${u.role})`,
	}));

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.title.trim()) {
			newErrors.title = 'El título es obligatorio';
		}

		if (!formData.description.trim()) {
			newErrors.description = 'La descripción es obligatoria';
		}

		if (!formData.assignedTo && canAssign) {
			newErrors.assignedTo = 'Por favor, asigna esta tarea a alguien';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		try {
			const taskData = {
				title: formData.title.trim(),
				description: formData.description.trim(),
				status: formData.status,
				priority: formData.priority,
				assignedTo: String(formData.assignedTo || user!.id),
				assignedBy: String(user!.id),
				dueDate: formData.dueDate
					? new Date(formData.dueDate).toISOString()
					: undefined,
				tags: formData.tags
					? formData.tags
							.split(',')
							.map((tag) => tag.trim())
							.filter(Boolean)
					: [],
			};

			if (task) {
				await updateTask(task.id, taskData);
				showToast({
					type: 'success',
					title: 'Tarea Actualizada',
					message: 'La tarea ha sido actualizada con éxito',
				});
			} else {
				await createTask(taskData);
				showToast({
					type: 'success',
					title: 'Tarea Creada',
					message: 'La nueva tarea ha sido creada con éxito',
				});
			}

			onClose();
		} catch (error) {
			showToast({
				type: 'error',
				title: 'Error',
				message:
					error instanceof Error
						? error.message
						: 'Ocurrió un error al procesar la tarea',
			});
		}
	};

	const handleDelete = async () => {
		if (!task) return;

		if (
			window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')
		) {
			try {
				await deleteTask(task.id);
				showToast({
					type: 'success',
					title: 'Tarea Eliminada',
					message: 'La tarea ha sido eliminada con éxito',
				});
				onClose();
			} catch (error) {
				showToast({
					type: 'error',
					title: 'Error',
					message: 'No se pudo eliminar la tarea',
				});
			}
		}
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: '' }));
		}
	};

	const canEditStatus = task?.assignedTo == user?.id || canAssign;
	const canDeleteTask = canAssign;

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={task ? 'Editar Tarea' : 'Crear Nueva Tarea'}
			size="lg"
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<Input
					label="Título"
					name="title"
					value={formData.title}
					onChange={handleChange}
					error={errors.title}
					placeholder="Ingrese el título de la tarea"
					disabled={loading}
				/>

				<div>
					<label className="block text-sm font-medium text-secondary-700 mb-1">
						Descripción
					</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						rows={3}
						className={`
              block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-secondary-400 
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              disabled:bg-secondary-50 disabled:text-secondary-500 disabled:cursor-not-allowed
              ${
					errors.description
						? 'border-error-300 text-error-900 focus:ring-error-500'
						: 'border-secondary-300 text-secondary-900'
				}
            `}
						placeholder="Enter task description"
						disabled={loading}
					/>
					{errors.description && (
						<p className="text-sm text-error-600 mt-1">
							{errors.description}
						</p>
					)}
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Select
						label="Prioridad"
						name="priority"
						value={formData.priority}
						onChange={handleChange}
						options={priorityOptions}
						disabled={loading}
					/>

					{canEditStatus && (
						<Select
							label="Estado"
							name="status"
							value={formData.status}
							onChange={handleChange}
							options={statusOptions}
							disabled={loading}
						/>
					)}
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{canAssign && (
						<Select
							label="Asignar a"
							name="assignedTo"
							value={formData.assignedTo}
							onChange={handleChange}
							options={userOptions}
							placeholder="Seleccionar asignado"
							error={errors.assignedTo}
							disabled={loading}
						/>
					)}

					<Input
						label="Fecha de Vencimiento"
						name="dueDate"
						type="date"
						value={formData.dueDate}
						onChange={handleChange}
						disabled={loading}
					/>
				</div>

				<Input
					label="Tags"
					name="tags"
					value={formData.tags}
					onChange={handleChange}
					placeholder="Ingrese etiquetas separadas por comas"
					helperText="e.g., frontend, urgent, bug-fix"
					disabled={loading}
				/>

				<div className="flex justify-between pt-4">
					<div>
						{task && canDeleteTask && (
							<Button
								type="button"
								variant="danger"
								onClick={handleDelete}
								disabled={loading}
							>
								Eliminar Tarea
							</Button>
						)}
					</div>

					<div className="flex gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={loading}
						>
							Cancelar
						</Button>
						<Button
							type="submit"
							loading={loading}
							disabled={loading}
						>
							{task ? 'Actualizar Tarea' : 'Crear Tarea'}
						</Button>
					</div>
				</div>
			</form>
		</Modal>
	);
};
