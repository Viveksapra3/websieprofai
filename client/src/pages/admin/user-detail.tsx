import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { AuthNavbar } from "@/components/auth-navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Mail,
  Shield,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  GraduationCap,
  BookOpen,
  Building,
  Briefcase,
  Award,
  Target,
  TrendingUp,
  BarChart3,
  FileText,
  Activity,
  Star,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Copy,
  LayoutDashboard,
  User,
  Settings,
  History
} from "lucide-react";

interface UserDetails {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  student_type?: string | null;
  college_name?: string | null;
  degree?: string | null;
  school_class?: string | null;
  school_affiliation?: string | null;
  institution?: string | null;
  subject?: string | null;
  experience?: string | null;
  terms_accepted?: boolean;
  email_verified?: boolean;
  is_active?: boolean;
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface QuizStatistics {
  total_attempts: number;
  avg_score: number;
  best_score: number;
  passed_count: number;
}

interface QuizAttempt {
  id: number;
  quiz_id: string;
  score: number;
  total_questions: number;
  submitted_at: string;
}

interface QuizStatsResponse {
  user_id: number;
  quiz_statistics: QuizStatistics;
  recent_attempts: QuizAttempt[];
}

export default function AdminUserDetail() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const userId = params.id;

  const [user, setUser] = useState<UserDetails | null>(null);
  const [quizStats, setQuizStats] = useState<QuizStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAdminSession = async () => {
      try {
        const response = await fetch('/api/admin/session', { credentials: 'include' });
        const data = await response.json();
        if (data.authenticated) {
          setIsAdmin(true);
        } else {
          const stored = localStorage.getItem('adminUser');
          if (stored) {
            setIsAdmin(true);
          } else {
            navigate('/admin/login');
          }
        }
      } catch {
        navigate('/admin/login');
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAdminSession();
  }, [navigate]);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        throw new Error('Failed to fetch user details');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load user details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizStats = async () => {
    try {
      const response = await fetch(`/api/admin/user/${userId}/quiz-stats`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setQuizStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch quiz stats:', error);
    } finally {
      setQuizLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await Promise.all([fetchUserDetails(), fetchQuizStats()]);
    setRefreshing(false);
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
      fetchQuizStats();
    }
  }, [userId]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`
    });
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      teacher: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      student: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };
    const icons: Record<string, React.ReactNode> = {
      admin: <ShieldCheck className="h-4 w-4 mr-1" />,
      teacher: <GraduationCap className="h-4 w-4 mr-1" />,
      student: <BookOpen className="h-4 w-4 mr-1" />
    };
    return (
      <Badge variant="outline" className={`${styles[role] || ''} flex items-center text-sm px-3 py-1`}>
        {icons[role]}
        {role?.charAt(0).toUpperCase() + role?.slice(1)}
      </Badge>
    );
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-emerald-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-emerald-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (checkingAuth || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <AuthNavbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/dashboard')}
            className="text-gray-400 hover:text-white -ml-2"
          >
            <LayoutDashboard className="h-4 w-4 mr-1" />
            Dashboard
          </Button>
          <ChevronRight className="h-4 w-4 text-gray-600" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/users')}
            className="text-gray-400 hover:text-white"
          >
            <Users className="h-4 w-4 mr-1" />
            Users
          </Button>
          <ChevronRight className="h-4 w-4 text-gray-600" />
          <span className="text-gray-300">{user?.username || 'User Details'}</span>
        </div>

        {loading ? (
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-gray-800/50 backdrop-blur">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : user ? (
          <div className="space-y-6">
            {/* User Header Card */}
            <Card className="border-0 shadow-lg bg-gray-800/50 backdrop-blur overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
              <CardContent className="p-8 relative">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Avatar & Basic Info */}
                  <div className="flex items-start gap-6">
                    <Avatar className="h-24 w-24 border-4 border-gray-700 shadow-xl">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold">
                        {user.username?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-2xl font-bold text-white mb-2">{user.username}</h1>
                      <div className="flex items-center gap-2 text-gray-400 mb-3">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                        <button
                          onClick={() => copyToClipboard(user.email, 'Email')}
                          className="p-1 hover:bg-gray-700 rounded transition-colors"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {getRoleBadge(user.role)}
                        {user.is_active ? (
                          <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                        {user.email_verified ? (
                          <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Unverified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="lg:ml-auto flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={refreshData}
                      disabled={refreshing}
                      className="border-gray-600 text-gray-300 hover:text-white"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`mailto:${user.email}`)}
                      className="border-gray-600 text-gray-300 hover:text-white"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    <Button
                      size="sm"
                      className={user.is_active 
                        ? "bg-red-600 hover:bg-red-700" 
                        : "bg-emerald-600 hover:bg-emerald-700"
                      }
                      onClick={() => {
                        toast({
                          title: user.is_active ? "Deactivate User" : "Activate User",
                          description: `This action would ${user.is_active ? 'deactivate' : 'activate'} ${user.username}`
                        });
                      }}
                    >
                      {user.is_active ? (
                        <>
                          <XCircle className="h-4 w-4 mr-2" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Activate
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-700">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{quizStats?.quiz_statistics?.total_attempts || 0}</p>
                    <p className="text-sm text-gray-400">Quiz Attempts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{quizStats?.quiz_statistics?.avg_score?.toFixed(1) || 0}</p>
                    <p className="text-sm text-gray-400">Avg Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-400">{quizStats?.quiz_statistics?.best_score || 0}</p>
                    <p className="text-sm text-gray-400">Best Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">{quizStats?.quiz_statistics?.passed_count || 0}</p>
                    <p className="text-sm text-gray-400">Passed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Section */}
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="bg-gray-800/50 border border-gray-700 p-1">
                <TabsTrigger value="profile" className="data-[state=active]:bg-gray-700">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="quizzes" className="data-[state=active]:bg-gray-700">
                  <Target className="h-4 w-4 mr-2" />
                  Quiz History
                </TabsTrigger>
                <TabsTrigger value="activity" className="data-[state=active]:bg-gray-700">
                  <Activity className="h-4 w-4 mr-2" />
                  Activity
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <Card className="border-0 shadow-lg bg-gray-800/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-400" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">User ID</p>
                          <p className="text-white font-medium">#{user.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Username</p>
                          <p className="text-white font-medium">{user.username || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Email</p>
                          <p className="text-white font-medium">{user.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Role</p>
                          <p className="text-white font-medium capitalize">{user.role}</p>
                        </div>
                      </div>
                      <Separator className="bg-gray-700" />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Terms Accepted</p>
                          <p className="text-white font-medium flex items-center gap-1">
                            {user.terms_accepted ? (
                              <><CheckCircle className="h-4 w-4 text-emerald-400" /> Yes</>
                            ) : (
                              <><XCircle className="h-4 w-4 text-red-400" /> No</>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Email Verified</p>
                          <p className="text-white font-medium flex items-center gap-1">
                            {user.email_verified ? (
                              <><CheckCircle className="h-4 w-4 text-emerald-400" /> Yes</>
                            ) : (
                              <><XCircle className="h-4 w-4 text-red-400" /> No</>
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Role-Specific Information */}
                  <Card className="border-0 shadow-lg bg-gray-800/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        {user.role === 'teacher' ? (
                          <><GraduationCap className="h-5 w-5 text-emerald-400" /> Teacher Details</>
                        ) : user.role === 'student' ? (
                          <><BookOpen className="h-5 w-5 text-blue-400" /> Student Details</>
                        ) : (
                          <><ShieldCheck className="h-5 w-5 text-purple-400" /> Admin Details</>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {user.role === 'teacher' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Institution</p>
                            <p className="text-white font-medium flex items-center gap-2">
                              <Building className="h-4 w-4 text-gray-500" />
                              {user.institution || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Subject</p>
                            <p className="text-white font-medium flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-gray-500" />
                              {user.subject || 'N/A'}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-sm text-gray-400 mb-1">Experience</p>
                            <p className="text-white font-medium flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-gray-500" />
                              {user.experience || 'N/A'}
                            </p>
                          </div>
                        </div>
                      )}
                      {user.role === 'student' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Student Type</p>
                            <p className="text-white font-medium capitalize">{user.student_type || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">College/School</p>
                            <p className="text-white font-medium">{user.college_name || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Degree/Class</p>
                            <p className="text-white font-medium">{user.degree || user.school_class || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Affiliation</p>
                            <p className="text-white font-medium">{user.school_affiliation || 'N/A'}</p>
                          </div>
                        </div>
                      )}
                      {user.role === 'admin' && (
                        <div className="text-center py-8">
                          <ShieldCheck className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                          <p className="text-gray-400">This user has administrator privileges</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Timestamps */}
                  <Card className="border-0 shadow-lg bg-gray-800/50 backdrop-blur lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <History className="h-5 w-5 text-orange-400" />
                        Account Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-blue-500/20">
                            <Calendar className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Created At</p>
                            <p className="text-white font-medium">{formatDateTime(user.created_at)}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-emerald-500/20">
                            <Clock className="h-5 w-5 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Last Login</p>
                            <p className="text-white font-medium">{formatDateTime(user.last_login_at)}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-purple-500/20">
                            <RefreshCw className="h-5 w-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Last Updated</p>
                            <p className="text-white font-medium">{formatDateTime(user.updated_at)}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Quiz History Tab */}
              <TabsContent value="quizzes">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Quiz Statistics */}
                  <Card className="border-0 shadow-lg bg-gray-800/50 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-400" />
                        Quiz Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {quizLoading ? (
                        <div className="space-y-4">
                          <Skeleton className="h-16 w-full" />
                          <Skeleton className="h-16 w-full" />
                          <Skeleton className="h-16 w-full" />
                        </div>
                      ) : quizStats?.quiz_statistics ? (
                        <>
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-400 text-sm">Total Attempts</span>
                              <span className="text-white font-bold text-lg">{quizStats.quiz_statistics.total_attempts}</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style={{ width: '100%' }} />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-400 text-sm">Average Score</span>
                              <span className="text-white font-bold text-lg">{quizStats.quiz_statistics.avg_score?.toFixed(1) || 0}%</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${getProgressColor(quizStats.quiz_statistics.avg_score || 0)}`}
                                style={{ width: `${quizStats.quiz_statistics.avg_score || 0}%` }}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-400 text-sm">Best Score</span>
                              <span className="text-emerald-400 font-bold text-lg">{quizStats.quiz_statistics.best_score || 0}%</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                                style={{ width: `${quizStats.quiz_statistics.best_score || 0}%` }}
                              />
                            </div>
                          </div>
                          
