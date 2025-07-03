import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { LoginCredentials } from '../../types';

export const LoginForm: React.FC = () => {
	const [credentials, setCredentials] = useState<LoginCredentials>({
		email: '',
		password: '',
	});
	const [errors, setErrors] = useState<Partial<LoginCredentials>>({});

	const { login, loading } = useAuthStore();
	const { showToast } = useToast();
	const navigate = useNavigate();

	const from = '/dashboard';

	const validateForm = (): boolean => {
		const newErrors: Partial<LoginCredentials> = {};

		if (!credentials.email) {
			newErrors.email = 'El correo electrónico es obligatorio';
		} else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
			newErrors.email = 'El correo electrónico no es válido';
		}

		if (!credentials.password) {
			newErrors.password = 'La contraseña es obligatoria';
		} else if (credentials.password.length < 6) {
			newErrors.password =
				'La contraseña debe tener al menos 6 caracteres';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		try {
			await login(credentials);
			showToast({
				type: 'success',
				title: 'Inicio de sesión exitoso',
				message: '¡Bienvenido de nuevo!',
			});
			navigate(from, { replace: true });
		} catch (error) {
			showToast({
				type: 'error',
				title: 'Error de inicio de sesión',
				message:
					error instanceof Error
						? error.message
						: 'Credenciales inválidas',
			});
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setCredentials((prev) => ({ ...prev, [name]: value }));
		if (errors[name as keyof LoginCredentials]) {
			setErrors((prev) => ({ ...prev, [name]: '' }));
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-background px-4">
			<Card className="w-full max-w-md">
				<CardContent>
					<div className="text-center mb-8">
						<h1 className="text-2xl font-bold text-secondary-900">
							¡Bienvenido de nuevo!
						</h1>
						<p className="text-secondary-600 mt-2">
							Inicia sesión en tu cuenta de TaskFlow
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<Input
							label="Email"
							type="email"
							name="email"
							value={credentials.email}
							onChange={handleChange}
							error={errors.email}
							placeholder="Ingresa tu correo electrónico"
							disabled={loading}
						/>

						<Input
							label="Contraseña"
							type="password"
							name="password"
							value={credentials.password}
							onChange={handleChange}
							error={errors.password}
							placeholder="Ingresa tu contraseña"
							disabled={loading}
						/>

						<Button
							type="submit"
							className="w-full"
							loading={loading}
							disabled={loading}
						>
							Iniciar sesión
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};
