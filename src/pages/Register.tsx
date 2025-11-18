import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    studentId: "",
    fullName: "",
    university: "",
    course: "",
    graduationYear: new Date().getFullYear(),
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await register(formData);
      navigate('/student');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="space-y-6 rounded-3xl border border-white/20 bg-white/5 p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-purple text-white">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Student Registration</h3>
                <p className="text-sm text-white/70">Create your account to access AI-powered placement tools</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    required
                    className="border-white/15 bg-black/60 text-white placeholder:text-white/40 focus-visible:ring-accent-cyan"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentId" className="text-white">Student ID</Label>
                  <Input
                    id="studentId"
                    placeholder="e.g. STU-2048"
                    required
                    className="border-white/15 bg-black/60 text-white placeholder:text-white/40 focus-visible:ring-accent-cyan"
                    value={formData.studentId}
                    onChange={(e) => handleInputChange('studentId', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@university.edu"
                  required
                  className="border-white/15 bg-black/60 text-white placeholder:text-white/40 focus-visible:ring-accent-cyan"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    className="border-white/15 bg-black/60 text-white placeholder:text-white/40 focus-visible:ring-accent-cyan pr-10"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="university" className="text-white">University</Label>
                  <Input
                    id="university"
                    placeholder="Enter your university name"
                    required
                    className="border-white/15 bg-black/60 text-white placeholder:text-white/40 focus-visible:ring-accent-cyan"
                    value={formData.university}
                    onChange={(e) => handleInputChange('university', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course" className="text-white">Course</Label>
                  <Input
                    id="course"
                    placeholder="e.g. B.Tech Computer Science"
                    required
                    className="border-white/15 bg-black/60 text-white placeholder:text-white/40 focus-visible:ring-accent-cyan"
                    value={formData.course}
                    onChange={(e) => handleInputChange('course', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="graduationYear" className="text-white">Graduation Year</Label>
                <Input
                  id="graduationYear"
                  type="number"
                  placeholder="Enter graduation year"
                  required
                  className="border-white/15 bg-black/60 text-white placeholder:text-white/40 focus-visible:ring-accent-cyan"
                  value={formData.graduationYear}
                  onChange={(e) => handleInputChange('graduationYear', parseInt(e.target.value))}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-purple py-6 text-lg font-semibold text-white shadow-lg shadow-accent-glow/20 transition-all hover:shadow-xl hover:shadow-accent-glow/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <p className="text-center text-sm text-white/60">
                Already have an account?{" "}
                <button 
                  type="button"
                  onClick={() => navigate('/login')}
                  className="font-semibold text-accent-cyan hover:text-accent-cyan/80"
                >
                  Sign in
                </button>
              </p>
            </form>
          </div>

          <aside className="space-y-6 rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70">
              <ShieldCheck className="h-4 w-4 text-accent-cyan" />
              Secure Registration
            </div>
            <h4 className="text-2xl font-semibold text-white">Why join Nth Place?</h4>
            <p className="text-sm text-white/70 leading-relaxed">
              Get access to AI-powered tools that help you land your dream job faster.
            </p>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accent-cyan" />
                AI resume builder with real-time feedback and optimization.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accent-purple" />
                Smart job matching based on your skills and preferences.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accent-blue" />
                Mock interview practice with AI-generated questions.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accent-green" />
                Track applications and get insights on your progress.
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Register;