                          <Separator className="bg-gray-700" />
                          
                          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-emerald-500/20">
                                <Award className="h-5 w-5 text-emerald-400" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Pass Rate</p>
                                <p className="text-white font-bold">
                                  {quizStats.quiz_statistics.total_attempts > 0
                                    ? ((quizStats.quiz_statistics.passed_count / quizStats.quiz_statistics.total_attempts) * 100).toFixed(0)
                                    : 0}%
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-emerald-400">{quizStats.quiz_statistics.passed_count}</p>
                              <p className="text-xs text-gray-400">passed</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <Target className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400">No quiz statistics available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Quiz Attempts */}
                  <Card className="border-0 shadow-lg bg-gray-800/50 backdrop-blur lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <FileText className="h-5 w-5 text-emerald-400" />
                        Recent Quiz Attempts
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Latest quiz submissions by this user
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {quizLoading ? (
                        <div className="space-y-3">
                          {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                          ))}
                        </div>
                      ) : quizStats?.recent_attempts?.length ? (
                        <ScrollArea className="h-[400px]">
                          <div className="space-y-3">
                            {quizStats.recent_attempts.map((attempt, index) => {
                              const percentage = (attempt.score / attempt.total_questions) * 100;
                              const passed = percentage >= 60;
                              return (
                                <div
                                  key={attempt.id || index}
                                  className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${passed ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                                      {passed ? (
                                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                                      ) : (
                                        <XCircle className="h-5 w-5 text-red-400" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-white font-medium">{attempt.quiz_id}</p>
                                      <p className="text-sm text-gray-400 flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {formatDateTime(attempt.submitted_at)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className={`text-xl font-bold ${getScoreColor(attempt.score, attempt.total_questions)}`}>
                                      {attempt.score}/{attempt.total_questions}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {percentage.toFixed(0)}%
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="text-center py-12">
                          <FileText className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400">No quiz attempts found</p>
                          <p className="text-sm text-gray-500 mt-1">This user hasn't taken any quizzes yet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity">
                <Card className="border-0 shadow-lg bg-gray-800/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Activity className="h-5 w-5 text-purple-400" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      User's recent actions and events
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Activity className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">Activity tracking coming soon</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Detailed user activity logs will be displayed here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Back Button */}
            <div className="flex justify-start pt-4">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/users')}
                className="border-gray-600 text-gray-300 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Users
              </Button>
            </div>
          </div>
        ) : (
          <Card className="border-0 shadow-lg bg-gray-800/50 backdrop-blur">
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">User Not Found</h2>
              <p className="text-gray-400 mb-6">The requested user could not be found.</p>
              <Button onClick={() => navigate('/admin/users')}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Users
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
