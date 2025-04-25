// import { FcGoogle } from "react-icons/fc";
import { Pencil } from "lucide-react";
import { Button } from "@repo/ui";

import { Input } from "@repo/ui";

interface Login3Props {
  isLogin:boolean;
  subheading?: string;
  logo: {
    url?: string;
    src: string;
    alt: string;
  };
  signupText?: string;
  signupUrl?: string;
  signinUrl?: string;
}
function enterName(isLogin:boolean){
  if(!isLogin){
    return <div>
    <Input
      type="password"
      placeholder="Enter your Name"
      required
      className="mt-1 p-2"
    />
  </div>
  }
}
export default function Login({logo,subheading,signupText,signupUrl,isLogin,signinUrl}:Login3Props){
  return (
    <section className="py-32 place-items-center">
      <div className="container">
        <div className="flex flex-col gap-4">
          <div className="mx-auto w-full max-w-sm rounded-md p-6 shadow ">
            <div className="mb-6 flex flex-col items-center">
              <a href={logo?.url} className="mb-6 flex items-center gap-2">
                <img src={logo.src} className="max-h-20" alt={logo.alt} />
              </a>
              <h1 className="mb-2 text-2xl font-bold text-black">{isLogin ? "Sign in" : "SignUp"}</h1>
              <p className="text-muted-foreground text-gray-500">{subheading}</p>
            </div>
            <div>
              <div className="grid gap-4 text-black mt-10">
                <Input type="email" placeholder="Enter your email" className="p-2" required />
                <div>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    required
                    className="mt-1 p-2"
                  />
                </div>
                {enterName(isLogin)}
                <div className="flex justify-center mt-5">
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password
                  </a>
                </div>
                <Button type="submit" className="mt-2 cursor-pointer w-full bg-black text-white p-2">
                  {isLogin ? "Log In" : "Sign Up"}
                </Button>
              </div>
              <div className="mx-auto mt-8 flex justify-center gap-1 text-sm text-black text-muted-foreground">
                <p>{isLogin ? signupText : "Already have an account?"}</p>
                <a href={isLogin?signupUrl : signinUrl} className="font-medium text-primary">
                {isLogin ? "Sign Up" : "Sign In"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

