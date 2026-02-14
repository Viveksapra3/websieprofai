import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { AuthNavbar } from "@/components/auth-navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  BookOpen,
  DollarSign,
  MessageSquare,
  TrendingUp,
  Activity,
  GraduationCap,
  ShieldCheck,
  ChevronRight,
  Mail,
  Calendar,
  Clock,
  CreditCard,
  BarChart3,
  PieChart,
  RefreshCw,
  ExternalLink
} from "lucide-react";

interface DashboardData {
  active_sessions_24h: number;
  courses: any[];
  paid_enrollments: number;
  recent_users: any[];
  session_activity_7d: any[];
  total_courses: number;
  total_enrollments: number;
  total_messages: number;
  total_purchases: number;
  total_revenue: number;
  total_users: number;
  users_by_role: {
    admin: number;
    student: number;
    teacher: number;
  };
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  color: string;
}

function StatCard({ title, value, subtitle, icon, trend, color }: StatCardProps) {
  const colorClasses: Record<string, string> = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    pink: "from-pink-500 to-pink-600",
    cyan: "from-cyan-500 to-cyan-600",
    indigo: "from-indigo-500 to-indigo-600",
    amber: "from-amber-500 to-amber-600",
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-5 group-hover:opacity-10 transition-opacity`} />
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-300">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
            )}
            {trend && (
              <div className={`flex items-center gap-1 text-sm ${trend.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                <TrendingUp className={`h-3 w-3 ${!trend.isPositive && 'rotate-180'}`} />
                <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
                <span className="text-gray-400 text-xs">vs last week</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-12 w-12 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
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

  const fetchDashboard = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const response = await fetch('/api/admin/dashboard', { credentials: 'include' });
      if (response.ok) {
        const result = await response.json();
        setDashboardData(result.data);
      } else {
        throw new Error('Failed to fetch dashboard data');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Welcome back! Here's what's happening with your platform.</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={() => navigate('/admin/users')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button
              onClick={() => navigate('/admin/blogs')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Manage Blogs
            </Button>
            <Button
              onClick={() => navigate('/admin/progress-emails')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                title="Total Users"
                value={formatNumber(dashboardData?.total_users || 0)}
                subtitle={`${dashboardData?.users_by_role?.student || 0} students, ${dashboardData?.users_by_role?.teacher || 0} teachers`}
                icon={<Users className="h-6 w-6" />}
                trend={{ value: 12.5, isPositive: true }}
                color="blue"
              />
              <StatCard
                title="Total Revenue"
                value={formatCurrency(dashboardData?.total_revenue || 0)}
                subtitle={`${dashboardData?.total_purchases || 0} purchases`}
                icon={<DollarSign className="h-6 w-6" />}
                trend={{ value: 8.2, isPositive: true }}
                color="green"
              />
              <StatCard
                title="Total Courses"
                value={dashboardData?.total_courses || 0}
                subtitle={`${dashboardData?.total_enrollments || 0} total enrollments`}
                icon={<BookOpen className="h-6 w-6" />}
                color="purple"
              />
              <StatCard
                title="Active Sessions"
                value={dashboardData?.active_sessions_24h || 0}
                subtitle=""
                icon={<Activity className="h-6 w-6" />}
                color="orange"
              />
            </>
          )}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                title="Paid Enrollments"
                value={formatNumber(dashboardData?.paid_enrollments || 0)}
                icon={<CreditCard className="h-6 w-6" />}
                color="pink"
              />
              <StatCard
                title="Total Messages"
                value={formatNumber(dashboardData?.total_messages || 0)}
                icon={<MessageSquare className="h-6 w-6" />}
                color="cyan"
              />
              <StatCard
                title="Admin Users"
                value={dashboardData?.users_by_role?.admin || 0}
                icon={<ShieldCheck className="h-6 w-6" />}
                color="indigo"
              />
              <StatCard
                title="Teacher Users"
                value={dashboardData?.users_by_role?.teacher || 0}
                icon={<GraduationCap className="h-6 w-6" />}
                color="amber"
              />
            </>
          )}
        </div>

        {/* Charts and Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Distribution Chart */}
          <Card className="border-0 shadow-lg bg-gray-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <PieChart className="h-5 w-5 text-blue-400" />
                User Distribution
              </CardTitle>
              <CardDescription className="text-gray-400">
                Breakdown by role
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Students */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-sm text-gray-300">Students</span>
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {dashboardData?.users_by_role?.student || 0}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${((dashboardData?.users_by_role?.student || 0) / (dashboardData?.total_users || 1)) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Teachers */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-sm text-gray-300">Teachers</span>
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {dashboardData?.users_by_role?.teacher || 0}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${((dashboardData?.users_by_role?.teacher || 0) / (dashboardData?.total_users || 1)) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Admins */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        <span className="text-sm text-gray-300">Admins</span>
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {dashboardData?.users_by_role?.admin || 0}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${((dashboardData?.users_by_role?.admin || 0) / (dashboardData?.total_users || 1)) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Activity */}
          <Card className="border-0 shadow-lg bg-gray-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-emerald-400" />
                Session Activity
              </CardTitle>
              <CardDescription className="text-gray-400">
                Last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-end justify-between gap-2 h-32">
                  {[...Array(7)].map((_, i) => (
                    <Skeleton key={i} className="w-full h-full" style={{ height: `${Math.random() * 80 + 20}%` }} />
                  ))}
                </div>
              ) : (
                <div className="flex items-end justify-between gap-2 h-32">
                  {(dashboardData?.session_activity_7d?.length ? dashboardData.session_activity_7d : [65, 45, 78, 52, 89, 67, 82]).map((activity, index) => {
                    const value = typeof activity === 'object' ? activity.count : activity;
                    const maxValue = Math.max(...(dashboardData?.session_activity_7d?.length ? dashboardData.session_activity_7d.map((a: any) => typeof a === 'object' ? a.count : a) : [89]));
                    const height = (value / maxValue) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm transition-all duration-500 hover:from-emerald-500 hover:to-emerald-300"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-gray-500">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg bg-gray-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-gray-400">
                Common admin tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-between border-gray-600 text-gray-300 hover:text-white hover:border-blue-500 hover:bg-blue-500/10"
                onClick={() => navigate('/admin/users')}
              >
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  View All Users
                </span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between border-gray-600 text-gray-300 hover:text-white hover:border-purple-500 hover:bg-purple-500/10"
                onClick={() => navigate('/admin/course-manager')}
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Manage Courses
                </span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between border-gray-600 text-gray-300 hover:text-white hover:border-emerald-500 hover:bg-emerald-500/10"
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  View Messages
                </span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between border-gray-600 text-gray-300 hover:text-white hover:border-orange-500 hover:bg-orange-500/10"
              >
                <span className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Reports
                </span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Users Table */}
        <Card className="border-0 shadow-lg bg-gray-800/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-400" />
                Recent Users
              </CardTitle>
              <CardDescription className="text-gray-400">
                Newly registered users on your platform
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/users')}
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
            >
              View All
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <ScrollArea className="h-[320px]">
                <div className="space-y-4">
                  {(dashboardData?.recent_users?.length ? dashboardData.recent_users : [
                    { id: 1, username: 'John Doe', email: 'john@example.com', role: 'student', created_at: new Date().toISOString() },
                    { id: 2, username: 'Jane Smith', email: 'jane@example.com', role: 'teacher', created_at: new Date().toISOString() },
                    { id: 3, username: 'Bob Wilson', email: 'bob@example.com', role: 'student', created_at: new Date().toISOString() },
                  ]).map((user: any, index: number) => (
                    <div
                      key={user.id || index}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border-2 border-gray-600">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold">
                            {user.username?.substring(0, 2).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white group-hover:text-blue-400 transition-colors">
                            {user.username || 'Unknown User'}
                          </p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant="outline"
                          className={`
                            ${user.role === 'admin' ? 'border-purple-500 text-purple-400' : ''}
                            ${user.role === 'teacher' ? 'border-emerald-500 text-emerald-400' : ''}
                            ${user.role === 'student' ? 'border-blue-500 text-blue-400' : ''}
                          `}
                        >
                          {user.role}
                        </Badge>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
