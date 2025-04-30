"use client"
import { useRouter } from "next/navigation";
import { Button, Loader } from "@repo/ui";

import { Input } from "@repo/ui";
import axios from "axios";
import { Ref, useRef, useState } from "react";
import { resolve } from "path";
import { error } from "console";


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
function enterName(isLogin: boolean, nameref: React.RefObject<HTMLInputElement | null>) {
  if(!isLogin){
    return <div>
    <Input
      id = "name"
      ref={nameref}
      type="text"
      placeholder="Enter your Name"
      required
      className="mt-1 p-2"
    />
  </div>
  }
}


interface postData{
  emailref : React.RefObject<HTMLInputElement | null>
  passwordref : React.RefObject<HTMLInputElement | null>
  nameref? : React.RefObject<HTMLInputElement | null>
  setLoading : React.Dispatch<React.SetStateAction<boolean>>
  setError : React.Dispatch<React.SetStateAction<string>>
  router: ReturnType<typeof useRouter>}

async function postData({emailref , nameref , passwordref,setLoading,setError,router}: postData){
  setLoading(true);
  await axios.post("http://localhost:3002/signup",{
    username : emailref.current?.value,
    password : passwordref.current?.value,
    name :  nameref?.current?.value
})
.then((response) => {
  setLoading(false)
  if(response.data.message === "incorrect inputs"){
    setLoading(false)
    setError(response.data.message)
    setTimeout(()=>{
      setError("")
    },2000)
  } else {
    // Redirect user on successful signup
    router.push("/signin");
  }
})
.catch((error)=>{
  if(error.response.data.message === "user already exists with this username"){
      setLoading(false)
      setError("username already exists")
      setTimeout(()=>{
        setError("")
      },2000)
  }
  else{
    router.push("/signin")
  }
})
//remember whenever we get a status code error .then doesn't execute we need to do the thing
//inside catch block
}

async function loginfunction({emailref , passwordref,setError,setLoading,router}:postData){
    setLoading(true)
    const response = await axios.post("http://localhost:3002/signin",{
      username : emailref.current?.value,
      password : passwordref.current?.value
    })
    .then((response)=>{
      localStorage.setItem("token",response.data)
      setLoading(false)
      router.push("/")
    })
    .catch((error)=>{
      if(error.response.data.message == "user not authorized"){
        setError(error.response.data.message)
        setLoading(false)
        setTimeout(()=>{
          setError("")
        },3000)
      }
    })
}

export default function Login({logo,subheading,signupText,signupUrl,isLogin,signinUrl}:Login3Props){
  const emailref = useRef<HTMLInputElement>(null);
  const passwordref = useRef<HTMLInputElement>(null);
  const nameref = useRef<HTMLInputElement>(null);
  const router = useRouter()
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
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
                <Input id = "email" type="email" placeholder="Enter your email"  ref = {emailref} className="p-2" required />
                <div>
                  <Input
                    ref = {passwordref}
                    id = "password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    className="mt-1 p-2"
                  />
                </div>
                {enterName(isLogin,nameref)}
                <div className="flex justify-center mt-5">
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password
                  </a>
                </div>
                <Button onClick = {()=>
                {
                    if(isLogin){
                        loginfunction({emailref,passwordref,setError,setLoading,router})
                    } 
                
                    else{
                     postData({nameref,passwordref,emailref,setLoading,setError,router})
                    }
              
              }
              }
                type="submit" className="mt-2 gap-10 cursor-pointer w-full flex bg-black text-white p-2">
                {isLogin ? "Log In" : "Sign Up"}{loading && <Loader />}
                </Button>
                <div>
                  {error && <div className="text-center text-red-500 bg-red-100 p-2 rounded-md">{error} </div> }
                </div>
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

