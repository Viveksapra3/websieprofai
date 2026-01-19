import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { AuthNavbar } from "@/components/auth-navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Mail,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  LayoutDashboard
} from "lucide-react";

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  student_type: string | null;
  college_name: string | null;
  degree: string | null;
  school_class: string | null;
  school_affiliation: string | null;
  institution: string | null;
  subject: string | null;
  experience: string | null;
  terms_accepted: boolean;
  email_verified: boolean;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

interface UsersResponse {
  total_count: number;
  limit: number;
  offset: number;
  users: User[];
}

type SortField = 'username' | 'email' | 'role' | 'created_at' | 'last_login_at';
type SortDirection = 'asc' | 'desc';

export default function AdminUsers() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const [usersData, setUsersData] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Sorting
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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

  const fetchUsers = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const response = await fetch('/api/admin/users', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setUsersData(data);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    if (!usersData?.users) return [];
    
    let filtered = [...usersData.users];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.username?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.institution?.toLowerCase().includes(query) ||
        user.college_name?.toLowerCase().includes(query)
      );
    }
    
    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => 
        statusFilter === 'active' ? user.is_active : !user.is_active
      );
    }
    
    // Verified filter
    if (verifiedFilter !== 'all') {
      filtered = filtered.filter(user => 
        verifiedFilter === 'verified' ? user.email_verified : !user.email_verified
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];
      
      if (sortField === 'created_at' || sortField === 'last_login_at') {
        aVal = aVal ? new Date(aVal).getTime() : 0;
        bVal = bVal ? new Date(bVal).getTime() : 0;
      } else {
        aVal = (aVal || '').toString().toLowerCase();
        bVal = (bVal || '').toString().toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
    
    return filtered;
  }, [usersData, searchQuery, roleFilter, statusFilter, verifiedFilter, sortField, sortDirection]);

  // Paginated users
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 text-gray-500" />;
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 text-blue-400" />
      : <ArrowDown className="h-4 w-4 text-blue-400" />;
  };

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      teacher: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      student: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };
    const icons: Record<string, React.ReactNode> = {
      admin: <ShieldCheck className="h-3 w-3 mr-1" />,
      teacher: <GraduationCap className="h-3 w-3 mr-1" />,
      student: <BookOpen className="h-3 w-3 mr-1" />
    };
    return (
      <Badge variant="outline" className={`${styles[role] || ''} flex items-center`}>
        {icons[role]}
        {role}
      </Badge>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportUsers = () => {
    const csv = [
      ['ID', 'Username', 'Email', 'Role', 'Status', 'Email Verified', 'Institution', 'Created At'],
      ...filteredUsers.map(u => [
        u.id,
        u.username,
        u.email,
        u.role,
        u.is_active ? 'Active' : 'Inactive',
        u.email_verified ? 'Yes' : 'No',
        u.institution || u.college_name || '-',
        formatDate(u.created_at)
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: `Exported ${filteredUsers.length} users to CSV`
    });
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
            <div className="flex items-center gap-3 mb-2">
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
              <span className="text-gray-300">Users</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
            <p className="text-gray-400">
              Manage all users on your platform ({usersData?.total_count || 0} total)
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchUsers(true)}
              disabled={refreshing}
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportUsers}
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg bg-gray-800/50 backdrop-blur mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by name, email, or institution..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                />
              </div>
              
              {/* Role Filter */}
              <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-full lg:w-40 bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-full lg:w-40 bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Verified Filter */}
              <Select value={verifiedFilter} onValueChange={(v) => { setVerifiedFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-full lg:w-40 bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue placeholder="Verified" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Active Filters */}
            {(searchQuery || roleFilter !== 'all' || statusFilter !== 'all' || verifiedFilter !== 'all') && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-700">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-400">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                      Search: "{searchQuery}"
                      <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-white">×</button>
                    </Badge>
                  )}
                  {roleFilter !== 'all' && (
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                      Role: {roleFilter}
                      <button onClick={() => setRoleFilter('all')} className="ml-1 hover:text-white">×</button>
                    </Badge>
                  )}
                  {statusFilter !== 'all' && (
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                      Status: {statusFilter}
                      <button onClick={() => setStatusFilter('all')} className="ml-1 hover:text-white">×</button>
                    </Badge>
                  )}
                  {verifiedFilter !== 'all' && (
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                      {verifiedFilter === 'verified' ? 'Verified' : 'Unverified'}
                      <button onClick={() => setVerifiedFilter('all')} className="ml-1 hover:text-white">×</button>
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setRoleFilter('all');
                    setStatusFilter('all');
                    setVerifiedFilter('all');
                  }}
                  className="text-gray-400 hover:text-white ml-auto"
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-0 shadow-lg bg-gray-800/50 backdrop-blur">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <ScrollArea className="w-full">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700 hover:bg-transparent">
                        <TableHead className="text-gray-400">
                          <button
                            onClick={() => handleSort('username')}
                            className="flex items-center gap-2 hover:text-white transition-colors"
                          >
                            User {getSortIcon('username')}
                          </button>
                        </TableHead>
                        <TableHead className="text-gray-400">
                          <button
                            onClick={() => handleSort('role')}
                            className="flex items-center gap-2 hover:text-white transition-colors"
                          >
                            Role {getSortIcon('role')}
                          </button>
                        </TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                        <TableHead className="text-gray-400">Verified</TableHead>
                        <TableHead className="text-gray-400">
                          <button
                            onClick={() => handleSort('created_at')}
                            className="flex items-center gap-2 hover:text-white transition-colors"
                          >
                            Joined {getSortIcon('created_at')}
                          </button>
                        </TableHead>
                        <TableHead className="text-gray-400">
                          <button
                            onClick={() => handleSort('last_login_at')}
                            className="flex items-center gap-2 hover:text-white transition-colors"
                          >
                            Last Login {getSortIcon('last_login_at')}
                          </button>
                        </TableHead>
                        <TableHead className="text-gray-400 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12">
                            <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">No users found matching your criteria</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedUsers.map((user) => (
                          <TableRow
                            key={user.id}
                            className="border-gray-700 hover:bg-gray-700/30 cursor-pointer transition-colors"
                            onClick={() => navigate(`/admin/users/${user.id}`)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border-2 border-gray-600">
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold">
                                    {user.username?.substring(0, 2).toUpperCase() || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-white">{user.username || 'Unknown'}</p>
                                  <p className="text-sm text-gray-400">{user.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                            <TableCell>
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
                            </TableCell>
                            <TableCell>
                              {user.email_verified ? (
                                <CheckCircle className="h-5 w-5 text-emerald-400" />
                              ) : (
                                <XCircle className="h-5 w-5 text-gray-500" />
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-gray-400 text-sm">
                                <Calendar className="h-3 w-3" />
                                {formatDate(user.created_at)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-gray-400 text-sm">
                                <Clock className="h-3 w-3" />
                                {user.last_login_at ? formatDate(user.last_login_at) : 'Never'}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                                  <DropdownMenuLabel className="text-gray-400">Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator className="bg-gray-700" />
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/admin/users/${user.id}`);
                                    }}
                                    className="text-gray-300 focus:text-white focus:bg-gray-700"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(`mailto:${user.email}`);
                                    }}
                                    className="text-gray-300 focus:text-white focus:bg-gray-700"
                                  >
                                    <Mail className="h-4 w-4 mr-2" />
                                    Send Email
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-gray-700" />
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toast({
                                        title: user.is_active ? "Deactivate User" : "Activate User",
                                        description: `This action would ${user.is_active ? 'deactivate' : 'activate'} ${user.username}`
                                      });
                                    }}
                                    className={user.is_active ? "text-red-400 focus:text-red-300 focus:bg-red-500/10" : "text-emerald-400 focus:text-emerald-300 focus:bg-emerald-500/10"}
                                  >
                                    {user.is_active ? (
                                      <>
                                        <UserX className="h-4 w-4 mr-2" />
                                        Deactivate
                                      </>
                                    ) : (
                                      <>
                                        <UserCheck className="h-4 w-4 mr-2" />
                                        Activate
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-700">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>
                      Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length} users
                    </span>
                    <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(parseInt(v)); setCurrentPage(1); }}>
                      <SelectTrigger className="w-20 h-8 bg-gray-700/50 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                    <span>per page</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="border-gray-600 text-gray-400 hover:text-white disabled:opacity-50"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="border-gray-600 text-gray-400 hover:text-white disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className={currentPage === pageNum 
                              ? "bg-blue-600 text-white" 
                              : "border-gray-600 text-gray-400 hover:text-white"
                            }
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="border-gray-600 text-gray-400 hover:text-white disabled:opacity-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="border-gray-600 text-gray-400 hover:text-white disabled:opacity-50"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
