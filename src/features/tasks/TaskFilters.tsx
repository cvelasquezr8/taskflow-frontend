import React from 'react';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { X } from 'lucide-react';
import { TaskStatus, TaskPriority, User } from '../../types';

interface TaskFiltersProps {
	filters: {
		status?: TaskStatus;
		priority?: TaskPriority;
		assignedTo?: string;
		search?: string;
	};
	onFiltersChange: (filters: any) => void;
	onClearFilters: () => void;
	users: User[];
	canFilterByAssignee: boolean;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
	filters,
	onFiltersChange,
	onClearFilters,
	users,
	canFilterByAssignee,
}) => {
	const statusOptions = [
		{ value: '', label: 'Todos los Estados' },
		{ value: 'pending', label: 'Pendientes' },
		{ value: 'in-progress', label: 'En Progreso' },
		{ value: 'completed', label: 'Completadas' },
		{ value: 'cancelled', label: 'Canceladas' },
	];

	const priorityOptions = [
		{ value: '', label: 'Todas las Prioridades' },
		{ value: 'low', label: 'Baja' },
		{ value: 'medium', label: 'Media' },
		{ value: 'high', label: 'Alta' },
		{ value: 'urgent', label: 'Urgente' },
	];

	const userOptions = [
		{ value: '', label: 'Todos los Asignados' },
		...users.map((user) => ({
			value: user.id,
			label: `${user.firstName} ${user.lastName}`,
		})),
	];

	const handleFilterChange = (key: string, value: string) => {
		onFiltersChange({
			...filters,
			[key]: value || undefined,
		});
	};

	const hasActiveFilters = Object.values(filters).some((value) => value);

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<Select
					label="Estado"
					value={filters.status || ''}
					onChange={(e) =>
						handleFilterChange('status', e.target.value)
					}
					options={statusOptions}
				/>

				<Select
					label="Prioridad"
					value={filters.priority || ''}
					onChange={(e) =>
						handleFilterChange('priority', e.target.value)
					}
					options={priorityOptions}
				/>

				{canFilterByAssignee && (
					<Select
						label="Asignado a"
						value={filters.assignedTo || ''}
						onChange={(e) =>
							handleFilterChange('assignedTo', e.target.value)
						}
						options={userOptions}
					/>
				)}
			</div>

			{hasActiveFilters && (
				<div className="flex justify-end">
					<Button
						variant="outline"
						size="sm"
						onClick={onClearFilters}
						className="flex items-center gap-2"
					>
						<X className="w-4 h-4" />
						Limpiar Filtros
					</Button>
				</div>
			)}
		</div>
	);
};
