import React from 'react';
import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { SignInSchema, signInSchema } from '../schema/sign-in.schema';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import InputElement from '@/components/form-elements/input-element';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';

export const SignInScreen = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInSchema) => {
    if (!isLoaded) return;
    try {
      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push('/');
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        form.setError('root', {
          message: 'Invalid email or password',
        });
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      form.setError('root', {
        message: 'An error occurred',
      });
    }
  };

  return (
    <VStack className="flex-1 justify-center gap-4 p-4">
      <Heading size="lg">Sign in</Heading>
      <FormProvider {...form}>
        <InputElement
          name="email"
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <InputElement
          name="password"
          label="Password"
          isPassword
          textContentType="password"
        />
        <Button onPress={form.handleSubmit(onSubmit)} className="mt-4">
          <ButtonText>Continue</ButtonText>
        </Button>
      </FormProvider>
      <HStack className="justify-between">
        <Link href="/sign-up" asChild>
          <Button variant="link">
            <ButtonText>Forgot password?</ButtonText>
          </Button>
        </Link>
        <Link href="/sign-up" asChild>
          <Button variant="link">
            <ButtonText>Create an account</ButtonText>
          </Button>
        </Link>
      </HStack>
    </VStack>
  );
};
