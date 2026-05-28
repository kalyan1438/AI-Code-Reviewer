import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Moon,
  Sun,
  Github,
  Linkedin,
  Mail,
  Code2,
  Server,
  Shield,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface AboutUsProps {
  onNavigate: (page: string) => void;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export function AboutUs({ onNavigate }: AboutUsProps) {
  const { theme, toggleTheme } = useTheme();

  const skills = [
    "Java",
    "Node.js",
    "Express.js",
    "React.js",
    "TypeScript",
    "MongoDB",
    "Redis",
    "Socket.IO",
    "Docker",
    "NGINX",
    "AWS EC2",
    "JWT",
  ];

  const highlights = [
    {
      icon: <Server className="h-6 w-6" />,
      title: "Distributed Systems",
      description:
        "Built scalable real-time applications using Redis Pub/Sub, Docker containers, and NGINX load balancing.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Communication",
      description:
        "Implemented JWT authentication and E2EE messaging using AES-GCM encryption with ECDH key exchange.",
    },
    {
      icon: <Code2 className="h-6 w-6" />,
      title: "Problem Solving",
      description:
        "Solved 400+ LeetCode problems with strong focus on DSA and backend engineering concepts.",
    },
  ];

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-black text-white"
          : "bg-white text-black"
      } min-h-screen transition-colors duration-500`}
    >
      {/* Header */}
      <div
        className={`border-b ${
          theme === "dark" ? "border-[#222222]" : "border-[#e5e5e5]"
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => onNavigate("")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>

            <h1 className="text-2xl font-bold">About Developer</h1>
          </div>

          <Button
            onClick={toggleTheme}
            className="rounded-xl flex items-center gap-2"
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-4 w-4" /> Light Mode
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" /> Dark Mode
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12">
        <Card
          className={`rounded-3xl overflow-hidden shadow-2xl ${
            theme === "dark"
              ? "bg-[#0a0a0a] border border-[#222222]"
              : "bg-[#fafafa] border border-[#dddddd]"
          }`}
        >
          <CardContent className="p-10">
            <div className="flex flex-col lg:flex-row items-center gap-10">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <Avatar className="h-36 w-36 border-4 border-gray-500 shadow-xl">
                  <AvatarImage src="" alt="Kalyan Rao" />
                  <AvatarFallback className="text-3xl font-bold">
                    {getInitials("Kalyan Rao Gajulavarthi")}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-4xl font-bold mb-3">
                  Kalyan Rao Gajulavarthi
                </h2>

                <p
                  className={`text-lg mb-6 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-700"
                  }`}
                >
                  Backend-Focused Full Stack Developer passionate about
                  distributed systems, scalable real-time applications, and
                  modern developer tooling.
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                  <a
                    href="mailto:kalyanrao135@gmail.com"
                    target="_blank"
                  >
                    <Button className="rounded-xl gap-2">
                      <Mail className="h-4 w-4" /> Contact
                    </Button>
                  </a>

                  <a
                    href="https://github.com/kalyan1438"
                    target="_blank"
                  >
                    <Button
                      variant="outline"
                      className="rounded-xl gap-2"
                    >
                      <Github className="h-4 w-4" /> GitHub
                    </Button>
                  </a>

                  <a
                    href="https://linkedin.com/in/kalyan1438"
                    target="_blank"
                  >
                    <Button
                      variant="outline"
                      className="rounded-xl gap-2"
                    >
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </Button>
                  </a>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-[#151515] border border-[#333333] text-gray-200"
                          : "bg-white border border-[#dddddd] text-gray-700"
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* About Section */}
      <div className="container mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {highlights.map((item) => (
            <Card
              key={item.title}
              className={`rounded-2xl transition-all duration-300 hover:scale-105 ${
                theme === "dark"
                  ? "bg-[#0f0f0f] border border-[#222222]"
                  : "bg-[#fafafa] border border-[#dddddd]"
              }`}
            >
              <CardContent className="p-8">
                <div className="mb-5">{item.icon}</div>

                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>

                <p
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  } leading-relaxed`}
                >
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Projects Section */}
      <div className="container mx-auto px-6 pb-16">
        <Card
          className={`rounded-3xl ${
            theme === "dark"
              ? "bg-[#0a0a0a] border border-[#222222]"
              : "bg-[#fafafa] border border-[#dddddd]"
          }`}
        >
          <CardContent className="p-10">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Featured Projects
            </h2>

            <div className="space-y-8">
              {/* Project 1 */}
              <div
                className={`rounded-2xl p-6 border ${
                  theme === "dark"
                    ? "bg-[#111111] border-[#222222]"
                    : "bg-white border-[#dddddd]"
                }`}
              >
                <h3 className="text-2xl font-semibold mb-3">
                  Distributed Real-Time Chat Application with E2EE
                </h3>

                <p
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  } leading-relaxed`}
                >
                  Developed a distributed real-time communication platform using
                  Socket.IO, Redis Pub/Sub, Dockerized backend containers, and
                  NGINX load balancing. Implemented JWT authentication and
                  end-to-end encrypted messaging using AES-GCM with ECDH-based
                  secure session key exchange.
                </p>
              </div>

              {/* Project 2 */}
              <div
                className={`rounded-2xl p-6 border ${
                  theme === "dark"
                    ? "bg-[#111111] border-[#222222]"
                    : "bg-white border-[#dddddd]"
                }`}
              >
                <h3 className="text-2xl font-semibold mb-3">
                  CodeReviewer AI
                </h3>

                <p
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  } leading-relaxed`}
                >
                  Built an AI-assisted code review platform supporting 6
                  programming languages including Java, Python, C/C++,
                  JavaScript, and TypeScript. Integrated Monaco Editor for
                  in-browser coding, JWT authentication for secure access, and
                  MongoDB for persistent review history storage.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
