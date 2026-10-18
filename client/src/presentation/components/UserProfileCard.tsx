import type { User } from '../../domain/models';

interface UserProfileCardProps {
  user: User;
  onEdit?: () => void;
  isLoading?: boolean;
}

export default function UserProfileCard({ user, onEdit, isLoading = false }: UserProfileCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h2>
        {onEdit && (
          <button
            onClick={onEdit}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      <div className="flex items-start gap-4">
        {user.avatar && (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {user.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{user.email}</p>
          {user.bio && (
            <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">{user.bio}</p>
          )}
          {user.createdAt && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
