import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Users } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Sidebar: React.FC = () => {
	const { user } = useAuthStore();

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

	return (
		<aside className="w-64 bg-surface border-r border-secondary-200 h-full">
			<nav className="p-4 space-y-2">
				{filteredNavigation.map((item) => (
					<NavLink
						key={item.name}
						to={item.href}
						className={({ isActive }) =>
							`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
								isActive
									? 'bg-primary-100 text-primary-700'
									: 'text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900'
							}`
						}
					>
						<item.icon className="w-5 h-5 mr-3" />
						{item.name}
					</NavLink>
				))}
			</nav>
		</aside>
	);
};
