import { Link, useRouter } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';
import React, { useTransition } from 'react';
import { signUpSchema, SignUpSchema } from '../schema/sign-up.schema';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import InputElement from '@/components/form-elements/input-element';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import PinInputElement from '@/components/form-elements/pin-input-element';
import { ArrowLeftIcon } from '@/components/ui/icon';

export const SignUpScreen = () => {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      code: '',
      pendingVerification: false,
    },
  });

  const pendingVerification = form.watch('pendingVerification');

  const onSignUpPress = async () => {
    startTransition(async () => {
      if (!isLoaded) return;

      const isValid = await form.trigger([
        'confirmPassword',
        'email',
        'password',
      ]);
      if (!isValid) return;

      if (form.getValues('password') !== form.getValues('confirmPassword')) {
        form.setError('confirmPassword', { message: 'Passwords do not match' });
        return;
      }

      try {
        await signUp.create({
          emailAddress: form.getValues('email'),
          password: form.getValues('password'),
        });

        await signUp.prepareEmailAddressVerification({
          strategy: 'email_code',
        });

        form.setValue('pendingVerification', true);
      } catch (err) {
        console.error(JSON.stringify(err, null, 2));
      }
    });
  };

  const onVerifyPress = async () => {
    startTransition(async () => {
      if (!isLoaded) return;
      const isValid = await form.trigger(['code']);
      if (!isValid) return;

      console.log('Code', form.getValues('code'));

      try {
        const signUpAttempt = await signUp.attemptEmailAddressVerification({
          code: form.getValues('code'),
        });

        if (signUpAttempt.status === 'complete') {
          await setActive({ session: signUpAttempt.createdSessionId });
          router.replace('/(tabs)');
        } else {
          console.error(JSON.stringify(signUpAttempt, null, 2));
        }
      } catch (err) {
        console.error(JSON.stringify(err, null, 2));
      }
    });
  };

  return (
    <VStack className="flex-1 justify-center gap-4 p-4">
      <>
        <Heading>
          {pendingVerification ? 'Verify your email' : 'Sign up'}
        </Heading>
        <FormProvider {...form}>
          {pendingVerification ? (
            <>
              <PinInputElement name="code" label="Code" length={6} />
            </>
          ) : (
            <>
              <InputElement
                name="email"
                label="Email"
                autoCapitalize="none"
                textContentType="emailAddress"
              />
              <InputElement name="password" label="Password" isPassword />
              <InputElement
                name="confirmPassword"
                label="Confirm Password"
                isPassword
              />
            </>
          )}
          <Button
            onPress={pendingVerification ? onVerifyPress : onSignUpPress}
            disabled={isPending}
          >
            <ButtonText>{isPending ? 'Signing up...' : 'Continue'}</ButtonText>
          </Button>
        </FormProvider>
        <HStack className="justify-between">
          {pendingVerification ? (
            <Button
              variant="link"
              onPress={() => form.setValue('pendingVerification', false)}
            >
              <ButtonIcon as={ArrowLeftIcon} />
              <ButtonText>Go back</ButtonText>
            </Button>
          ) : null}
          <Link href={'/sign-in'} asChild>
            <Button variant="link">
              <ButtonText>Already have an account?</ButtonText>
            </Button>
          </Link>
        </HStack>
      </>
    </VStack>
  );
};
