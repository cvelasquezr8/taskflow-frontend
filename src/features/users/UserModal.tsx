import React, { useState, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../components/ui/Toast';
import { User, UserRole } from '../../types';

interface UserModalProps {
	isOpen: boolean;
	onClose: () => void;
	user?: User | null;
}

export const UserModal: React.FC<UserModalProps> = ({
	isOpen,
	onClose,
	user,
}) => {
	const { createUser, updateUser, deleteUser, loading } = useUserStore();
	const { showToast } = useToast();

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		role: 'employee' as UserRole,
		isActive: true,
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (user) {
			setFormData({
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				role: user.role,
				isActive: user.isActive,
			});
		} else {
			setFormData({
				firstName: '',
				lastName: '',
				email: '',
				role: 'employee',
				isActive: true,
			});
		}
		setErrors({});
	}, [user, isOpen]);

	const roleOptions = [
		{ value: 'employee', label: 'Employee' },
		{ value: 'supervisor', label: 'Supervisor' },
		{ value: 'admin', label: 'Administrator' },
	];

	const statusOptions = [
		{ value: 'true', label: 'Active' },
		{ value: 'false', label: 'Inactive' },
	];

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.firstName.trim()) {
			newErrors.firstName = 'First name is required';
		}

		if (!formData.lastName.trim()) {
			newErrors.lastName = 'Last name is required';
		}

		if (!formData.email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Email is invalid';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		try {
			const userData = {
				firstName: formData.firstName.trim(),
				lastName: formData.lastName.trim(),
				email: formData.email.trim().toLowerCase(),
				role: formData.role,
				isActive: formData.isActive,
			};

			if (user) {
				await updateUser(user.id, userData);
				showToast({
					type: 'success',
					title: 'Usuario Actualizado',
					message: 'El usuario ha sido actualizado correctamente',
				});
			} else {
				await createUser(userData);
				showToast({
					type: 'success',
					title: 'Usuario Creado',
					message: 'El nuevo usuario ha sido creado correctamente',
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
						: 'Fallo al procesar la solicitud',
			});
		}
	};

	const handleDelete = async () => {
		if (!user) return;

		if (
			window.confirm(
				`¿Estás seguro de que deseas eliminar a ${user.firstName} ${user.lastName}? Esta acción no se puede deshacer.`,
			)
		) {
			try {
				await deleteUser(user.id);
				showToast({
					type: 'success',
					title: 'Usuario Eliminado',
					message: 'El usuario ha sido eliminado correctamente',
				});
				onClose();
			} catch (error) {
				showToast({
					type: 'error',
					title: 'Error',
					message: 'Fallo al eliminar el usuario',
				});
			}
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;

		if (name === 'isActive') {
			setFormData((prev) => ({ ...prev, [name]: value === 'true' }));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}

		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: '' }));
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={user ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
			size="md"
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Input
						label="Primer Nombre"
						name="firstName"
						value={formData.firstName}
						onChange={handleChange}
						error={errors.firstName}
						placeholder="Ingrese el primer nombre"
						disabled={loading}
					/>

					<Input
						label="Apellido"
						name="lastName"
						value={formData.lastName}
						onChange={handleChange}
						error={errors.lastName}
						placeholder="Ingrese el apellido"
						disabled={loading}
					/>
				</div>

				<Input
					label="Email"
					name="email"
					type="email"
					value={formData.email}
					onChange={handleChange}
					error={errors.email}
					placeholder="Ingrese la dirección de correo electrónico"
					disabled={loading}
				/>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Select
						label="Role"
						name="role"
						value={formData.role}
						onChange={handleChange}
						options={roleOptions}
						disabled={loading}
					/>

					<Select
						label="Estado"
						name="isActive"
						value={formData.isActive.toString()}
						onChange={handleChange}
						options={statusOptions}
						disabled={loading}
					/>
				</div>

				{!user && (
					<div className="p-4 bg-primary-50 rounded-lg">
						<p className="text-sm text-primary-700">
							<strong>Nota:</strong> Se generará una contraseña
							temporal para este usuario. Se le pedirá que la
							cambie en su primer inicio de sesión.
						</p>
					</div>
				)}

				<div className="flex justify-between pt-4">
					<div>
						{user && (
							<Button
								type="button"
								variant="danger"
								onClick={handleDelete}
								disabled={loading}
							>
								Eliminar Usuario
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
							{user ? 'Actualizar Usuario' : 'Crear Usuario'}
						</Button>
					</div>
				</div>
			</form>
		</Modal>
	);
};
