"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES, UserProfile, VOICES } from "@/types/profile";
import { FormikInput } from "../formik/formik-input";

interface ProfileFormProps {
  values: UserProfile;
  isSubmitting: boolean;
  onFieldChange: (field: keyof UserProfile, value: any) => void;
  onLanguageChange: (type: "source" | "callee", languageCode: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
}

export function ProfileForm({
  values,
  isSubmitting,
  onFieldChange,
  onLanguageChange,
  onSubmit,
  onCancel,
}: ProfileFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormikInput name="name" label="Name" type="text" required />
            <FormikInput
              name="phoneNumber"
              label="Phone Number"
              type="tel"
              placeholder="+1234567890"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Caller Settings */}
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
            <div className="space-y-2">
              <Label htmlFor="sourceLanguage">Language</Label>
              <Select
                value={values.sourceLanguage}
                onValueChange={(value) => onLanguageChange("source", value)}>
                <SelectTrigger id="sourceLanguage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
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
                onValueChange={(value) => onFieldChange("sourceVoice", value)}>
                <SelectTrigger id="sourceVoice">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VOICES[
                    values.sourceLanguageCode as keyof typeof VOICES
                  ]?.map((voice) => (
                    <SelectItem key={voice} value={voice}>
                      {voice}
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
                onValueChange={(value) =>
                  onFieldChange("sourceTtsProvider", value)
                }>
                <SelectTrigger id="sourceTtsProvider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Amazon">Amazon</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Callee Settings */}
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
          <div className="mb-4 flex items-center space-x-2 border-t pt-6">
            <Checkbox
              id="calleeDetails"
              checked={values.calleeDetails}
              onCheckedChange={(checked) =>
                onFieldChange("calleeDetails", checked)
              }
            />
            <Label
              htmlFor="calleeDetails"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Use custom callee details
            </Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormikInput
              name="calleeNumber"
              label="Callee Phone Number"
              type="tel"
              placeholder="+1234567890"
              className="md:col-span-2"
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
                  {LANGUAGES.map((lang) => (
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
                onValueChange={(value) => onFieldChange("calleeVoice", value)}>
                <SelectTrigger id="calleeVoice">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VOICES[
                    values.calleeLanguageCode as keyof typeof VOICES
                  ]?.map((voice) => (
                    <SelectItem key={voice} value={voice}>
                      {voice}
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
                onValueChange={(value) =>
                  onFieldChange("calleeTtsProvider", value)
                }>
                <SelectTrigger id="calleeTtsProvider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Amazon">Amazon</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>

        {/* Flex Settings - Subsection within Callee Settings */}
        <div className="px-6 pb-6">
          <div className="mb-4 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Flex Settings</h3>
            <div className="rounded-lg space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useFlex"
                  checked={values.useFlex}
                  onCheckedChange={(checked) =>
                    onFieldChange("useFlex", checked)
                  }
                />
                <Label
                  htmlFor="useFlex"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Use Twilio Flex
                </Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormikInput
                  name="flexNumber"
                  label="Flex Number"
                  type="tel"
                  placeholder="+1234567890"
                  className="md:col-span-2"
                />
                <FormikInput
                  name="flexWorkerHandle"
                  label="Flex Worker Handle"
                  placeholder="jpyles"
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
