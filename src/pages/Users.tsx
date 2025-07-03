import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useToast } from '../components/ui/Toast';
import { UserModal } from '../features/users/UserModal';
import { UserCard } from '../features/users/UserCard';
import { UserFilters } from '../features/users/UserFilters';
import { SupervisorAssignmentModal } from '../features/users/SupervisorAssignmentModal';
import {
	Plus,
	Search,
	Filter,
	Users as UsersIcon,
	UserCheck,
	Shield,
	Crown,
	UserPlus,
} from 'lucide-react';
import { User, UserRole } from '../types';

export const Users: React.FC = () => {
	const { user: currentUser } = useAuthStore();
	const { users, loading, error, fetchUsers } = useUserStore();
	const { showToast } = useToast();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
	const [employeeToAssign, setEmployeeToAssign] = useState<User | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [showFilters, setShowFilters] = useState(false);
	const [filters, setFilters] = useState<{
		role?: UserRole;
		status?: 'active' | 'inactive';
		supervisor?: string;
	}>({});

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	useEffect(() => {
		if (error) {
			showToast({
				type: 'error',
				title: 'Error',
				message: error,
			});
		}
	}, [error, showToast]);

	// Filter users based on search and filters
	const filteredUsers = React.useMemo(() => {
		let result = users;

		// Role-based access control
		if (currentUser?.role === 'supervisor') {
			// Supervisors can only see their assigned employees and other supervisors
			result = result.filter(
				(user) =>
					user.role === 'supervisor' ||
					user.supervisorId == currentUser.id ||
					user.id == currentUser.id,
			);
		}

		// Search filtering
		if (searchTerm) {
			result = result.filter(
				(user) =>
					user.firstName
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					user.lastName
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					user.email.toLowerCase().includes(searchTerm.toLowerCase()),
			);
		}

		// Role filtering
		if (filters.role) {
			result = result.filter((user) => user.role === filters.role);
		}

		// Status filtering
		if (filters.status) {
			const isActive = filters.status === 'active';
			result = result.filter((user) => user.isActive === isActive);
		}

		// Supervisor filtering
		if (filters.supervisor) {
			if (filters.supervisor === 'unassigned') {
				result = result.filter(
					(user) => user.role === 'employee' && !user.supervisorId,
				);
			} else {
				result = result.filter(
					(user) => user.supervisorId == filters.supervisor,
				);
			}
		}

		return result;
	}, [users, currentUser, searchTerm, filters]);

	const handleCreateUser = () => {
		setSelectedUser(null);
		setIsModalOpen(true);
	};

	const handleEditUser = (user: User) => {
		setSelectedUser(user);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedUser(null);
	};

	const handleAssignSupervisor = (employee: User) => {
		setEmployeeToAssign(employee);
		setIsAssignmentModalOpen(true);
	};

	const handleCloseAssignmentModal = () => {
		setIsAssignmentModalOpen(false);
		setEmployeeToAssign(null);
	};

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const getUserStats = () => {
		const stats = {
			total: users.length,
			active: users.filter((u) => u.isActive).length,
			inactive: users.filter((u) => !u.isActive).length,
			admins: users.filter((u) => u.role === 'admin').length,
			supervisors: users.filter((u) => u.role === 'supervisor').length,
			employees: users.filter((u) => u.role === 'employee').length,
			unassignedEmployees: users.filter(
				(u) => u.role === 'employee' && !u.supervisorId,
			).length,
		};
		return stats;
	};

	const stats = getUserStats();

	// Access control
	if (currentUser?.role === 'employee') {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-center">
					<Shield className="w-16 h-16 text-error-500 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-secondary-900 mb-2">
						Acceso denegado
					</h2>
					<p className="text-secondary-600">
						No tienes permiso para gestionar usuarios.
					</p>
				</div>
			</div>
		);
	}

	if (loading && users.length === 0) {
		return (
			<div className="flex items-center justify-center h-64">
				<LoadingSpinner size="lg" />
			</div>
		);
	}

	const canCreateUsers = currentUser?.role === 'admin';
	const canAssignSupervisors = currentUser?.role === 'admin';

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-secondary-900">
						{currentUser?.role === 'admin'
							? 'Gestión de Usuarios'
							: 'Resumen del Equipo'}
					</h1>
					<p className="text-secondary-600 mt-1">
						{currentUser?.role === 'admin'
							? 'Gestiona los miembros del equipo, roles y asignaciones de supervisores'
							: 'Ver la información de los miembros de tu equipo'}
					</p>
				</div>

				{canCreateUsers && (
					<Button
						onClick={handleCreateUser}
						className="flex items-center gap-2"
					>
						<Plus className="w-4 h-4" />
						Agregar Usuario
					</Button>
				)}
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-secondary-600">
									Total de Usuarios
								</p>
								<p className="text-2xl font-bold text-secondary-900">
									{stats.total}
								</p>
							</div>
							<UsersIcon className="w-8 h-8 text-primary-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-secondary-600">
									Usuarios Activos
								</p>
								<p className="text-2xl font-bold text-accent-600">
									{stats.active}
								</p>
							</div>
							<UserCheck className="w-8 h-8 text-accent-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-secondary-600">
									Supervisores
								</p>
								<p className="text-2xl font-bold text-primary-600">
									{stats.supervisors}
								</p>
							</div>
							<Crown className="w-8 h-8 text-primary-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-secondary-600">
									No asignados
								</p>
								<p className="text-2xl font-bold text-error-600">
									{stats.unassignedEmployees}
								</p>
							</div>
							<UserPlus className="w-8 h-8 text-error-600" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Unassigned Employees Alert */}
			{currentUser?.role === 'admin' && stats.unassignedEmployees > 0 && (
				<Card className="border-yellow-200 bg-yellow-50">
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<UserPlus className="w-5 h-5 text-yellow-600" />
							<div>
								<h3 className="font-medium text-yellow-900">
									{stats.unassignedEmployees} empleado
									{stats.unassignedEmployees !== 1
										? 's'
										: ''}{' '}
									necesita asignación de supervisor
								</h3>
								<p className="text-sm text-yellow-700">
									Asigna supervisores para garantizar una
									gestión adecuada y supervisión.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Role Distribution */}
			<Card>
				<CardHeader>
					<CardTitle>Distribución de Roles</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className="text-center p-4 bg-primary-50 rounded-lg">
							<p className="text-2xl font-bold text-primary-600">
								{stats.admins}
							</p>
							<p className="text-sm text-primary-700">
								Administradores
							</p>
						</div>
						<div className="text-center p-4 bg-accent-50 rounded-lg">
							<p className="text-2xl font-bold text-accent-600">
								{stats.supervisors}
							</p>
							<p className="text-sm text-accent-700">
								Supervisores
							</p>
						</div>
						<div className="text-center p-4 bg-secondary-50 rounded-lg">
							<p className="text-2xl font-bold text-secondary-600">
								{stats.employees}
							</p>
							<p className="text-sm text-secondary-700">
								Empleados
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Search and Filters */}
			<Card>
				<CardContent className="p-4">
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
								<Input
									placeholder="Buscar usuarios por nombre o correo electrónico..."
									value={searchTerm}
									onChange={handleSearch}
									className="pl-10"
								/>
							</div>
						</div>

						<Button
							variant="outline"
							onClick={() => setShowFilters(!showFilters)}
							className="flex items-center gap-2"
						>
							<Filter className="w-4 h-4" />
							Filtros
						</Button>
					</div>

					{showFilters && (
						<div className="mt-4 pt-4 border-t border-secondary-200">
							<UserFilters
								filters={filters}
								onFiltersChange={setFilters}
								users={users}
								showSupervisorFilter={
									currentUser?.role === 'admin'
								}
							/>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Users Grid */}
			{filteredUsers.length === 0 ? (
				<Card>
					<CardContent className="p-12 text-center">
						<UsersIcon className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-secondary-900 mb-2">
							No se encontraron usuarios
						</h3>
						<p className="text-secondary-600 mb-4">
							{searchTerm || Object.keys(filters).length > 0
								? 'Intenta ajustar tu búsqueda o filtros'
								: canCreateUsers
								? 'Comienza agregando tu primer miembro del equipo'
								: 'No hay miembros del equipo para mostrar'}
						</p>
						{canCreateUsers &&
							!searchTerm &&
							Object.keys(filters).length === 0 && (
								<Button onClick={handleCreateUser}>
									<Plus className="w-4 h-4 mr-2" />
									Agregar Usuario
								</Button>
							)}
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredUsers.map((user) => (
						<UserCard
							key={user.id}
							user={user}
							users={users}
							onEdit={handleEditUser}
							onAssignSupervisor={
								canAssignSupervisors
									? handleAssignSupervisor
									: undefined
							}
							canEdit={currentUser?.id != user.id}
							canAssignSupervisor={canAssignSupervisors}
						/>
					))}
				</div>
			)}

			{/* User Modal */}
			<UserModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				user={selectedUser}
			/>

			{/* Supervisor Assignment Modal */}
			<SupervisorAssignmentModal
				isOpen={isAssignmentModalOpen}
				onClose={handleCloseAssignmentModal}
				employee={employeeToAssign}
			/>
		</div>
	);
};
