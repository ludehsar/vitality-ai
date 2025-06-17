import { VStack } from '../../../components/ui/vstack';
import {
  Button,
  ButtonSpinner,
  ButtonText,
} from '../../../components/ui/button';
import { Heading } from '../../../components/ui/heading';
import { FormProvider, useForm } from 'react-hook-form';
import { verifyUserSchema, VerifyUserSchema } from '../schema/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AuthError,
  SendUserAttributeVerificationCodeInput,
  sendUserAttributeVerificationCode,
} from 'aws-amplify/auth';
import { HStack } from '../../../components/ui/hstack';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigations/RootStack';
import RadioElement from '../../../components/form-elements/radio-element';

const errorMessages = {
  InvalidParameterException: {
    field: 'unverifiedUserAttribute',
    message: 'Invalid unverified user attribute',
  },
  NotAuthorizedException: {
    field: 'unverifiedUserAttribute',
    message: 'Not authorized',
  },
  LimitExceededException: {
    field: 'unverifiedUserAttribute',
    message: 'Limit exceeded',
  },
};

export const VerifyUserScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const form = useForm<VerifyUserSchema>({
    resolver: zodResolver(verifyUserSchema),
  });

  const onSubmit = async (data: VerifyUserSchema) => {
    const requestInput: SendUserAttributeVerificationCodeInput = {
      userAttributeKey: data.unverifiedUserAttribute,
    };
    try {
      const response = await sendUserAttributeVerificationCode(requestInput);
      navigation.navigate('ConfirmVerifyUser', {
        codeDeliveryDetails: response,
      });
    } catch (error) {
      if (error instanceof AuthError && error.name in errorMessages) {
        const { field, message } =
          errorMessages[error.name as keyof typeof errorMessages];
        form.setError(field as keyof VerifyUserSchema, {
          message,
        });
      } else {
        form.setError('unverifiedUserAttribute', {
          message: 'An unknown error occurred',
        });
      }
      console.error('Error sending user attribute verification code', error);
    }
  };

  const skipVerification = () => {
    navigation.navigate('Home');
  };

  return (
    <FormProvider {...form}>
      <VStack space="md">
        <Heading>Verify User</Heading>
        <RadioElement
          name="unverifiedUserAttribute"
          label="Unverified User Attribute"
          options={['email', 'phone_number'].map((key) => ({
            label: key,
            value: key,
          }))}
        />
        <Button
          className="mt-4"
          onPress={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && <ButtonSpinner />}
          <ButtonText>Send Code</ButtonText>
        </Button>
        <HStack className="justify-between">
          <Button variant="link" onPress={skipVerification}>
            <ButtonText>Skip Verification</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </FormProvider>
  );
};
