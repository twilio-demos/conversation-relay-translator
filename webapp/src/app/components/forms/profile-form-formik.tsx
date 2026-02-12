"use client";

import { LANGUAGES, UserProfile, VOICES } from "@/types/profile";
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
  sourceVoice: Yup.string().required("Source voice is required"),
  calleeDetails: Yup.boolean(),
  calleeNumber: Yup.string(),
  calleeLanguage: Yup.string().required("Callee language is required"),
  calleeLanguageCode: Yup.string().required(),
  calleeLanguageFriendly: Yup.string().required(),
  calleeTranscriptionProvider: Yup.string().required(),
  calleeTtsProvider: Yup.string().required(),
  calleeVoice: Yup.string().required("Callee voice is required"),
  useFlex: Yup.boolean(),
  flexNumber: Yup.string().when("useFlex", {
    is: true,
    then: (schema) => schema.required("Flex number is required when Flex is enabled"),
    otherwise: (schema) => schema.optional(),
  }),
  flexWorkerHandle: Yup.string().when("useFlex", {
    is: true,
    then: (schema) => schema.required("Flex worker handle is required when Flex is enabled"),
    otherwise: (schema) => schema.optional()
  }),
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
  calleeLanguageCode: "es-MX",
  calleeLanguageFriendly: "Spanish - Mexico",
  calleeTranscriptionProvider: "Deepgram",
  calleeTtsProvider: "Amazon",
  calleeVoice: "Lupe-Generative",
  useFlex: false,
  flexNumber: "",
  flexWorkerHandle: "",
};

export function ProfileFormFormik({
  profile,
  onSubmit,
}: ProfileFormFormikProps) {
  const handleSubmit = async (
    values: UserProfile,
    { setSubmitting }: FormikHelpers<UserProfile>
  ) => {
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={profile || initialValues}
      validationSchema={profileValidationSchema}
      onSubmit={handleSubmit}
      enableReinitialize>
      {({ values, setFieldValue, isSubmitting, handleSubmit }) => {
        const handleLanguageChange = (
          type: "source" | "callee",
          languageCode: string
        ) => {
          const language = LANGUAGES.find((l) => l.code === languageCode);
          if (!language) return;

          // Get the first available voice for the new language
          const availableVoices =
            VOICES[language.translateCode as keyof typeof VOICES];
          const defaultVoice = availableVoices?.[0] || "";

          // Update all fields
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
