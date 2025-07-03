import React from 'react';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { X } from 'lucide-react';
import { UserRole, User } from '../../types';

interface UserFiltersProps {
	filters: {
		role?: UserRole;
		status?: 'active' | 'inactive';
		supervisor?: string;
	};
	onFiltersChange: (filters: any) => void;
	users?: User[];
	showSupervisorFilter?: boolean;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
	filters,
	onFiltersChange,
	users = [],
	showSupervisorFilter = false,
}) => {
	const roleOptions = [
		{ value: '', label: 'Todos los Roles' },
		{ value: 'admin', label: 'Administrador' },
		{ value: 'supervisor', label: 'Supervisor' },
		{ value: 'employee', label: 'Empleado' },
	];

	const statusOptions = [
		{ value: '', label: 'Todos los Estados' },
		{ value: 'active', label: 'Activo' },
		{ value: 'inactive', label: 'Inactivo' },
	];

	const supervisorOptions = [
		{ value: '', label: 'Todas las Asignaciones' },
		{ value: 'unassigned', label: 'Empleados No Asignados' },
		...users
			.filter((user) => user.role === 'supervisor')
			.map((supervisor) => ({
				value: supervisor.id,
				label: `${supervisor.firstName} ${supervisor.lastName}`,
			})),
	];

	const handleFilterChange = (key: string, value: string) => {
		onFiltersChange({
			...filters,
			[key]: value || undefined,
		});
	};

	const clearFilters = () => {
		onFiltersChange({});
	};

	const hasActiveFilters = Object.values(filters).some((value) => value);

	return (
		<div className="space-y-4">
			<div
				className={`grid grid-cols-1 gap-4 ${
					showSupervisorFilter ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
				}`}
			>
				<Select
					label="Role"
					value={filters.role || ''}
					onChange={(e) => handleFilterChange('role', e.target.value)}
					options={roleOptions}
				/>

				<Select
					label="Estado"
					value={filters.status || ''}
					onChange={(e) =>
						handleFilterChange('status', e.target.value)
					}
					options={statusOptions}
				/>

				{showSupervisorFilter && (
					<Select
						label="Asignación de Supervisor"
						value={filters.supervisor || ''}
						onChange={(e) =>
							handleFilterChange('supervisor', e.target.value)
						}
						options={supervisorOptions}
					/>
				)}
			</div>

			{hasActiveFilters && (
				<div className="flex justify-end">
					<Button
						variant="outline"
						size="sm"
						onClick={clearFilters}
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
