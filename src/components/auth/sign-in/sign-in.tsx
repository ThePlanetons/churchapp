import { SignInForm } from './sign-in-form'
import { WelcomeSection } from './welcome-section'

export function SignIn() {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      <SignInForm />

      <WelcomeSection />
    </div >
  );
}