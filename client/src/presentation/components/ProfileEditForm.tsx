import { useState, type FormEvent } from 'react';

interface ProfileEditFormProps {
  initialName: string;
  initialBio: string;
  isSubmitting: boolean;
  errorMessage?: string;
  onSubmit: (name: string, bio: string) => void;
  onCancel: () => void;
}

const inputClassName =
  'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white';

export default function ProfileEditForm({
  initialName,
  initialBio,
  isSubmitting,
  errorMessage,
  onSubmit,
  onCancel,
}: ProfileEditFormProps) {
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(name, bio);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Profile</h2>

      {errorMessage && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClassName}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className={inputClassName}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
