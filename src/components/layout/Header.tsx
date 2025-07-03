import React, { useState } from 'react';
import { LogOut, User, Bell, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
	const { user, logout } = useAuthStore();
	const [showMobileMenu, setShowMobileMenu] = useState(false);

	const handleLogout = () => {
		logout();
		setShowMobileMenu(false);
	};

	return (
		<header className="bg-surface border-b border-secondary-200 px-4 sm:px-6 py-3 sm:py-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div>
						<h1 className="text-lg sm:text-xl font-bold text-primary-600">
							TaskFlow
						</h1>
						<p className="text-xs sm:text-sm text-secondary-600 hidden sm:block">
							Sistema de Gestión de Tareas
						</p>
					</div>
				</div>

				{/* Desktop Menu */}
				<div className="hidden sm:flex items-center space-x-4">
					{/* Notifications */}
					<button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors">
						<Bell className="w-5 h-5" />
					</button>

					{/* User Menu */}
					<div className="flex items-center space-x-3">
						<div className="text-right hidden md:block">
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

				{/* Mobile Menu Button */}
				<div className="sm:hidden">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setShowMobileMenu(!showMobileMenu)}
						className="p-2"
					>
						{showMobileMenu ? (
							<X className="w-5 h-5" />
						) : (
							<Menu className="w-5 h-5" />
						)}
					</Button>
				</div>
			</div>

			{/* Mobile Menu */}
			{showMobileMenu && (
				<div className="sm:hidden mt-4 pt-4 border-t border-secondary-200">
					<div className="space-y-4">
						{/* User Info */}
						<div className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg">
							<div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
								<User className="w-5 h-5 text-primary-600" />
							</div>
							<div>
								<p className="font-medium text-secondary-900">
									{user?.firstName} {user?.lastName}
								</p>
								<p className="text-sm text-secondary-600 capitalize">
									{user?.role}
								</p>
							</div>
						</div>

						{/* Actions */}
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								className="flex-1 flex items-center justify-center gap-2"
							>
								<Bell className="w-4 h-4" />
								Notificaciones
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleLogout}
								className="flex-1 flex items-center justify-center gap-2 text-error-600 hover:text-error-700"
							>
								<LogOut className="w-4 h-4" />
								Cerrar sesión
							</Button>
						</div>
					</div>
				</div>
			)}
		</header>
	);
};
