import React, { useCallback, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import {
  AuthError,
  setUpTOTP,
  verifyTOTPSetup,
  VerifyTOTPSetupInput,
} from 'aws-amplify/auth';
import { VStack } from '../../../components/ui/vstack';
import { Heading } from '../../../components/ui/heading';
import { Text } from '../../../components/ui/text';
import {
  Button,
  ButtonSpinner,
  ButtonText,
} from '../../../components/ui/button';
import { HStack } from '../../../components/ui/hstack';
import { Linking } from 'react-native';
import InputElement from '../../../components/form-elements/input-element';
import {
  confirmSignUpSchema,
  ConfirmSignUpSchema,
} from '../schema/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import { RootStackParamList } from '../../../navigations/RootStack';

const errorMessages = {
  InvalidCodeException: {
    field: 'code',
    message: 'The code you entered is incorrect. Please try again.',
  },
  ExpiredCodeException: {
    field: 'code',
    message: 'The code you entered is expired. Please try again.',
  },
};

export type SetupTotpScreenProps = {
  route: RouteProp<RootStackParamList, 'SetupTotp'>;
};

export const SetupTotpScreen = ({
  route: {
    params: { username },
  },
}: SetupTotpScreenProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [totpSecretCode, setTotpSecretCode] = useState<string>('');
  const [totpSetupUri, setTotpSetupUri] = useState<URL>();
  const form = useForm<ConfirmSignUpSchema>({
    resolver: zodResolver(confirmSignUpSchema),
    defaultValues: {
      code: '',
    },
  });

  const getTotpSetupUri = useCallback(async () => {
    const totpSetupDetails = await setUpTOTP();
    const appname = `Vitality-AI: ${username}`;
    const totpSetupUri = totpSetupDetails.getSetupUri(appname);
    setTotpSetupUri(totpSetupUri);
    setTotpSecretCode(totpSetupDetails.sharedSecret);
  }, [username]);

  useEffect(() => {
    getTotpSetupUri();
  }, [getTotpSetupUri]);

  const onSubmit = async (data: ConfirmSignUpSchema) => {
    const request: VerifyTOTPSetupInput = {
      code: data.code,
    };
    try {
      await verifyTOTPSetup(request);
    } catch (error) {
      console.error(error);
      if (error instanceof AuthError && error.name in errorMessages) {
        const errorMessage =
          errorMessages[error.name as keyof typeof errorMessages];
        form.setError(errorMessage.field as keyof ConfirmSignUpSchema, {
          message: errorMessage.message,
        });
      } else {
        form.setError('code', {
          message: 'An unknown error occurred. Please try again.',
        });
      }
    }
  };

  return (
    <VStack>
      <Heading>Setup TOTP</Heading>
      <Text>
        Copy and paste the secret key below into an authenticator app and then
        enter the code in the text field below.
      </Text>
      <Text selectable className="text-xl font-semibold">
        {totpSecretCode}
      </Text>
      {totpSetupUri && (
        <>
          <Text>
            Or click the button below to open the secret key in your
            authenticator app.
          </Text>
          <Button
            variant="link"
            onPress={() => {
              Linking.openURL(totpSetupUri.toString());
            }}
          >
            <ButtonText>Open in Authenticator App</ButtonText>
          </Button>
        </>
      )}
      <Text>Enter the code from your authenticator app:</Text>
      <InputElement placeholder="Enter the code" name="code" label="Code" />
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
  );
};
