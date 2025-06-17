import { VStack } from '../../../components/ui/vstack';
import {
  Button,
  ButtonSpinner,
  ButtonText,
} from '../../../components/ui/button';
import { Heading } from '../../../components/ui/heading';
import { FormProvider, useForm } from 'react-hook-form';
import {
  confirmSignUpSchema,
  ConfirmSignUpSchema,
} from '../schema/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AuthError,
  confirmUserAttribute,
  ConfirmUserAttributeInput,
} from 'aws-amplify/auth';
import { HStack } from '../../../components/ui/hstack';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import { RootStackParamList } from '../../../navigations/RootStack';
import { Text } from '../../../components/ui/text';
import InputElement from '../../../components/form-elements/input-element';

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

export type ConfirmVerifyUserScreenProps = {
  route: RouteProp<RootStackParamList, 'ConfirmVerifyUser'>;
};

export const ConfirmVerifyUserScreen = ({
  route: {
    params: { codeDeliveryDetails },
  },
}: ConfirmVerifyUserScreenProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const form = useForm<ConfirmSignUpSchema>({
    resolver: zodResolver(confirmSignUpSchema),
  });

  const onSubmit = async (data: ConfirmSignUpSchema) => {
    if (!codeDeliveryDetails.attributeName) {
      form.setError('code', {
        message: 'An unknown error occurred',
      });
      return;
    }
    const requestInput: ConfirmUserAttributeInput = {
      userAttributeKey:
        codeDeliveryDetails.attributeName as ConfirmUserAttributeInput['userAttributeKey'],
      confirmationCode: data.code,
    };
    try {
      await confirmUserAttribute(requestInput);
      navigation.navigate('Home');
    } catch (error) {
      if (error instanceof AuthError && error.name in errorMessages) {
        const { field, message } =
          errorMessages[error.name as keyof typeof errorMessages];
        form.setError(field as keyof ConfirmSignUpSchema, {
          message,
        });
      } else {
        form.setError('code', {
          message: 'An unknown error occurred',
        });
      }
      console.error(
        `Error confirming ${codeDeliveryDetails.attributeName}`,
        error
      );
    }
  };

  const skipVerification = async () => {
    navigation.navigate('Home');
  };

  return (
    <FormProvider {...form}>
      <VStack space="md">
        <Heading>Confirm Verification</Heading>
        {codeDeliveryDetails && (
          <Text>
            A code has been sent to {codeDeliveryDetails.destination} via{' '}
            {codeDeliveryDetails.deliveryMedium}
          </Text>
        )}
        <InputElement
          name="code"
          label="Code"
          placeholder="Enter Code"
          keyboardType="numeric"
        />
        <Button
          className="mt-4"
          onPress={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && <ButtonSpinner />}
          <ButtonText>
            {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
          </ButtonText>
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
