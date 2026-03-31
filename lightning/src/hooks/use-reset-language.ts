import { useDemo } from "@/components/DemoProvider";
import { useUpdateProfile } from "@/hooks/use-update-profile";
import { LanguageService } from "@/lib/services/language";

const ENGLISH = LanguageService.LANGUAGES.find((l) => l.code === "en-US")!;
const ENGLISH_VOICE = LanguageService.ELEVEN_LABS_VOICES.en[0];

export function useResetLanguage() {
  const { isPhone1, phone1 } = useDemo();
  const { mutate: updateProfile } = useUpdateProfile();

  return function resetLanguage() {
    if (isPhone1) {
      updateProfile({
        phoneNumber: phone1,
        sourceLanguage: ENGLISH.code,
        sourceLanguageCode: ENGLISH.translateCode,
        sourceLanguageFriendly: ENGLISH.friendly,
        sourceVoice: ENGLISH_VOICE,
      });
    } else {
      updateProfile({
        phoneNumber: phone1,
        calleeLanguage: ENGLISH.code,
        calleeLanguageCode: ENGLISH.translateCode,
        calleeLanguageFriendly: ENGLISH.friendly,
        calleeVoice: ENGLISH_VOICE,
      });
    }
  };
}
