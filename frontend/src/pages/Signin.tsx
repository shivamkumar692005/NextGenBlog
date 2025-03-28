import { Quote } from "../components/Quote";
import { SigninForm } from "../components/SigninForm";

export function Signin() {
  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2">    
      <SigninForm />
      <div className="md:block hidden">
        <Quote />
      </div>
    </div>
  );
}
