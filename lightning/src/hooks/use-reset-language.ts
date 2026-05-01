import { useDemo } from "@/components/DemoProvider";
import { useUpdateProfile } from "@/hooks/use-update-profile";
import { LanguageService } from "@/lib/services/language";

const ENGLISH = LanguageService.LANGUAGES.find((l) => l.code === "en-US")!;
const ENGLISH_VOICE = LanguageService.ELEVEN_LABS_VOICES.en[0];

export function useResetLanguage() {
  const { phone1 } = useDemo();
  const { mutate: updateProfile } = useUpdateProfile();

  return function resetLanguage() {
    const currentIsPhone1 = localStorage.getItem("admin_isPhone1") === "true";
    const currentPhone1 = localStorage.getItem("admin_phone1") ?? phone1;
    if (currentIsPhone1) {
      updateProfile({
        phoneNumber: currentPhone1,
        sourceLanguage: ENGLISH.code,
        sourceLanguageCode: ENGLISH.translateCode,
        sourceLanguageFriendly: ENGLISH.friendly,
        sourceVoice: ENGLISH_VOICE,
      });
    } else {
      updateProfile({
        phoneNumber: currentPhone1,
        calleeLanguage: ENGLISH.code,
        calleeLanguageCode: ENGLISH.translateCode,
        calleeLanguageFriendly: ENGLISH.friendly,
        calleeVoice: ENGLISH_VOICE,
      });
    }
  };
}
