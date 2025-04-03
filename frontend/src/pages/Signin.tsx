import { Quote } from "../components/Quote";
import { SigninForm } from "../components/SigninForm";

export default function Signin({setIsLoggedIn}: {setIsLoggedIn: (isLoggedIn: boolean) => void}) {
  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2">    
      <SigninForm setIsLoggedIn={setIsLoggedIn}/>
      <div className="md:block hidden">
        <Quote />
      </div>
    </div>
  );
}
