import { SignInForm } from './SigninForm/SignInForm'
import { WelcomeSection } from './WelcomeSection/WelcomeSection'

export function SignIn() {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      <SignInForm />

      <WelcomeSection />
    </div >
  );
}