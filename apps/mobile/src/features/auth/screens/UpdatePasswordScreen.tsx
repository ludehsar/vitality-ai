import InputElement from '../../../components/form-elements/input-element';
import { FormProvider, useForm } from 'react-hook-form';
import {
  AuthError,
  updatePassword,
  UpdatePasswordInput,
} from 'aws-amplify/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  forceNewPasswordSchema,
  ForceNewPasswordSchema,
} from '../schema/auth.schema';
import { VStack } from '../../../components/ui/vstack';
import { Heading } from '../../../components/ui/heading';
import {
  Button,
  ButtonSpinner,
  ButtonText,
} from '../../../components/ui/button';
import { HStack } from '../../../components/ui/hstack';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigations/RootStack';

const errorMessages = {
  NotAuthorizedException: {
    field: 'oldPassword',
    message: 'Invalid password',
  },
};

export const UpdatePasswordScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const form = useForm<ForceNewPasswordSchema>({
    resolver: zodResolver(forceNewPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = async (data: ForceNewPasswordSchema) => {
    if (data.newPassword !== data.confirmNewPassword) {
      form.setError('confirmNewPassword', {
        message: 'Passwords do not match',
      });
      return;
    }
    const requestData: UpdatePasswordInput = {
      newPassword: data.newPassword,
      oldPassword: data.oldPassword,
    };
    try {
      await updatePassword(requestData);
    } catch (error) {
      console.error(error);
      if (error instanceof AuthError && error.name in errorMessages) {
        const { field, message } =
          errorMessages[error.name as keyof typeof errorMessages];
        form.setError(field as keyof ForceNewPasswordSchema, {
          message,
        });
      } else {
        form.setError('oldPassword', {
          message: 'An unknown error occurred',
        });
      }
    }
  };

  return (
    <FormProvider {...form}>
      <VStack space="md">
        <Heading>Update Password</Heading>
        <InputElement
          name="oldPassword"
          label="Old Password"
          keyboardType="visible-password"
          textContentType="password"
          placeholder="Enter Old Password"
          isPassword
        />
        <InputElement
          name="newPassword"
          label="New Password"
          keyboardType="visible-password"
          textContentType="password"
          placeholder="Enter New Password"
          isPassword
        />
        <InputElement
          name="confirmNewPassword"
          label="Confirm New Password"
          keyboardType="visible-password"
          textContentType="password"
          placeholder="Enter Confirm New Password"
          isPassword
        />
        <Button
          className="mt-4"
          onPress={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && <ButtonSpinner />}
          <ButtonText>Confirm</ButtonText>
        </Button>
        <HStack className="justify-between">
          <Button variant="link" onPress={() => navigation.navigate('SignIn')}>
            <ButtonText>Back to Sign In</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </FormProvider>
  );
};
