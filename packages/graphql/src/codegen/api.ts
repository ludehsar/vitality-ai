/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type UserProfile = {
  __typename: "UserProfile",
  PK: string,
  SK: string,
  fullName: string,
  email: string,
  phoneNumber?: string | null,
  dateOfBirth?: string | null,
  onboardingAssesment: UserOnboardingAssesment,
  appSettings: UserAppSettings,
};

export type UserOnboardingAssesment = {
  __typename: "UserOnboardingAssesment",
  healthGoals?: Array< string > | null,
  gender?: string | null,
  weight?: number | null,
  age?: number | null,
  bloodType?: BloodType | null,
  currentFitnessLevel?: FitnessLevel | null,
  currentSleepLevel?: SleepLevel | null,
  currentEmotionalState?: EmotionalState | null,
  height?: number | null,
  eatingHabits?: EatingHabits | null,
};

export enum BloodType {
  A_POSITIVE = "A_POSITIVE",
  A_NEGATIVE = "A_NEGATIVE",
  B_POSITIVE = "B_POSITIVE",
  B_NEGATIVE = "B_NEGATIVE",
  AB_POSITIVE = "AB_POSITIVE",
  AB_NEGATIVE = "AB_NEGATIVE",
  O_POSITIVE = "O_POSITIVE",
  O_NEGATIVE = "O_NEGATIVE",
}


export enum FitnessLevel {
  INACTIVE = "INACTIVE",
  INSUFFICIENTLY_ACTIVE = "INSUFFICIENTLY_ACTIVE",
  MINIMALLY_ACTIVE = "MINIMALLY_ACTIVE",
  HEALTH_ENHANCING = "HEALTH_ENHANCING",
  HIGH_ACTIVE = "HIGH_ACTIVE",
}


export enum SleepLevel {
  SEVERELY_IMPAIRED = "SEVERELY_IMPAIRED",
  MODERATELY_IMPAIRED = "MODERATELY_IMPAIRED",
  MILDLY_IMPAIRED = "MILDLY_IMPAIRED",
  NORMAL = "NORMAL",
  OPTIMAL = "OPTIMAL",
}


export enum EmotionalState {
  HAPPY = "HAPPY",
  CALM = "CALM",
  STRESSED = "STRESSED",
  SAD = "SAD",
  ANXIOUS = "ANXIOUS",
  TIRED = "TIRED",
  EXCITED = "EXCITED",
  NEUTRAL = "NEUTRAL",
}


export enum EatingHabits {
  NONE = "NONE",
  BALANCED = "BALANCED",
  LOW_CARB = "LOW_CARB",
  VEGETARIAN = "VEGETARIAN",
  VEGAN = "VEGAN",
  KETO = "KETO",
  OTHER = "OTHER",
}


export type UserAppSettings = {
  __typename: "UserAppSettings",
  medicationReminder: boolean,
};

export type GetUserProfileQueryVariables = {
  id: string,
};

export type GetUserProfileQuery = {
  getUserProfile?:  {
    __typename: "UserProfile",
    PK: string,
    SK: string,
    fullName: string,
    email: string,
    phoneNumber?: string | null,
    dateOfBirth?: string | null,
    onboardingAssesment:  {
      __typename: "UserOnboardingAssesment",
      healthGoals?: Array< string > | null,
      gender?: string | null,
      weight?: number | null,
      age?: number | null,
      bloodType?: BloodType | null,
      currentFitnessLevel?: FitnessLevel | null,
      currentSleepLevel?: SleepLevel | null,
      currentEmotionalState?: EmotionalState | null,
      height?: number | null,
      eatingHabits?: EatingHabits | null,
    },
    appSettings:  {
      __typename: "UserAppSettings",
      medicationReminder: boolean,
    },
  } | null,
};
