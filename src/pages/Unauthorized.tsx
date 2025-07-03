import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export const Unauthorized: React.FC = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-background px-4">
			<Card className="w-full max-w-md">
				<CardContent className="text-center py-8">
					<ShieldX className="w-16 h-16 text-error-500 mx-auto mb-4" />
					<h1 className="text-2xl font-bold text-secondary-900 mb-2">
						Acceso Denegado
					</h1>
					<p className="text-secondary-600 mb-6">
						No tienes permiso para acceder a este recurso.
					</p>
					<Link to="/dashboard">
						<Button>Volver al Tablero</Button>
					</Link>
				</CardContent>
			</Card>
		</div>
	);
};
