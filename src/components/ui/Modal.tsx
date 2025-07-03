import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	size = 'md',
	children,
}) => {
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const sizes = {
		sm: 'max-w-md',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl',
	};

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto">
			<div className="flex min-h-screen items-center justify-center p-2 sm:p-4">
				<div
					className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
					onClick={onClose}
				/>
				<div
					className={`relative bg-white rounded-lg shadow-xl w-full mx-2 sm:mx-4 ${sizes[size]} max-h-[90vh] overflow-hidden flex flex-col`}
				>
					{title && (
						<div className="flex items-center justify-between p-4 sm:p-6 border-b border-secondary-200 flex-shrink-0">
							<h3 className="text-base sm:text-lg font-semibold text-secondary-900 pr-4">
								{title}
							</h3>
							<button
								onClick={onClose}
								className="text-secondary-400 hover:text-secondary-600 transition-colors p-1 flex-shrink-0"
							>
								<X className="w-5 h-5" />
							</button>
						</div>
					)}
					<div className="p-4 sm:p-6 overflow-y-auto flex-1">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
};
