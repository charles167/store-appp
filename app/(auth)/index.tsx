import { Redirect } from 'expo-router';

export default function AuthIndex() {
  // Redirect to onboarding when accessing (auth)
  return <Redirect href="/(auth)/onboarding" />;
}
