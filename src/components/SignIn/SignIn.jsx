import { SignInForm } from './SigninForm/SignInForm'
import { WelcomeSection } from './WelcomeSection/WelcomeSection'

export function SignIn() {
  return (
    <div className='flex flex-row'>
      <SignInForm />

      <WelcomeSection />
    </div>
  );
}