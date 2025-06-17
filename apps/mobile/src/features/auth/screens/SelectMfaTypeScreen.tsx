import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { VStack } from '../../../components/ui/vstack';
import { Heading } from '../../../components/ui/heading';
import {
  Button,
  ButtonSpinner,
  ButtonText,
} from '../../../components/ui/button';
import { AuthError, confirmSignIn } from 'aws-amplify/auth';
import { useHandleAuthenticationNextStep } from '../hooks/useHandleAuthenticationNextStep';
import RadioElement from '../../../components/form-elements/radio-element';
import { HStack } from '../../../components/ui/hstack';
import {
  selectMfaTypeSchema,
  SelectMfaTypeSchema,
} from '../schema/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import { RootStackParamList } from '../../../navigations/RootStack';

const errorMessages = {
  NotAuthorizedException: {
    field: 'mfaType',
    message: 'Not authorized',
  },
  InvalidParameterException: {
    field: 'mfaType',
    message: 'Invalid MFA type',
  },
};

export type SelectMfaTypeScreenProps = {
  route: RouteProp<RootStackParamList, 'SelectMfaType'>;
};

export const SelectMfaTypeScreen = ({
  route: {
    params: { allowedMfaTypes },
  },
}: SelectMfaTypeScreenProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const form = useForm<SelectMfaTypeSchema>({
    resolver: zodResolver(selectMfaTypeSchema),
    defaultValues: { mfaType: allowedMfaTypes?.[0] ?? '' },
  });
  const { handleSignInNextStep } = useHandleAuthenticationNextStep();

  const onSubmit = async (data: SelectMfaTypeSchema) => {
    try {
      const response = await confirmSignIn({ challengeResponse: data.mfaType });
      handleSignInNextStep(response.nextStep);
    } catch (error) {
      console.error(error);
      if (error instanceof AuthError && error.name in errorMessages) {
        const { field, message } =
          errorMessages[error.name as keyof typeof errorMessages];
        form.setError(field as keyof typeof form.formState.errors, {
          message,
        });
      } else {
        form.setError('mfaType', { message: 'An unknown error occurred' });
      }
    }
  };

  return (
    <FormProvider {...form}>
      <VStack space="md">
        <Heading>Select MFA Type</Heading>
        <RadioElement
          name="mfaType"
          label="MFA Type"
          options={allowedMfaTypes.map((type) => ({
            label: type,
            value: type,
          }))}
        />
        <Button
          onPress={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && <ButtonSpinner />}
          <ButtonText>Continue</ButtonText>
        </Button>
        <HStack>
          <Button variant="link" onPress={() => navigation.navigate('SignIn')}>
            <ButtonText>Back to Sign In</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </FormProvider>
  );
};
