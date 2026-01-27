import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Menu, 
  Sun, 
  Moon, 
  ArrowRight, 
  Play, 
  Code, 
  Bot, 
  History, 
  Shield 
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import ProfileMenu from "@/pages/ProfileIcon"; // ✅ import profile menu

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // replace later with real auth
  const { theme, toggleTheme } = useTheme();

  // Features
  const features = [
    { icon: Code, title: "Multi-Language Support", description: "Review code in Python, JavaScript, Java, C, and C++ with intelligent analysis.", color: "text-blue-400" },
    { icon: Bot, title: "AI-Powered Analysis", description: "Get human-like suggestions for syntax, best practices, and optimization.", color: "text-purple-400" },
    { icon: History, title: "Submission History", description: "Track your code improvements and review past AI feedback.", color: "text-green-400" },
    { icon: Shield, title: "Secure & Fast", description: "Secure authentication with fast code analysis and feedback.", color: "text-orange-400" }
  ];

  // Steps
  const steps = [
    { number: 1, title: "Submit Your Code", description: "Upload your code in any supported language using our interactive editor." },
    { number: 2, title: "AI Analysis", description: "Our AI analyzes your code for syntax, best practices, and optimization opportunities." },
    { number: 3, title: "Get Feedback", description: "Receive detailed suggestions and track your progress over time." }
  ];

  // Navigation Links
  const navigation = {
    features: [
      { name: "Multi-language Support", href: "#features" },
      { name: "AI Code Analysis", href: "#features" },
      { name: "Submission History", href: "#features" },
      { name: "Real-time Feedback", href: "#features" },
    ],
    languages: [
      { name: "Python", href: "#python" },
      { name: "JavaScript", href: "#javascript" },
      { name: "TypeScript", href: "#typescript" },
      { name: "Java", href: "#java" },
      { name: "C / C++", href: "#cpp" },
    ],
    support: [
      { name: "Documentation", href: "#docs" },
      { name: "API Reference", href: "#api" },
      { name: "Community", href: "#community" },
      { name: "Contact Us", href: "#contact" },
    ],
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-3xl text-primary font-mono">&lt;/&gt;</span>
              <span className="font-bold text-xl text-primary">AI Code Reviewer</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => onNavigate("submit")} className="text-muted-foreground hover:text-foreground transition-colors">Submit Code</button>
              <button onClick={() => onNavigate("history")} className="text-muted-foreground hover:text-foreground transition-colors">History</button>
              <button onClick={() => onNavigate("about")} className="text-muted-foreground hover:text-foreground transition-colors">About Us</button>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={toggleTheme} className="w-9 px-0">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {!isAuthenticated ? (
                <>
                  <Button variant="ghost" onClick={() => onNavigate("login")}>Sign In</Button>
                  <Button onClick={() => onNavigate("submit")}>Get Started</Button>
                </>
              ) : (
                <ProfileMenu
                  onLogout={() => {
                    setIsAuthenticated(false);
                    onNavigate("home");
                  }}
                />
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-6 w-6" />
            </button>

          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col space-y-4">
                <button onClick={() => onNavigate("submit")} className="text-muted-foreground hover:text-foreground transition-colors text-left">Analyze Code</button>
                <a href="#history" className="text-muted-foreground hover:text-foreground transition-colors">History</a>
                <a href="#Aboutus" className="text-muted-foreground hover:text-foreground transition-colors">About us</a>

                <div className="flex flex-col space-y-2 pt-4">
                  {!isAuthenticated ? (
                    <>
                      <Button variant="ghost" className="justify-start" onClick={() => onNavigate("login")}>Sign In</Button>
                      <Button className="justify-start" onClick={() => onNavigate("submit")}>Get Started</Button>
                    </>
                  ) : (
                    <ProfileMenu
                      onLogout={() => {
                        setIsAuthenticated(false);
                        onNavigate("home");
                      }}
                    />
                  )}
                  <Button variant="outline" size="sm" onClick={toggleTheme} className="w-9 px-0 self-start">
                    {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section
          className="relative py-20 md:py-32 text-center overflow-hidden"
          style={{ backgroundImage: `url('./bg.jpeg')`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 bg-background/80 dark:bg-background/90"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6 tracking-tight">AI Code Reviewer</h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
                Improve your code quality with intelligent AI suggestions. Get instant feedback on syntax, best practices, and optimization for multiple programming languages.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                {!isAuthenticated && (
                  <>
                    <Button size="lg" className="group" onClick={() => onNavigate("submit")}>
                      Get Started <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="group bg-background/50 backdrop-blur-sm border-border/50"
                      onClick={() => onNavigate("login")}
                    >
                      <Play className="mr-2 h-4 w-4" /> Sign In
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl mb-6">Why Choose CodeReviewer AI?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Enhance your coding skills with advanced AI analysis and personalized feedback.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="border-border/50 hover:border-border transition-all duration-300 hover:scale-105 hover:shadow-xl bg-background/80 backdrop-blur-sm group"
                >
                  <CardHeader className="text-left">
                    <div className="w-14 h-14 rounded-xl bg-background/50 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                      <feature.icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* How it works */}
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl mb-12">How It Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {steps.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl mx-auto mb-6 shadow-lg">
                      {step.number}
                    </div>
                    <h4 className="text-lg mb-4">{step.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="bg-foreground">
          <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-4xl font-bold tracking-tight text-background sm:text-5xl">Ready to Improve Your Code?</h2>
              <p className="mx-auto mt-8 max-w-2xl text-xl leading-8 text-background/80">
                Join thousands of developers who trust our AI-powered code review platform.
              </p>
              {!isAuthenticated && (
                <div className="mt-12 flex items-center justify-center gap-x-6">
                  <Button
                    size="lg"
                    onClick={() => onNavigate("submit")}
                    className="bg-background text-foreground hover:bg-background/90 shadow-xl text-lg px-8 py-4 h-auto font-bold"
                  >
                    Get Started <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo & Desc */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-3xl text-primary font-mono">&lt;/&gt;</span>
                <span className="font-bold text-xl">AI Code Reviewer</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">
                Empowering developers with AI-powered code analysis and feedback.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="mb-4">Features</h3>
              <ul className="space-y-3">
                {navigation.features.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4">Languages</h3>
              <ul className="space-y-3">
                {navigation.languages.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4">Support</h3>
              <ul className="space-y-3">
                {navigation.support.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Separator />
          <div className="py-8 text-center">
            <p className="text-muted-foreground text-sm">© 2025 AI Code Reviewer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
