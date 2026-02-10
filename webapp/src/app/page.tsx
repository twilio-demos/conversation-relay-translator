import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
        ConversationRelay Translator
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/profiles"
          className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
            User Profiles
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Manage caller and callee language settings, voices, and phone
            numbers
          </p>
        </Link>

        <Link
          href="/sessions"
          className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
            Call Sessions
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            View active and past translation sessions
          </p>
        </Link>
      </div>
    </div>
  );
}
