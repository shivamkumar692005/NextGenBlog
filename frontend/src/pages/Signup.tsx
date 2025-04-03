import { Quote } from "../components/Quote";
import { SignupForm } from "../components/SignupForm";

export default function Signup({setIsLoggedIn}: {setIsLoggedIn: (isLoggedIn: boolean) => void}) {

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2">    
      <SignupForm setIsLoggedIn={setIsLoggedIn}/>
      <div className="md:block hidden">
        <Quote />
      </div>
    </div>
  );
}
