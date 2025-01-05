import { SignInForm } from './SigninForm/SignInForm'
import { WelcomeSection } from './WelcomeSection/WelcomeSection'

export function SignIn() {
  return (
    <div className="min-h-screen flex ">
      <div className="flex-1 flex  items-center justify-center p-8">
      
        <SignInForm />
      </div>
      <div className="bg-gray-50 w-1/3 flex items-center   p-8">
        <WelcomeSection/>
      </div>
    </div>
  );
}