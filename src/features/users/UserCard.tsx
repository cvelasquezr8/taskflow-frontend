import React from 'react';
import { useUserStore } from '../../store/userStore';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import {
	Edit,
	Mail,
	Calendar,
	Shield,
	User as UserIcon,
	UserCheck,
	UserX,
	Users,
	Link,
} from 'lucide-react';
import { User, UserRole } from '../../types';

interface UserCardProps {
	user: User;
	users: User[];
	onEdit: (user: User) => void;
	onAssignSupervisor?: (user: User) => void;
	canEdit: boolean;
	canAssignSupervisor: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({
	user,
	users,
	onEdit,
	onAssignSupervisor,
	canEdit,
	canAssignSupervisor,
}) => {
	const { updateUser } = useUserStore();
	const { showToast } = useToast();

	const getRoleBadgeVariant = (role: UserRole) => {
		switch (role) {
			case 'admin':
				return 'error';
			case 'supervisor':
				return 'warning';
			case 'employee':
				return 'info';
			default:
				return 'default';
		}
	};

	const getRoleIcon = (role: UserRole) => {
		switch (role) {
			case 'admin':
				return <Shield className="w-4 h-4" />;
			case 'supervisor':
				return <UserCheck className="w-4 h-4" />;
			case 'employee':
				return <UserIcon className="w-4 h-4" />;
			default:
				return <UserIcon className="w-4 h-4" />;
		}
	};

	const handleToggleStatus = async () => {
		try {
			await updateUser(user.id, { isActive: !user.isActive });
			showToast({
				type: 'success',
				title: 'Usuario Actualizado',
				message: `Usuario ${
					user.isActive ? 'desactivado' : 'activado'
				} correctamente`,
			});
		} catch (error) {
			showToast({
				type: 'error',
				title: 'Error',
				message: 'Fallo al actualizar el estado del usuario',
			});
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	};

	const getInitials = (firstName: string, lastName: string) => {
		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
	};

	// Get supervisor info for employees
	const supervisor =
		user.role === 'employee' && user.supervisorId
			? users.find((u) => u.id == user.supervisorId)
			: null;

	// Get team members for supervisors
	const teamMembers =
		user.role === 'supervisor'
			? users.filter((u) => u.supervisorId == user.id)
			: [];

	return (
		<Card
			className={`transition-all hover:shadow-md ${
				!user.isActive ? 'opacity-75 bg-secondary-50' : ''
			}`}
		>
			<CardContent className="p-6">
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-center gap-3">
						<div
							className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
								user.isActive
									? 'bg-primary-600'
									: 'bg-secondary-400'
							}`}
						>
							{user.avatar ? (
								<img
									src={user.avatar}
									alt={`${user.firstName} ${user.lastName}`}
									className="w-12 h-12 rounded-full object-cover"
								/>
							) : (
								getInitials(user.firstName, user.lastName)
							)}
						</div>

						<div>
							<h3 className="font-semibold text-secondary-900">
								{user.firstName} {user.lastName}
							</h3>
							<div className="flex items-center gap-2 mt-1">
								<Badge
									variant={getRoleBadgeVariant(user.role)}
									size="sm"
								>
									{getRoleIcon(user.role)}
									<span className="ml-1 capitalize">
										{user.role}
									</span>
								</Badge>
								<Badge
									variant={
										user.isActive ? 'success' : 'error'
									}
									size="sm"
								>
									{user.isActive ? 'Activo' : 'Inactivo'}
								</Badge>
							</div>
						</div>
					</div>

					{canEdit && (
						<Button
							size="sm"
							variant="ghost"
							onClick={() => onEdit(user)}
						>
							<Edit className="w-4 h-4" />
						</Button>
					)}
				</div>

				<div className="space-y-3">
					<div className="flex items-center gap-2 text-sm text-secondary-600">
						<Mail className="w-4 h-4" />
						<span className="truncate">{user.email}</span>
					</div>

					<div className="flex items-center gap-2 text-sm text-secondary-600">
						<Calendar className="w-4 h-4" />
						<span>Unido el {formatDate(user.createdAt)}</span>
					</div>

					{/* Supervisor/Team Information */}
					{user.role === 'employee' && (
						<div className="flex items-center gap-2 text-sm text-secondary-600">
							<UserCheck className="w-4 h-4" />
							{supervisor ? (
								<span>
									Reporta a {supervisor.firstName}{' '}
									{supervisor.lastName}
								</span>
							) : (
								<span className="text-yellow-600">
									No supervisor asignado
								</span>
							)}
						</div>
					)}

					{user.role === 'supervisor' && (
						<div className="flex items-center gap-2 text-sm text-secondary-600">
							<Users className="w-4 h-4" />
							<span>
								{teamMembers.length} miembro
								{teamMembers.length !== 1 ? 's' : ''}
							</span>
						</div>
					)}
				</div>

				{/* Team Members Preview for Supervisors */}
				{user.role === 'supervisor' && teamMembers.length > 0 && (
					<div className="mt-4 p-3 bg-secondary-50 rounded-lg">
						<h5 className="text-sm font-medium text-secondary-900 mb-2">
							Miembros del Equipo
						</h5>
						<div className="space-y-1">
							{teamMembers.slice(0, 3).map((member) => (
								<div
									key={member.id}
									className="text-xs text-secondary-600"
								>
									• {member.firstName} {member.lastName}
								</div>
							))}
							{teamMembers.length > 3 && (
								<div className="text-xs text-secondary-500">
									+{teamMembers.length - 3} más
								</div>
							)}
						</div>
					</div>
				)}

				{canEdit && (
					<div className="flex gap-2 mt-4 pt-4 border-t border-secondary-200">
						<Button
							size="sm"
							variant="outline"
							onClick={() => onEdit(user)}
							className="flex-1"
						>
							Editar Usuario
						</Button>

						{canAssignSupervisor &&
							user.role === 'employee' &&
							onAssignSupervisor && (
								<Button
									size="sm"
									variant="outline"
									onClick={() => onAssignSupervisor(user)}
									className="flex items-center gap-1"
								>
									<Link className="w-4 h-4" />
									Asignar
								</Button>
							)}

						<Button
							size="sm"
							variant={user.isActive ? 'outline' : 'primary'}
							onClick={handleToggleStatus}
							className="flex items-center gap-1"
						>
							{user.isActive ? (
								<>
									<UserX className="w-4 h-4" />
									Desactivar
								</>
							) : (
								<>
									<UserCheck className="w-4 h-4" />
									Activar
								</>
							)}
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
