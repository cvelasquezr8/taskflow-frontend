import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Users, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Sidebar: React.FC = () => {
	const { user } = useAuthStore();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const navigation = [
		{
			name: 'Dashboard',
			href: '/dashboard',
			icon: LayoutDashboard,
			roles: ['admin', 'supervisor', 'employee'],
		},
		{
			name: 'Tareas',
			href: '/tasks',
			icon: CheckSquare,
			roles: ['admin', 'supervisor', 'employee'],
		},
		{
			name: 'Usuarios',
			href: '/users',
			icon: Users,
			roles: ['admin'],
		},
	];

	const filteredNavigation = navigation.filter((item) =>
		item.roles.includes(user?.role || ''),
	);

	const closeMobileMenu = () => setIsMobileMenuOpen(false);

	return (
		<>
			{/* Mobile Menu Button - Fixed Position */}
			<button
				onClick={() => setIsMobileMenuOpen(true)}
				className="lg:hidden fixed bottom-4 right-4 z-40 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
			>
				<Menu className="w-6 h-6" />
			</button>

			{/* Mobile Overlay */}
			{isMobileMenuOpen && (
				<div
					className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
					onClick={closeMobileMenu}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-surface border-r border-secondary-200 
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${
			isMobileMenuOpen
				? 'translate-x-0'
				: '-translate-x-full lg:translate-x-0'
		}
      `}
			>
				{/* Mobile Header */}
				<div className="lg:hidden flex items-center justify-between p-4 border-b border-secondary-200">
					<h2 className="text-lg font-semibold text-secondary-900">
						Menu
					</h2>
					<button
						onClick={closeMobileMenu}
						className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Navigation */}
				<nav className="p-4 space-y-2">
					{filteredNavigation.map((item) => (
						<NavLink
							key={item.name}
							to={item.href}
							onClick={closeMobileMenu}
							className={({ isActive }) =>
								`flex items-center px-3 py-3 lg:py-2 rounded-lg text-sm font-medium transition-colors ${
									isActive
										? 'bg-primary-100 text-primary-700'
										: 'text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900'
								}`
							}
						>
							<item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
							<span className="truncate">{item.name}</span>
						</NavLink>
					))}
				</nav>
			</aside>
		</>
	);
};
