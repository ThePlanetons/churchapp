import { SignInForm } from '../SignIn/SignInForm'
import { WelcomeSection } from '../SignIn/WelcomeSection'

export function SignIn() {
  return (
    <div className='flex flex-row'>
      <SignInForm />

      <WelcomeSection />
    </div>
  );
}