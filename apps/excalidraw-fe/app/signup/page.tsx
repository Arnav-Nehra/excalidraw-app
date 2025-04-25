import Login from "../../components/Auth";

export default function SignUp() {
  return (
    <div className="bg-white min-h-screen">
      <div className="">
        <Login
          isLogin={false}
          subheading="Welcome back"
          logo={{
            src: "./logo.svg",
            alt: "App Logo",
          }}
          signupText="Don't have an account?"
          signinUrl="/signin"></Login>
      </div>
    </div>
  );
}
