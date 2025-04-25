import { ArrowRight, Layers, Pencil, Share2 } from "lucide-react"
import { Button } from "@repo/ui"
import Link from "next/link"

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 ml-8">
            <img src="./logo.svg" className="w-12"></img>
            <span className="text-xl font-bold text-black">Sketchio</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-rose-500 transition-colors text-black ml-40">
              Features
            </a>
            <a href="#testimonials" className="text-sm font-medium hover:text-rose-500 transition-colors text-black">
              Testimonials
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/signin">
              <Button variant="ghost" size="sm" className="hover:text-rose-500 text-black">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-rose-500 hover:bg-rose-600 text-white py-1 mr-4">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-24 md:py-32 bg-gradient-to-b from-white to-rose-50/30 place-items-center">
          <div className="container flex flex-col items-center text-center">
            <div className="inline-block mb-6 rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-800 ">
              Introducing Sketchio
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl text-black">
              Create beautiful diagrams <span className="text-rose-500">effortlessly</span>
            </h1>
            <p className="mt-6 max-w-[700px] text-lg text-gray-900 md:text-xl">
              Sketchio is a virtual whiteboard that lets you easily create and share diagrams, wireframes, and
              illustrations.
            </p>
            <div className="mt-10">
              <Link href="/draw">
                <Button size="lg" className="px-8 py-2 flex text-base bg-rose-500 hover:bg-rose-600 shadow-lg">
                  Start drawing <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white/50">
          <div className="">
            <div className="relative mx-auto aspect-video max-w-3xl overflow-hidden rounded-xl border bg-white shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-100 to-indigo-100 opacity-20 " />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
                    <source src="/video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute inset-0 pointer-events-none">
                    {/* <div className="absolute top-4 left-4 right-4 h-10 rounded-lg bg-white/80 shadow-sm flex items-center px-4">
                      <div className="w-24 h-5 bg-rose-200/80 rounded-md"></div>
                      <div className="ml-auto flex space-x-2">
                        <div className="w-8 h-5 bg-rose-200/80 rounded-md"></div>
                        <div className="w-8 h-5 bg-rose-200/80 rounded-md"></div>
                        <div className="w-8 h-5 bg-rose-200/80 rounded-md"></div>
                      </div>
                    </div> */}
                    {/* <div className="absolute top-16 left-4 bottom-4 w-12 rounded-lg bg-white/80 shadow-sm flex flex-col items-center py-4 space-y-4">
                      <div className="w-6 h-6 bg-rose-200/80 rounded-md"></div>
                      <div className="w-6 h-6 bg-rose-200/80 rounded-md"></div>
                      <div className="w-6 h-6 bg-rose-200/80 rounded-md"></div>
                      <div className="w-6 h-6 bg-rose-200/80 rounded-md"></div>
                    </div> */}
                    {/* <div className="absolute left-20 right-4 top-16 bottom-4 rounded-lg bg-white/60 shadow-sm">
                      <svg className="w-full h-full" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M200,100 C250,50 350,50 400,100 S550,150 600,100"
                          fill="none"
                          stroke="#f43f5e"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <rect
                          x="300"
                          y="200"
                          width="200"
                          height="150"
                          rx="10"
                          fill="none"
                          stroke="#f43f5e"
                          strokeWidth="3"
                        />
                        <circle cx="400" cy="450" r="80" fill="none" stroke="#f43f5e" strokeWidth="3" />
                        <path
                          d="M250,350 L350,350"
                          fill="none"
                          stroke="#f43f5e"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <path
                          d="M450,350 L550,350"
                          fill="none"
                          stroke="#f43f5e"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <path
                          d="M400,200 L400,150"
                          fill="none"
                          stroke="#f43f5e"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <path
                          d="M400,350 L400,370"
                          fill="none"
                          stroke="#f43f5e"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 place-items-center">
          <div className="container">
            <div className="mx-auto max-w-[800px] text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-black">
                Powerful features for your creative workflow
              </h2>
              <p className="mt-4 text-gray-900 md:text-lg">
                Everything you need to bring your ideas to life, all in one simple tool.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                  <Pencil className="h-6 w-6 text-rose-500" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-black">Intuitive Drawing</h3>
                <p className="mt-2 text-gray-900">
                  Simple yet powerful drawing tools that feel natural and responsive.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                  <Layers className="h-6 w-6 text-rose-500" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-black">Smart Components</h3>
                <p className="mt-2 text-gray-900">
                  Reusable components and templates to speed up your workflow.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                  <Share2 className="h-6 w-6 text-rose-500" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-black">Real-time Collaboration</h3>
                <p className="mt-2 text-gray-900">
                  Work together with your team in real-time, no matter where they are.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30 place-items-center">
          <div className="container">
            <div className="mx-auto max-w-[800px] text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-black">How it works</h2>
              <p className="mt-4 text-gray-900 md:text-lg">
                Get started in seconds and bring your ideas to life.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-white">1</div>
                <h3 className="mt-4 text-xl font-bold text-black">Create a board</h3>
                <p className="mt-2 text-gray-900">Start with a blank canvas or choose from our templates.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-white">2</div>
                <h3 className="mt-4 text-xl font-bold text-black">Draw and design</h3>
                <p className="mt-2 text-gray-900">
                  Use our intuitive tools to create your diagrams and illustrations.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-white">3</div>
                <h3 className="mt-4 text-xl font-bold text-black">Share and collaborate</h3>
                <p className="mt-2 text-gray-900">Invite others to view or edit your creations in real-time.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20 place-items-center">
          <div className="container">
            <div className="mx-auto max-w-[800px] text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-black">
                Loved by creators worldwide
              </h2>
              <p className="mt-4 text-gray-900 md:text-lg">
                Join thousands of designers, developers, and product managers who use Sketchio every day.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-rose-100">
                    <img src="/placeholder.svg" alt="Avatar" className="h-10 w-10 rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">Sarah Johnson</h4>
                    <p className="text-sm text-gray-900">Product Designer</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-900 ">
                  "Sketchio has completely transformed how our team collaborates on design projects. It's intuitive,
                  fast, and the real-time collaboration is a game-changer."
                </p>
              </div>
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-rose-100">
                    <img src="/placeholder.svg" alt="Avatar" className="h-10 w-10 rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">Michael Chen</h4>
                    <p className="text-sm text-gray-900">Software Engineer</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-900">
                  "As a developer, I use Sketchio to quickly sketch out system architectures and workflows. The
                  simplicity combined with powerful features makes it my go-to tool."
                </p>
              </div>
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-rose-100">
                    <img src="/placeholder.svg" alt="Avatar" className="h-10 w-10 rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">Emily Rodriguez</h4>
                    <p className="text-sm text-gray-900">Product Manager</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-900">
                  "Sketchio has become an essential part of our product development process. It's incredibly versatile
                  and helps us communicate ideas clearly across teams."
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 place-items-center">
          <div className="container">
            <div className="rounded-2xl bg-gradient-to-br from-rose-100 to-rose-50 p-10 md:p-16 shadow-xl">
              <div className="mx-auto max-w-[800px] text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-black">Ready to bring your ideas to life?</h2>
                <p className="mt-6 text-gray-700 md:text-xl max-w-2xl mx-auto">
                  Join thousands of creators who use Sketchio every day to visualize their ideas.
                </p>
                <Button 
                  size="lg" 
                  className="mt-8 px-4 py-2 text-base bg-rose-500 hover:bg-rose-600 shadow-lg"
                >
                  Start drawing for free
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-8 px-10">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Pencil className="h-6 w-6 text-rose-500" />
              <span className="text-xl font-bold text-black">Sketchio</span>
            </div>
            <p className="text-sm text-gray-900">© 2025 Sketchio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
