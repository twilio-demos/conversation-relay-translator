"use client";

import { useState } from "react";
import { UserProfile, LANGUAGES, VOICES } from "@/types/profile";

interface ProfileFormProps {
  profile?: UserProfile;
  onSubmit: (profile: UserProfile) => Promise<void>;
}

export function ProfileForm({ profile, onSubmit }: ProfileFormProps) {
  const [formData, setFormData] = useState<UserProfile>(
    profile || {
      phoneNumber: "",
      name: "",
      sourceLanguage: "en-US",
      sourceLanguageCode: "en",
      sourceLanguageFriendly: "English - United States",
      sourceTranscriptionProvider: "Deepgram",
      sourceTtsProvider: "Amazon",
      sourceVoice: "Matthew-Generative",
      calleeDetails: true,
      calleeNumber: "",
      calleeLanguage: "es-MX",
      calleeLanguageCode: "es-MX",
      calleeLanguageFriendly: "Spanish - Mexico",
      calleeTranscriptionProvider: "Deepgram",
      calleeTtsProvider: "Amazon",
      calleeVoice: "Lupe-Generative",
      useFlex: false,
      flexNumber: "",
      flexWorkerHandle: "",
    }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof UserProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLanguageChange = (
    type: "source" | "callee",
    languageCode: string
  ) => {
    const language = LANGUAGES.find((l) => l.code === languageCode);
    if (!language) return;

    if (type === "source") {
      updateField("sourceLanguage", language.code);
      updateField("sourceLanguageCode", language.translateCode);
      updateField("sourceLanguageFriendly", language.friendly);
    } else {
      updateField("calleeLanguage", language.code);
      updateField("calleeLanguageCode", language.translateCode);
      updateField("calleeLanguageFriendly", language.friendly);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => updateField("phoneNumber", e.target.value)}
              placeholder="+1234567890"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Caller Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Caller Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Language
            </label>
            <select
              value={formData.sourceLanguage}
              onChange={(e) => handleLanguageChange("source", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.friendly}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Voice
            </label>
            <select
              value={formData.sourceVoice}
              onChange={(e) => updateField("sourceVoice", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {VOICES[formData.sourceLanguageCode as keyof typeof VOICES]?.map(
                (voice) => (
                  <option key={voice} value={voice}>
                    {voice}
                  </option>
                )
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Transcription Provider
            </label>
            <select
              value={formData.sourceTranscriptionProvider}
              onChange={(e) =>
                updateField("sourceTranscriptionProvider", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Deepgram">Deepgram</option>
              <option value="Google">Google</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              TTS Provider
            </label>
            <select
              value={formData.sourceTtsProvider}
              onChange={(e) => updateField("sourceTtsProvider", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Amazon">Amazon</option>
              <option value="Google">Google</option>
            </select>
          </div>
        </div>
      </div>

      {/* Callee Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Callee Settings
        </h2>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.calleeDetails}
              onChange={(e) => updateField("calleeDetails", e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Use custom callee details
            </span>
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Callee Phone Number
            </label>
            <input
              type="tel"
              value={formData.calleeNumber}
              onChange={(e) => updateField("calleeNumber", e.target.value)}
              placeholder="+1234567890"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Language
            </label>
            <select
              value={formData.calleeLanguage}
              onChange={(e) => handleLanguageChange("callee", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.friendly}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Voice
            </label>
            <select
              value={formData.calleeVoice}
              onChange={(e) => updateField("calleeVoice", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {VOICES[formData.calleeLanguageCode as keyof typeof VOICES]?.map(
                (voice) => (
                  <option key={voice} value={voice}>
                    {voice}
                  </option>
                )
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Transcription Provider
            </label>
            <select
              value={formData.calleeTranscriptionProvider}
              onChange={(e) =>
                updateField("calleeTranscriptionProvider", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Deepgram">Deepgram</option>
              <option value="Google">Google</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              TTS Provider
            </label>
            <select
              value={formData.calleeTtsProvider}
              onChange={(e) => updateField("calleeTtsProvider", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Amazon">Amazon</option>
              <option value="Google">Google</option>
            </select>
          </div>
        </div>
      </div>

      {/* Flex Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Twilio Flex Settings
        </h2>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.useFlex}
              onChange={(e) => updateField("useFlex", e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Use Twilio Flex
            </span>
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Flex Worker Handle
            </label>
            <input
              type="text"
              value={formData.flexWorkerHandle}
              onChange={(e) => updateField("flexWorkerHandle", e.target.value)}
              placeholder="worker@example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Flex Number
            </label>
            <input
              type="tel"
              value={formData.flexNumber || ""}
              onChange={(e) => updateField("flexNumber", e.target.value)}
              placeholder="+1234567890"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}
