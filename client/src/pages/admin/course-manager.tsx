import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AuthNavbar } from "@/components/auth-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Upload, Edit, Trash2, Save, X, Video, 
  FileText, Link, ChevronRight, GripVertical,
  Eye, EyeOff, Clock, CheckCircle
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  isPublished: boolean;
  order: number;
  modules?: Module[];
}

interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessons?: Lesson[];
}

interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  type: 'video' | 'quiz' | 'resource';
  order: number;
  duration?: number;
  videoUrl?: string;
  vimeoId?: string;
  youtubeId?: string;
  videoProvider?: 'vimeo' | 'youtube' | 'custom';
  resourceUrl?: string;
  resourceType?: 'pdf' | 'doc' | 'link';
}

export default function CourseManager() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    thumbnail: ''
  });

  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: ''
  });

  const [lessonForm, setLessonForm] = useState<{
    title: string;
    description: string;
    type: 'video' | 'quiz' | 'resource';
    videoProvider: 'vimeo' | 'youtube' | 'custom';
    vimeoId: string;
    youtubeId: string;
    videoUrl: string;
    resourceUrl: string;
    resourceType: 'pdf' | 'doc' | 'link';
  }>({
    title: '',
    description: '',
    type: 'video',
    videoProvider: 'vimeo',
    vimeoId: '',
    youtubeId: '',
    videoUrl: '',
    resourceUrl: '',
    resourceType: 'pdf'
  });

  // Check if user is admin (you should implement proper role checking)
  const isAdmin = currentUser?.email?.includes('admin') || true; // For demo

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const saveCourse = async () => {
    setLoading(true);
    try {
      const method = selectedCourse ? 'PUT' : 'POST';
      const url = selectedCourse 
        ? `/api/courses/${selectedCourse.id}`
        : '/api/courses';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseForm)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Course ${selectedCourse ? 'updated' : 'created'} successfully`
        });
        fetchCourses();
        setCourseForm({ title: '', description: '', thumbnail: '' });
        setSelectedCourse(null);
        setIsEditing(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save course",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveModule = async () => {
    if (!selectedCourse) return;
    
    setLoading(true);
    try {
      const method = selectedModule ? 'PUT' : 'POST';
      const url = selectedModule 
        ? `/api/modules/${selectedModule.id}`
        : '/api/modules';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...moduleForm,
          courseId: selectedCourse.id
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Module ${selectedModule ? 'updated' : 'created'} successfully`
        });
        fetchCourses();
        setModuleForm({ title: '', description: '' });
        setSelectedModule(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save module",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveLesson = async () => {
    if (!selectedModule) return;
    
    setLoading(true);
    try {
      const lessonData: any = {
        title: lessonForm.title,
        description: lessonForm.description,
        type: lessonForm.type,
        moduleId: selectedModule.id
      };

      // Add type-specific fields
      if (lessonForm.type === 'video') {
        lessonData.videoProvider = lessonForm.videoProvider;
        if (lessonForm.videoProvider === 'vimeo') {
          lessonData.vimeoId = lessonForm.vimeoId;
        } else if (lessonForm.videoProvider === 'youtube') {
          lessonData.youtubeId = lessonForm.youtubeId;
        } else {
          lessonData.videoUrl = lessonForm.videoUrl;
        }
      } else if (lessonForm.type === 'resource') {
        lessonData.resourceUrl = lessonForm.resourceUrl;
        lessonData.resourceType = lessonForm.resourceType;
      }

      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lessonData)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Lesson created successfully"
        });
        fetchCourses();
        setLessonForm({
          title: '',
          description: '',
          type: 'video',
          videoProvider: 'vimeo',
          vimeoId: '',
          youtubeId: '',
          videoUrl: '',
          resourceUrl: '',
          resourceType: 'pdf'
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save lesson",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (courseId: string, isPublished: boolean) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !isPublished })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Course ${!isPublished ? 'published' : 'unpublished'} successfully`
        });
        fetchCourses();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update course status",
        variant: "destructive"
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900">
        <AuthNavbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
              <p>You need admin privileges to access this page.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <AuthNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Course Manager</h1>
          <p className="text-gray-400">Create and manage your course content</p>
        </div>

        <Tabs defaultValue="courses" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="modules" disabled={!selectedCourse}>
              Modules
            </TabsTrigger>
            <TabsTrigger value="lessons" disabled={!selectedModule}>
              Lessons
            </TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Management</CardTitle>
                <CardDescription>Create and organize your courses</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Course Form */}
                {isEditing && (
                  <div className="space-y-4 mb-6 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="title">Course Title</Label>
                      <Input
                        id="title"
                        value={courseForm.title}
                        onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                        placeholder="Enter course title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={courseForm.description}
                        onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                        placeholder="Enter course description"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="thumbnail">Thumbnail URL</Label>
                      <Input
                        id="thumbnail"
                        value={courseForm.thumbnail}
                        onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                        placeholder="Enter thumbnail URL (optional)"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={saveCourse} disabled={loading}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Course
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsEditing(false);
                          setCourseForm({ title: '', description: '', thumbnail: '' });
                          setSelectedCourse(null);
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Course List */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Existing Courses</h3>
                    {!isEditing && (
                      <Button onClick={() => setIsEditing(true)} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New Course
                      </Button>
                    )}
                  </div>
                  
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {courses.map((course) => (
                        <div
                          key={course.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <div className="flex items-center gap-3">
                            <GripVertical className="h-5 w-5 text-gray-400" />
                            <div>
                              <h4 className="font-medium">{course.title}</h4>
                              <p className="text-sm text-gray-500">{course.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={course.isPublished ? "default" : "secondary"}>
                              {course.isPublished ? "Published" : "Draft"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedCourse(course);
                                setCourseForm({
                                  title: course.title,
                                  description: course.description,
                                  thumbnail: course.thumbnail || ''
                                });
                                setIsEditing(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePublish(course.id, course.isPublished)}
                            >
                              {course.isPublished ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedCourse(course)}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Module Management</CardTitle>
                <CardDescription>
                  Organize lessons into modules for: {selectedCourse?.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Module Form */}
                <div className="space-y-4 mb-6 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="moduleTitle">Module Title</Label>
                    <Input
                      id="moduleTitle"
                      value={moduleForm.title}
                      onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                      placeholder="Enter module title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="moduleDescription">Description</Label>
                    <Textarea
                      id="moduleDescription"
                      value={moduleForm.description}
                      onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                      placeholder="Enter module description"
                      rows={2}
                    />
                  </div>
                  <Button onClick={saveModule} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Module
                  </Button>
                </div>

                {/* Module List */}
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {selectedCourse?.modules?.map((module) => (
                      <div
                        key={module.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <div>
                          <h4 className="font-medium">{module.title}</h4>
                          <p className="text-sm text-gray-500">{module.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedModule(module)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lessons Tab */}
          <TabsContent value="lessons" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lesson Management</CardTitle>
                <CardDescription>
                  Add lessons to: {selectedModule?.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Lesson Form */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="lessonTitle">Lesson Title</Label>
                    <Input
                      id="lessonTitle"
                      value={lessonForm.title}
                      onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                      placeholder="Enter lesson title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lessonType">Lesson Type</Label>
                    <Select
                      value={lessonForm.type}
                      onValueChange={(value: 'video' | 'quiz' | 'resource') => 
                        setLessonForm({ ...lessonForm, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">
                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            Video
                          </div>
                        </SelectItem>
                        <SelectItem value="resource">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Resource
                          </div>
                        </SelectItem>
                        <SelectItem value="quiz">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Quiz
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Video-specific fields */}
                  {lessonForm.type === 'video' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="videoProvider">Video Provider</Label>
                        <Select
                          value={lessonForm.videoProvider}
                          onValueChange={(value: 'vimeo' | 'youtube' | 'custom') => 
                            setLessonForm({ ...lessonForm, videoProvider: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vimeo">Vimeo</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="custom">Custom URL</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {lessonForm.videoProvider === 'vimeo' && (
                        <div className="space-y-2">
                          <Label htmlFor="vimeoId">Vimeo Video ID</Label>
                          <Input
                            id="vimeoId"
                            value={lessonForm.vimeoId}
                            onChange={(e) => setLessonForm({ ...lessonForm, vimeoId: e.target.value })}
                            placeholder="Enter Vimeo video ID"
                          />
                        </div>
                      )}

                      {lessonForm.videoProvider === 'youtube' && (
                        <div className="space-y-2">
                          <Label htmlFor="youtubeId">YouTube Video ID</Label>
                          <Input
                            id="youtubeId"
                            value={lessonForm.youtubeId}
                            onChange={(e) => setLessonForm({ ...lessonForm, youtubeId: e.target.value })}
                            placeholder="Enter YouTube video ID"
                          />
                        </div>
                      )}

                      {lessonForm.videoProvider === 'custom' && (
                        <div className="space-y-2">
                          <Label htmlFor="videoUrl">Video URL</Label>
                          <Input
                            id="videoUrl"
                            value={lessonForm.videoUrl}
                            onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                            placeholder="Enter video URL"
                          />
                        </div>
                      )}
                    </>
                  )}

                  {/* Resource-specific fields */}
                  {lessonForm.type === 'resource' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="resourceType">Resource Type</Label>
                        <Select
                          value={lessonForm.resourceType}
                          onValueChange={(value: 'pdf' | 'doc' | 'link') => 
                            setLessonForm({ ...lessonForm, resourceType: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="doc">Document</SelectItem>
                            <SelectItem value="link">External Link</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="resourceUrl">Resource URL</Label>
                        <Input
                          id="resourceUrl"
                          value={lessonForm.resourceUrl}
                          onChange={(e) => setLessonForm({ ...lessonForm, resourceUrl: e.target.value })}
                          placeholder="Enter resource URL"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="lessonDescription">Description (Optional)</Label>
                    <Textarea
                      id="lessonDescription"
                      value={lessonForm.description}
                      onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                      placeholder="Enter lesson description"
                      rows={2}
                    />
                  </div>

                  <Button onClick={saveLesson} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Lesson
                  </Button>
                </div>

                {/* Lesson List */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Module Lessons</h3>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {selectedModule?.lessons?.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {lesson.type === 'video' && <Video className="h-4 w-4" />}
                            {lesson.type === 'resource' && <FileText className="h-4 w-4" />}
                            {lesson.type === 'quiz' && <CheckCircle className="h-4 w-4" />}
                            <div>
                              <h4 className="font-medium">{lesson.title}</h4>
                              {lesson.duration && (
                                <p className="text-sm text-gray-500">
                                  <Clock className="h-3 w-3 inline mr-1" />
                                  {Math.floor(lesson.duration / 60)} mins
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
