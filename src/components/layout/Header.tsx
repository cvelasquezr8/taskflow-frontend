import React from 'react';
import { LogOut, User, Bell } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
	const { user, logout } = useAuthStore();

	const handleLogout = () => {
		logout();
	};

	return (
		<header className="bg-surface border-b border-secondary-200 px-6 py-4">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-xl font-bold text-primary-600">
						TaskFlow
					</h1>
					<p className="text-sm text-secondary-600">
						Sistema de Gestión de Tareas
					</p>
				</div>

				<div className="flex items-center space-x-4">
					{/* Notifications */}
					<button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors">
						<Bell className="w-5 h-5" />
					</button>

					{/* User Menu */}
					<div className="flex items-center space-x-3">
						<div className="text-right">
							<p className="text-sm font-medium text-secondary-900">
								{user?.firstName} {user?.lastName}
							</p>
							<p className="text-xs text-secondary-600 capitalize">
								{user?.role}
							</p>
						</div>

						<div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
							<User className="w-4 h-4 text-primary-600" />
						</div>

						<Button
							variant="ghost"
							size="sm"
							onClick={handleLogout}
							className="text-secondary-600 hover:text-error-600"
						>
							<LogOut className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
};
