/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./api";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getUserProfile = /* GraphQL */ `query GetUserProfile($id: String!) {
  getUserProfile(id: $id) {
    PK
    SK
    fullName
    email
    phoneNumber
    dateOfBirth
    onboardingAssesment {
      healthGoals
      gender
      weight
      age
      bloodType
      currentFitnessLevel
      currentSleepLevel
      currentEmotionalState
      height
      eatingHabits
      __typename
    }
    appSettings {
      medicationReminder
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserProfileQueryVariables,
  APITypes.GetUserProfileQuery
>;
