import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider"; // ✅ use your theme context

interface AboutUsProps {
  onNavigate: (page: string) => void;
}

interface TeamMember {
  name: string;
  role: string;
  email: string;
  avatarUrl?: string;
  bio: string;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export function AboutUs({ onNavigate }: AboutUsProps) {
  const { theme, toggleTheme } = useTheme(); // ✅ from provider

  const teamMembers: TeamMember[] = [
    {
      name: "Afreen Jahan",
      role: "UI/UX Designer & Team Lead",
      email: "afreen@gmail.com",
      avatarUrl: "https://example.com/avatar1.png",
      bio: "afreen specializes in creating beautiful and responsive user interfaces with React and Next.js.",
    },
    {
      name: "B. Abhiram",
      role: "DB Engineer",
      email: "abhiram@gmail.com",
      bio: "Abhiram builds robust APIs and manages databases with a focus on performance and security.",
    },
    {
      name: "G. Kalyan Rao",
      role: "Developer Lead",
      email: "Kalyan@gmail.com",
      avatarUrl: "https://example.com/avatar3.png",
      bio: "Kalyan crafts intuitive and engaging user experiences with a keen eye for detail.",
    },
    {
      name: "K. Abhigna",
      role: "Documentation Maker",
      email: "Abhigna@gmail.com",
      bio: "Abhigna leads the team ensuring projects are delivered on time and meet quality standards.",
    },
  ];

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-[#000000] text-[#ffffff]"
          : "bg-[#ffffff] text-[#000000]"
      } min-h-screen transition-colors duration-500`}
    >
      {/* Header */}
      <div
        className={`border-b ${
          theme === "dark" ? "border-[#333333]" : "border-[#e5e5e5]"
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
            <h1 className="text-2xl font-semibold">About Us</h1>
          </div>
          <Button
            onClick={toggleTheme}
            className="rounded-xl shadow-md hover:scale-105 transition-transform flex items-center gap-2"
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

      {/* Team Section */}
      <div className="container mx-auto px-6 py-10">
        <Card
          className={`rounded-2xl shadow-xl ${
            theme === "dark"
              ? "bg-[#0a0a0a] border border-[#222222]"
              : "bg-[#fafafa] border border-[#dddddd]"
          }`}
        >
          <CardHeader>
            <CardTitle className="text-xl">Our Team</CardTitle>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Hover over a card to learn more about each member.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-6">
              {teamMembers.map((member) => (
                <div
                  key={member.email}
                  className={`group relative rounded-2xl border shadow-lg overflow-hidden
                    transform transition-all duration-500 hover:scale-105 ${
                      theme === "dark"
                        ? "bg-[#111111] border-[#333333] hover:shadow-[#ffffff30]"
                        : "bg-[#ffffff] border-[#dddddd] hover:shadow-lg"
                    }`}
                >
                  {/* Avatar */}
                  <div className="flex flex-col items-center p-6">
                    <Avatar className="mb-4 h-20 w-20 border">
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>

                    {/* Basic Info */}
                    <h3 className="text-lg font-semibold text-center">
                      {member.name}
                    </h3>
                    <p
                      className={`text-sm text-center ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {member.role}
                    </p>
                  </div>

                  {/* Hover Overlay */}
                  <div
                    className={`absolute inset-0 flex flex-col justify-center items-center px-6 py-8 
                               opacity-0 group-hover:opacity-100 
                               transition-all duration-500 text-center ${
                                 theme === "dark"
                                   ? "bg-black/90 text-white"
                                   : "bg-white/95 text-black"
                               }`}
                  >
                    <p className="text-sm mb-4">{member.bio}</p>
                    <a href={`mailto:${member.email}`}>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="rounded-lg shadow-md hover:scale-105 transition-transform"
                      >
                        Contact
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
