"use client";

import { LanguageService } from "@/lib/services/language";
import { UserProfile } from "@/types/profile";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { ProfileForm } from "./profile-form";

interface ProfileFormFormikProps {
  profile?: UserProfile;
  onSubmit: (profile: UserProfile) => Promise<void>;
}

const profileValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  sourceLanguage: Yup.string().required("Source language is required"),
  sourceLanguageCode: Yup.string().required(),
  sourceLanguageFriendly: Yup.string().required(),
  sourceTranscriptionProvider: Yup.string().required(),
  sourceTtsProvider: Yup.string().required(),
  sourceVoice: Yup.string().when("customSourceHash", {
    is: (value: string) => !!value && value.length > 0,
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.required("Source voice is required"),
  }),
  calleeDetails: Yup.boolean().test(
    "at-least-one",
    "Either Callee Details or Flex must be enabled",
    function (value) {
      const { useFlex } = this.parent;
      return value === true || useFlex === true;
    }
  ),
  calleeNumber: Yup.string().when("calleeDetails", {
    is: true,
    then: (schema) => schema.required("Callee Number is required"),
    otherwise: (schema) => schema.optional(),
  }),
  calleeLanguage: Yup.string().required("Callee language is required"),
  calleeLanguageCode: Yup.string().required(),
  calleeLanguageFriendly: Yup.string().required(),
  calleeTranscriptionProvider: Yup.string().required(),
  calleeTtsProvider: Yup.string().required(),
  calleeVoice: Yup.string().when("customCalleeHash", {
    is: (value: string) => !!value && value.length > 0,
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.required("Callee voice is required"),
  }),
  useFlex: Yup.boolean().test(
    "at-least-one",
    "Either Callee Details or Flex must be enabled",
    function (value) {
      const { calleeDetails } = this.parent;
      return value === true || calleeDetails === true;
    }
  ),
  flexNumber: Yup.string().when("useFlex", {
    is: true,
    then: (schema) =>
      schema.required("Flex number is required when Flex is enabled"),
    otherwise: (schema) => schema.optional(),
  }),
  flexWorkerHandle: Yup.string().when("useFlex", {
    is: true,
    then: (schema) =>
      schema.required("Flex worker handle is required when Flex is enabled"),
    otherwise: (schema) => schema.optional(),
  }),
  useExternalFlex: Yup.bool().optional(),
  externalFlexNumber: Yup.string().when("useExternalFlex", {
    is: true,
    then: (schema) =>
      schema.required(
        "External flex number is required when using external flex"
      ),
    otherwise: (schema) => schema.optional(),
  }),
  customSourceHash: Yup.string(),
  customCalleeHash: Yup.string(),
});

const initialValues: UserProfile = {
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
  calleeLanguageCode: "es",
  calleeLanguageFriendly: "Spanish - Mexico",
  calleeTranscriptionProvider: "Deepgram",
  calleeTtsProvider: "Amazon",
  calleeVoice: "Lupe-Generative",
  useFlex: false,
  flexNumber: process.env.NEXT_PUBLIC_FLEX_NUMBER ?? "",
  flexWorkerHandle: "",
  useExternalFlex: false,
  externalFlexNumber: "",
  customSourceHash: "",
  customCalleeHash: "",
};

export function ProfileFormFormik({
  profile,
  onSubmit,
}: ProfileFormFormikProps) {
  const handleSubmit = async (
    values: UserProfile,
    { setSubmitting, setFieldError }: FormikHelpers<UserProfile>
  ) => {
    try {
      const url = `/api/profiles/check?phoneNumber=${encodeURIComponent(
        values.phoneNumber
      )}&handle=${encodeURIComponent(values.flexWorkerHandle)}`;

      const checkResponse = await fetch(url);
      const { phoneNumberUsed, handleUsed } = await checkResponse.json();

      const samePhoneNumber = profile?.phoneNumber === values.phoneNumber;
      const sameHandle = profile?.flexWorkerHandle === values.flexWorkerHandle;

      if (!samePhoneNumber && phoneNumberUsed) {
        setFieldError(
          "phoneNumber",
          "This phone number is already in use for another profile"
        );
      }

      if (!sameHandle && handleUsed) {
        setFieldError(
          "flexWorkerHandle",
          "This Flex Worker is already in use for another profile"
        );
      }

      if (
        (!samePhoneNumber && phoneNumberUsed) ||
        (!sameHandle && handleUsed)
      ) {
        setSubmitting(false);
        return;
      }

      const submissionValues = {
        ...values,
        sourceVoice: values.customSourceHash || values.sourceVoice,
        calleeVoice: values.customCalleeHash || values.calleeVoice,
      };

      await onSubmit(submissionValues);
    } catch (error) {
      setSubmitting(false);
      throw error;
    }
  };

  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...profile,
        flexNumber: profile?.flexNumber || initialValues.flexNumber,
      }}
      validationSchema={profileValidationSchema}
      onSubmit={handleSubmit}
      enableReinitialize>
      {({ values, setFieldValue, isSubmitting, handleSubmit }) => {
        const handleLanguageChange = (
          type: "source" | "callee",
          languageCode: string
        ) => {
          const provider =
            type === "source"
              ? values.sourceTtsProvider
              : values.calleeTtsProvider;

          const language = LanguageService.LANGUAGES.find(
            (l) => l.code === languageCode
          );
          if (!language) return;

          const voices =
            provider === "ElevenLabs"
              ? LanguageService.ELEVEN_LABS_VOICES
              : provider === "Amazon"
              ? LanguageService.AMAZON_VOICES
              : LanguageService.GOOGLE_VOICES;

          const availableVoices =
            voices[language.translateCode as keyof typeof voices];

          const defaultVoice = availableVoices?.[0] || "";

          if (type === "source") {
            setFieldValue("sourceLanguage", language.code);
            setFieldValue("sourceLanguageCode", language.translateCode);
            setFieldValue("sourceLanguageFriendly", language.friendly);
            setFieldValue("sourceVoice", defaultVoice);
          } else {
            setFieldValue("calleeLanguage", language.code);
            setFieldValue("calleeLanguageCode", language.translateCode);
            setFieldValue("calleeLanguageFriendly", language.friendly);
            setFieldValue("calleeVoice", defaultVoice);
          }
        };

        return (
          <ProfileForm
            values={values}
            isSubmitting={isSubmitting}
            onFieldChange={setFieldValue}
            onLanguageChange={handleLanguageChange}
            onSubmit={handleSubmit}
          />
        );
      }}
    </Formik>
  );
}
