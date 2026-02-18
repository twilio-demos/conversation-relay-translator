"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LanguageService } from "@/lib/services/language";
import { UserProfile } from "@/types/profile";
import { useEffect } from "react";
import { FormikCheckbox } from "../formik/formik-checkbox";
import { FormikInput } from "../formik/formik-input";

interface ProfileFormProps {
  values: UserProfile;
  isSubmitting: boolean;
  onFieldChange: (field: keyof UserProfile, value: any) => void;
  onLanguageChange: (type: "source" | "callee", languageCode: string) => void;
  onProviderChange: (type: "source" | "callee", provider: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
}

export function ProfileForm({
  values,
  isSubmitting,
  onFieldChange,
  onProviderChange,
  onLanguageChange,
  onSubmit,
  onCancel,
}: ProfileFormProps) {
  const callerVoices =
    values.sourceTtsProvider === "ElevenLabs"
      ? LanguageService.ELEVEN_LABS_VOICES
      : values.sourceTtsProvider === "Amazon"
      ? LanguageService.AMAZON_VOICES
      : LanguageService.GOOGLE_VOICES;
  const calleeVoices =
    values.calleeTtsProvider === "ElevenLabs"
      ? LanguageService.ELEVEN_LABS_VOICES
      : values.calleeTtsProvider === "Amazon"
      ? LanguageService.AMAZON_VOICES
      : LanguageService.GOOGLE_VOICES;

  const filteredLanguagesForCaller = LanguageService.LANGUAGES.filter(
    (lang) =>
      (values.sourceTtsProvider !== "Google" || lang.code !== "es-MX") &&
      (values.sourceTtsProvider !== "Amazon" || lang.code !== "pl-PL")
  );
  const filteredLanguagesForCallee = LanguageService.LANGUAGES.filter(
    (lang) =>
      (values.calleeTtsProvider !== "Google" || lang.code !== "es-MX") &&
      (values.calleeTtsProvider !== "Amazon" || lang.code !== "pl-PL")
  );

  useEffect(() => {
    console.log({ values });
  }, [values]);

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex flex-col gap-2">
              <span>Caller Settings</span>
              <span className="text-sm font-normal text-muted-foreground">
                Your caller settings
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6">
            <FormikInput name="name" label="Name" type="text" required />
            <FormikInput
              name="phoneNumber"
              label="Your Phone Number"
              type="tel"
              placeholder="+1234567890"
              required
            />
            <div className="space-y-2">
              <Label htmlFor="sourceLanguage">Language</Label>
              <Select
                value={values.sourceLanguage}
                onValueChange={(value) => onLanguageChange("source", value)}>
                <SelectTrigger id="sourceLanguage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filteredLanguagesForCaller.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.friendly}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceVoice">Voice</Label>
              <Select
                value={values.sourceVoice}
                onValueChange={(value) => {
                  if (!value) return;
                  onFieldChange("sourceVoice", value);
                }}>
                <SelectTrigger id="sourceVoice">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    callerVoices[
                      values.sourceLanguageCode as keyof typeof callerVoices
                    ] as string[] | undefined
                  )?.map((voice) => (
                    <SelectItem key={voice} value={voice}>
                      {values.sourceTtsProvider === "ElevenLabs"
                        ? LanguageService.ELEVEN_LABS_VOICES_TO_FRIENDLY[
                            voice as keyof typeof LanguageService.ELEVEN_LABS_VOICES_TO_FRIENDLY
                          ] || voice
                        : values.sourceTtsProvider === "Google"
                        ? LanguageService.getGoogleVoiceFriendlyName(voice)
                        : voice}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceTranscriptionProvider">
                Transcription Provider
              </Label>
              <Select
                value={values.sourceTranscriptionProvider}
                onValueChange={(value) =>
                  onFieldChange("sourceTranscriptionProvider", value)
                }>
                <SelectTrigger id="sourceTranscriptionProvider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Deepgram">Deepgram</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceTtsProvider">TTS Provider</Label>
              <Select
                value={values.sourceTtsProvider}
                onValueChange={(value) => onProviderChange("source", value)}>
                <SelectTrigger id="sourceTtsProvider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Amazon">Amazon</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                  <SelectItem value="ElevenLabs">ElevenLabs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {values.sourceTtsProvider === "ElevenLabs" && (
            <div className="mt-6 pt-6 border-t">
              <CardTitle className="text-md">ElevenLabs Settings</CardTitle>
              <FormikInput
                label="Voice Hash"
                name="customSourceHash"
                description="Use this to enter any ElevenLabs hash for the selected language"
                placeholder="Enter custom voice hash or select from dropdown above"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex flex-col gap-2">
              <span>Callee Settings</span>
              <span className="text-sm font-normal text-muted-foreground">
                Settings for who you are calling
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 border-t pt-6">
            <FormikCheckbox
              name="calleeDetails"
              label="Use Callee Number"
              disabled={values.useFlex}
              description={
                values.useFlex
                  ? "Can't enable Callee Number when Flex is enabled"
                  : undefined
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormikInput
              name="calleeNumber"
              label="Callee Phone Number"
              type="tel"
              placeholder="+1234567890"
              className="md:col-span-2"
              disabled={values.useFlex}
            />
            <div className="space-y-2">
              <Label htmlFor="calleeLanguage">Language</Label>
              <Select
                value={values.calleeLanguage}
                onValueChange={(value) => onLanguageChange("callee", value)}>
                <SelectTrigger id="calleeLanguage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filteredLanguagesForCallee.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.friendly}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="calleeVoice">Voice</Label>
              <Select
                value={values.calleeVoice}
                onValueChange={(value) => {
                  if (!value) return;
                  onFieldChange("calleeVoice", value);
                }}>
                <SelectTrigger id="calleeVoice">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    calleeVoices[
                      values.calleeLanguageCode as keyof typeof calleeVoices
                    ] as string[] | undefined
                  )?.map((voice) => (
                    <SelectItem key={voice} value={voice}>
                      {values.calleeTtsProvider === "ElevenLabs"
                        ? LanguageService.ELEVEN_LABS_VOICES_TO_FRIENDLY[
                            voice as keyof typeof LanguageService.ELEVEN_LABS_VOICES_TO_FRIENDLY
                          ] || voice
                        : values.calleeTtsProvider === "Google"
                        ? LanguageService.getGoogleVoiceFriendlyName(voice)
                        : voice}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="calleeTranscriptionProvider">
                Transcription Provider
              </Label>
              <Select
                value={values.calleeTranscriptionProvider}
                onValueChange={(value) =>
                  onFieldChange("calleeTranscriptionProvider", value)
                }>
                <SelectTrigger id="calleeTranscriptionProvider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Deepgram">Deepgram</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="calleeTtsProvider">TTS Provider</Label>
              <Select
                value={values.calleeTtsProvider}
                onValueChange={(value) => onProviderChange("callee", value)}>
                <SelectTrigger id="calleeTtsProvider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Amazon">Amazon</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                  <SelectItem value="ElevenLabs">ElevenLabs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {values.calleeTtsProvider === "ElevenLabs" && (
            <div className="mt-6 pt-6 border-t">
              <CardTitle className="text-md">ElevenLabs Settings</CardTitle>
              <FormikInput
                label="Voice Hash"
                name="customCalleeHash"
                description="Use this to enter any ElevenLabs hash for the selected language"
                placeholder="Enter custom voice hash or select from dropdown above"
              />
            </div>
          )}
        </CardContent>

        <div className="px-6 pb-6">
          <div className="mb-4 border-t pt-6">
            <div className="flex flex-col gap-1 mb-4">
              <h3 className="text-lg font-semibold">
                Flex Settings (optional)
              </h3>
              <span className="text-sm text-muted-foreground">
                Either use the default Flex account (make sure you have access)
                or use your own Flex account by enabling "Use External Flex"
                below and entering the number for your handoff to Flex. Enter in
                the worker handle for the Flex worker that will be picking up
                your call.
              </span>
            </div>
            <div className="flex flex-col rounded-lg space-y-4">
              <FormikCheckbox
                name="useFlex"
                label="Use Twilio Flex"
                disabled={values.calleeDetails}
                description={
                  values.calleeDetails
                    ? "Flex is not available with Callee Enabled"
                    : undefined
                }
              />
              <div className="grid grid-cols-1 gap-4">
                <FormikInput
                  name="flexNumber"
                  label="Flex Number"
                  type="tel"
                  placeholder="+1234567890"
                  className="md:col-span-2"
                  disabled
                />
                <FormikInput
                  name="flexWorkerHandle"
                  label="Flex Worker Handle"
                  placeholder="jpyles"
                  disabled={values.calleeDetails}
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <FormikCheckbox
                  name="useExternalFlex"
                  label="Use External Flex"
                  disabled={values.calleeDetails || !values.useFlex}
                  description={
                    values.calleeDetails
                      ? "External flex is not available with Callee Enabled"
                      : undefined
                  }
                />
                <FormikInput
                  name="externalFlexNumber"
                  label="External Flex Number"
                  type="tel"
                  placeholder="+1234567890"
                  disabled={values.calleeDetails || !values.useExternalFlex}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel || (() => window.history.back())}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  );
}
