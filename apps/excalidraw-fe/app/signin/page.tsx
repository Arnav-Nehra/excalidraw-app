import Login from "../../components/Auth";

export default function SignIn() {
  return (
    <div className="bg-white min-h-screen">
      <div>
        <Login
          isLogin={true}
          subheading="Welcome back"
          logo={{
            src: "./logo.svg",
            alt: "App Logo",
          }}
          signupText="Don't have an account?"
          signupUrl="/signup"></Login>
      </div>
    </div>
  );
}
