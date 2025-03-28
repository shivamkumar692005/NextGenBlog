import { Quote } from "../components/Quote";
import { SignupForm } from "../components/SignupForm";

export function Signup() {

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2">    
      <SignupForm />
      <div className="md:block hidden">
        <Quote />
      </div>
    </div>
  );
}
