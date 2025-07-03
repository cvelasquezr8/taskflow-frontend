import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { LoginForm } from './features/auth/LoginForm';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Users } from './pages/Users';
import { Unauthorized } from './pages/Unauthorized';
import { useAuthStore } from './store/authStore';

function App() {
	const { isAuthenticated } = useAuthStore();

	return (
		<ToastProvider>
			<Router>
				<Routes>
					{/* Public routes */}
					<Route
						path="/login"
						element={
							isAuthenticated ? (
								<Navigate to="/dashboard" replace />
							) : (
								<LoginForm />
							)
						}
					/>
					<Route path="/unauthorized" element={<Unauthorized />} />

					{/* Protected routes */}
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<Layout>
									<Dashboard />
								</Layout>
							</ProtectedRoute>
						}
					/>

					<Route
						path="/tasks"
						element={
							<ProtectedRoute>
								<Layout>
									<Tasks />
								</Layout>
							</ProtectedRoute>
						}
					/>

					<Route
						path="/users"
						element={
							<ProtectedRoute requiredRoles={['admin']}>
								<Layout>
									<Users />
								</Layout>
							</ProtectedRoute>
						}
					/>

					{/* Default redirect */}
					<Route
						path="/"
						element={<Navigate to="/dashboard" replace />}
					/>
					<Route
						path="*"
						element={<Navigate to="/dashboard" replace />}
					/>
				</Routes>
			</Router>
		</ToastProvider>
	);
}

export default App;
