import { Redirect, Stack } from 'expo-router';
import { SignedOut, useAuth } from '@clerk/clerk-expo';

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={'/'} />;
  }

  return (
    <SignedOut>
      <Stack screenOptions={{ headerShown: false }} />
    </SignedOut>
  );
}
