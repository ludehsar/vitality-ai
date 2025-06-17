import { VStack } from '../../../components/ui/vstack';
import {
  Button,
  ButtonSpinner,
  ButtonText,
} from '../../../components/ui/button';
import { Heading } from '../../../components/ui/heading';
import InputElement from '../../../components/form-elements/input-element';
import { FormProvider, useForm } from 'react-hook-form';
import { HStack } from '../../../components/ui/hstack';
import { SignUpSchema, signUpSchema } from '../schema/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthError, signUp, SignUpInput } from 'aws-amplify/auth';
import { useHandleAuthenticationNextStep } from '../hooks/useHandleAuthenticationNextStep';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigations/RootStack';

const errorMessages = {
  UsernameExistsException: {
    field: 'email',
    message: 'Email already in use',
  },
  UserNotConfirmedException: {
    field: 'email',
    message: 'User is not confirmed',
  },
  UserNotFoundException: {
    field: 'email',
    message: 'User not found',
  },
  NotAuthorizedException: {
    field: 'password',
    message: 'Invalid email or password',
  },
};

export const SignUpScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { handleSignUpNextStep } = useHandleAuthenticationNextStep();
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      confirmPassword: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      phoneNumber: '',
    },
  });

  const onSubmit = async (data: SignUpSchema) => {
    if (data.password !== data.confirmPassword) {
      form.setError('confirmPassword', {
        message: 'Passwords do not match',
      });
      return;
    }
    const requestInput: SignUpInput = {
      username: data.email,
      password: data.password,
      options: {
        userAttributes: {
          email: data.email,
          family_name: data.lastName,
          given_name: data.firstName,
          phone_number: data.phoneNumber,
        },
      },
    };

    try {
      const response = await signUp(requestInput);
      handleSignUpNextStep(response.nextStep);
    } catch (error) {
      console.error('Error signing up', error);
      if (error instanceof AuthError && error.name in errorMessages) {
        const { field, message } =
          errorMessages[error.name as keyof typeof errorMessages];
        form.setError(field as keyof SignUpSchema, {
          message,
        });
      } else {
        form.setError('firstName', {
          message: 'An unknown error occurred',
        });
      }
    }
  };

  return (
    <FormProvider {...form}>
      <VStack space="md">
        <Heading>Sign Up</Heading>
        <InputElement
          name="firstName"
          label="First Name"
          placeholder="Enter First Name"
          keyboardType="default"
          textContentType="givenName"
        />
        <InputElement
          name="lastName"
          label="Last Name"
          placeholder="Enter Last Name"
          keyboardType="default"
          textContentType="familyName"
        />
        <InputElement
          name="email"
          label="Email"
          placeholder="Enter Email"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <InputElement
          name="phoneNumber"
          label="Phone Number"
          placeholder="Enter Phone Number"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
        />
        <InputElement
          name="password"
          label="Password"
          placeholder="Enter Password"
          keyboardType="visible-password"
          textContentType="password"
          isPassword
        />
        <InputElement
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm Password"
          keyboardType="visible-password"
          textContentType="password"
          isPassword
        />
        <Button
          className="mt-4"
          onPress={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && <ButtonSpinner />}
          <ButtonText>Sign Up</ButtonText>
        </Button>
        <HStack className="justify-between">
          <Button variant="link" onPress={() => navigation.navigate('SignIn')}>
            <ButtonText>Already have an account?</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </FormProvider>
  );
};
