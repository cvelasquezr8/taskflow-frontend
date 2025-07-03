import React, { useState, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { User } from '../../types';
import { Users, UserCheck, UserX, ArrowRight } from 'lucide-react';

interface SupervisorAssignmentModalProps {
	isOpen: boolean;
	onClose: () => void;
	employee: User | null;
}

export const SupervisorAssignmentModal: React.FC<
	SupervisorAssignmentModalProps
> = ({ isOpen, onClose, employee }) => {
	const { users, updateUser, loading } = useUserStore();
	const { showToast } = useToast();

	const [selectedSupervisorId, setSelectedSupervisorId] = useState('');

	useEffect(() => {
		if (employee) {
			setSelectedSupervisorId(employee.supervisorId || '');
		}
	}, [employee, isOpen]);

	const supervisors = users.filter(
		(user) => user.role === 'supervisor' && user.isActive,
	);

	const supervisorOptions = [
		{ value: '', label: 'No Supervisor (Sin Asignar)' },
		...supervisors.map((supervisor) => ({
			value: supervisor.id,
			label: `${supervisor.firstName} ${supervisor.lastName}`,
		})),
	];

	const handleAssign = async () => {
		if (!employee) return;

		try {
			await updateUser(employee.id, {
				supervisorId: selectedSupervisorId || undefined,
			});

			const supervisorName = selectedSupervisorId
				? supervisors.find((s) => s.id == selectedSupervisorId)
						?.firstName +
				  ' ' +
				  supervisors.find((s) => s.id == selectedSupervisorId)
						?.lastName
				: 'No supervisor';

			showToast({
				type: 'success',
				title: 'Asignación Actualizada',
				message: `${employee.firstName} ${employee.lastName} ha sido asignado a ${supervisorName}`,
			});

			onClose();
		} catch (error) {
			showToast({
				type: 'error',
				title: 'Error',
				message: 'Fallo al asignar supervisor. Inténtalo de nuevo.',
			});
		}
	};

	const currentSupervisor = employee?.supervisorId
		? supervisors.find((s) => s.id == employee.supervisorId)
		: null;

	const newSupervisor = selectedSupervisorId
		? supervisors.find((s) => s.id == selectedSupervisorId)
		: null;

	if (!employee) return null;

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Asignar Supervisor"
			size="md"
		>
			<div className="space-y-6">
				{/* Employee Info */}
				<div className="flex items-center gap-3 p-4 bg-secondary-50 rounded-lg">
					<div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
						<span className="text-sm font-medium text-primary-700">
							{employee.firstName.charAt(0)}
							{employee.lastName.charAt(0)}
						</span>
					</div>
					<div>
						<h3 className="font-medium text-secondary-900">
							{employee.firstName} {employee.lastName}
						</h3>
						<p className="text-sm text-secondary-600">
							{employee.email}
						</p>
					</div>
					<Badge variant="info" size="sm">
						Empleado
					</Badge>
				</div>

				{/* Current Assignment */}
				<div className="space-y-3">
					<h4 className="font-medium text-secondary-900">
						Asignación Actual
					</h4>
					<div className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg">
						{currentSupervisor ? (
							<>
								<UserCheck className="w-5 h-5 text-accent-600" />
								<div>
									<p className="font-medium text-secondary-900">
										{currentSupervisor.firstName}{' '}
										{currentSupervisor.lastName}
									</p>
									<p className="text-sm text-secondary-600">
										{currentSupervisor.email}
									</p>
								</div>
								<Badge variant="success" size="sm">
									Asignado
								</Badge>
							</>
						) : (
							<>
								<UserX className="w-5 h-5 text-secondary-400" />
								<div>
									<p className="font-medium text-secondary-600">
										No supervisor asignado
									</p>
									<p className="text-sm text-secondary-500">
										Empleado no asignado
									</p>
								</div>
								<Badge variant="warning" size="sm">
									No Asignado
								</Badge>
							</>
						)}
					</div>
				</div>

				{/* New Assignment */}
				<div className="space-y-3">
					<h4 className="font-medium text-secondary-900">
						Nueva Asignación
					</h4>
					<Select
						label="Seleccionar Supervisor"
						value={selectedSupervisorId}
						onChange={(e) =>
							setSelectedSupervisorId(e.target.value)
						}
						options={supervisorOptions}
						placeholder="Seleccionar un supervisor..."
					/>

					{/* Assignment Preview */}
					{selectedSupervisorId !== (employee.supervisorId || '') && (
						<div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
							<div className="flex items-center justify-center gap-4">
								<div className="text-center">
									<div className="w-8 h-8 bg-secondary-200 rounded-full flex items-center justify-center mx-auto mb-1">
										<span className="text-xs font-medium text-secondary-700">
											{employee.firstName.charAt(0)}
											{employee.lastName.charAt(0)}
										</span>
									</div>
									<p className="text-sm font-medium text-secondary-900">
										{employee.firstName}
									</p>
									<p className="text-xs text-secondary-600">
										Empleado
									</p>
								</div>

								<ArrowRight className="w-5 h-5 text-primary-600" />

								<div className="text-center">
									{newSupervisor ? (
										<>
											<div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-1">
												<span className="text-xs font-medium text-primary-700">
													{newSupervisor.firstName.charAt(
														0,
													)}
													{newSupervisor.lastName.charAt(
														0,
													)}
												</span>
											</div>
											<p className="text-sm font-medium text-secondary-900">
												{newSupervisor.firstName}
											</p>
											<p className="text-xs text-secondary-600">
												Supervisor
											</p>
										</>
									) : (
										<>
											<div className="w-8 h-8 bg-secondary-200 rounded-full flex items-center justify-center mx-auto mb-1">
												<UserX className="w-4 h-4 text-secondary-500" />
											</div>
											<p className="text-sm font-medium text-secondary-600">
												No Asignado
											</p>
											<p className="text-xs text-secondary-500">
												No supervisor
											</p>
										</>
									)}
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Supervisor Team Info */}
				{newSupervisor && (
					<div className="p-3 bg-accent-50 rounded-lg">
						<h5 className="font-medium text-accent-900 mb-2">
							Información del Equipo
						</h5>
						<div className="flex items-center gap-2 text-sm text-accent-700">
							<Users className="w-4 h-4" />
							<span>
								{
									users.filter(
										(u) =>
											u.supervisorId == newSupervisor.id,
									).length
								}{' '}
								members del equipo actual
							</span>
						</div>
					</div>
				)}

				{/* Actions */}
				<div className="flex justify-end gap-3 pt-4 border-t">
					<Button
						variant="outline"
						onClick={onClose}
						disabled={loading}
					>
						Cancelar
					</Button>
					<Button
						onClick={handleAssign}
						loading={loading}
						disabled={
							loading ||
							selectedSupervisorId ==
								(employee.supervisorId || '')
						}
					>
						{selectedSupervisorId
							? 'Asignar Supervisor'
							: 'Eliminar Asignación'}
					</Button>
				</div>
			</div>
		</Modal>
	);
};
