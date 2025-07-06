"use client"

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Save, 
  ArrowLeft,
  Plus,
  Trash2,
  Eye,
  FileText,
  Users,
  Tag,
  BarChart3
} from 'lucide-react';
import { 
  doc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Course, Lesson } from '@/types';

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [newLesson, setNewLesson] = useState<{
    title: string;
    description: string;
    content: string;
    videoUrl: string;
    attachments: Array<{ name: string; type: string; data: string; size: number; }>;
    isPreview: boolean;
  }>({
    title: '',
    description: '',
    content: '',
    videoUrl: '',
    attachments: [],
    isPreview: false
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setCourseId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  const fetchCourse = useCallback(async () => {
    if (!courseId) return;
    
    try {
      setDataLoading(true);
      const courseDoc = await getDoc(doc(db, 'courses', courseId));
      
      if (courseDoc.exists()) {
        const courseData = { id: courseDoc.id, ...courseDoc.data() } as Course;
        
        // Check if user owns this course
        if (courseData.instructorId !== user?.id) {
          router.push('/dashboard/instructor');
          return;
        }
        
        setCourse(courseData);

        // Fetch lessons for this course
        const lessonsQuery = query(
          collection(db, 'lessons'),
          where('courseId', '==', courseId),
          orderBy('order', 'asc')
        );
        const lessonsSnap = await getDocs(lessonsQuery);
        const lessonsData = lessonsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Lesson[];
        setLessons(lessonsData);
      } else {
        router.push('/dashboard/instructor');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      router.push('/dashboard/instructor');
    } finally {
      setDataLoading(false);
    }
  }, [courseId, user?.id, router]);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (user?.role !== 'instructor') {
        router.push('/dashboard');
      } else if (courseId) {
        await fetchCourse();
      }
    };

    fetchCourseData();
  }, [user, courseId, router, fetchCourse]);

  const addLesson = async () => {
    if (!courseId || !newLesson.title.trim()) return;

    try {
      const lessonData = {
        ...newLesson,
        courseId,
        order: lessons.length + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'lessons'), lessonData);
      const addedLesson = { id: docRef.id, ...lessonData } as Lesson;
      
      setLessons(prev => [...prev, addedLesson]);
      setNewLesson({
        title: '',
        description: '',
        content: '',
        videoUrl: '',
        attachments: [],
        isPreview: false
      });
      setShowAddLesson(false);
    } catch (error) {
      console.error('Error adding lesson:', error);
    }
  };

  const deleteLesson = async (lessonId: string) => {
    try {
      await deleteDoc(doc(db, 'lessons', lessonId));
      setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  const handleInputChange = (field: keyof Course, value: string | string[]) => {
    if (course) {
      setCourse(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const handleSubmit = async () => {
    if (!course || !user || !courseId) return;

    try {
      setIsSubmitting(true);
      
      const updateData = {
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        category: course.category,
        level: course.level,
        learningOutcomes: course.learningOutcomes || [],
        requirements: course.requirements || [],
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'courses', courseId), updateData);
      
      alert('Course updated successfully!');
      router.push('/dashboard/instructor');
      
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { id: 'programming', name: 'Programming' },
    { id: 'design', name: 'Design' },
    { id: 'business', name: 'Business' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'data-science', name: 'Data Science' },
    { id: 'languages', name: 'Languages' }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8
      }
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            className="flex flex-col items-center space-y-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="w-16 h-16 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center border border-gray-200">
                <BookOpen className="h-8 w-8 animate-pulse text-gray-800" />
              </div>
            </div>
            <motion.p 
              className="text-gray-800 font-medium"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Loading course...
            </motion.p>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Header />
      
      <motion.div 
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div className="mb-12" variants={itemVariants}>
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="bg-white/50 border-white/30 hover:bg-white/70"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <h1 className="text-4xl md:text-5xl font-extralight text-black mb-4 tracking-tight">
            Edit Course
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Update your course information and content.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <motion.div 
              className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl"
              variants={itemVariants}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <Input
                    value={course.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter course title"
                    className="bg-white/50 border-white/30 focus:bg-white/70"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Description *
                  </label>
                  <textarea
                    value={course.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white/70 text-gray-900"
                    placeholder="Describe your course..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={course.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white/70 text-gray-900"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level *
                    </label>
                    <select
                      value={course.level}
                      onChange={(e) => handleInputChange('level', e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                      className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white/70 text-gray-900"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Thumbnail
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            handleInputChange('thumbnail', reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                    />
                    {course.thumbnail && (
                      <div className="relative w-32 h-20 rounded-lg overflow-hidden">
                        <Image
                          src={course.thumbnail}
                          alt="Thumbnail preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Learning Outcomes */}
            <motion.div 
              className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  What You&apos;ll Learn
                </h2>
                <Button
                  onClick={() => {
                    const newOutcomes = [...(course.learningOutcomes || []), ''];
                    handleInputChange('learningOutcomes', newOutcomes);
                  }}
                  size="sm"
                  variant="outline"
                  className="bg-white/50 border-white/30 hover:bg-white/70"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Point
                </Button>
              </div>

              <div className="space-y-3">
                {(course.learningOutcomes || ['']).map((outcome, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Input
                      value={outcome}
                      onChange={(e) => {
                        const newOutcomes = [...(course.learningOutcomes || [])];
                        newOutcomes[index] = e.target.value;
                        handleInputChange('learningOutcomes', newOutcomes);
                      }}
                      placeholder="What will students learn?"
                      className="bg-white/50 border-white/30 focus:bg-white/70"
                    />
                    {(course.learningOutcomes || []).length > 1 && (
                      <Button
                        onClick={() => {
                          const newOutcomes = (course.learningOutcomes || []).filter((_, i) => i !== index);
                          handleInputChange('learningOutcomes', newOutcomes);
                        }}
                        size="sm"
                        variant="outline"
                        className="bg-red-50 border-red-200 hover:bg-red-100 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Requirements */}
            <motion.div 
              className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Requirements</h2>
                <Button
                  onClick={() => {
                    const newRequirements = [...(course.requirements || []), ''];
                    handleInputChange('requirements', newRequirements);
                  }}
                  size="sm"
                  variant="outline"
                  className="bg-white/50 border-white/30 hover:bg-white/70"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Requirement
                </Button>
              </div>

              <div className="space-y-3">
                {(course.requirements || ['']).map((req, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Input
                      value={req}
                      onChange={(e) => {
                        const newRequirements = [...(course.requirements || [])];
                        newRequirements[index] = e.target.value;
                        handleInputChange('requirements', newRequirements);
                      }}
                      placeholder="What do students need to know?"
                      className="bg-white/50 border-white/30 focus:bg-white/70"
                    />
                    {(course.requirements || []).length > 1 && (
                      <Button
                        onClick={() => {
                          const newRequirements = (course.requirements || []).filter((_, i) => i !== index);
                          handleInputChange('requirements', newRequirements);
                        }}
                        size="sm"
                        variant="outline"
                        className="bg-red-50 border-red-200 hover:bg-red-100 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Lesson Management */}
            <motion.div 
              className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl"
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Course Lessons
                </h2>
                <Button
                  onClick={() => setShowAddLesson(true)}
                  size="sm"
                  variant="outline"
                  className="bg-white/50 border-white/30 hover:bg-white/70"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lesson
                </Button>
              </div>

              {/* Existing Lessons */}
              <div className="space-y-4 mb-6">
                {lessons.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No lessons added yet. Create your first lesson to get started!</p>
                  </div>
                ) : (
                  lessons.map((lesson, index) => (
                    <div key={lesson.id} className="bg-gray-50/50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                              Lesson {index + 1}
                            </span>
                            {lesson.isPreview && (
                              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                                Preview
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{lesson.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            {lesson.videoUrl && <span>Has video</span>}
                            {lesson.content && <span>• Has content</span>}
                            {lesson.attachments && lesson.attachments.length > 0 && <span>• Has attachments</span>}
                          </div>
                        </div>
                        <Button
                          onClick={() => deleteLesson(lesson.id)}
                          size="sm"
                          variant="outline"
                          className="bg-red-50 border-red-200 hover:bg-red-100 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add New Lesson Form */}
              {showAddLesson && (
                <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Add New Lesson</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lesson Title *
                        </label>
                        <Input
                          value={newLesson.title}
                          onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter lesson title"
                          className="bg-white/50 border-white/30 focus:bg-white/70"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Attachments
                        </label>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            files.forEach(file => {
                              const reader = new FileReader();
                              reader.onload = () => {
                                const attachment = {
                                  name: file.name,
                                  type: file.type,
                                  data: reader.result as string,
                                  size: file.size
                                };
                                setNewLesson(prev => ({ 
                                  ...prev, 
                                  attachments: [...prev.attachments, attachment] 
                                }));
                              };
                              reader.readAsDataURL(file);
                            });
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                        />
                        {newLesson.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {newLesson.attachments.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <span className="text-sm">{file.name}</span>
                                <button
                                  onClick={() => {
                                    setNewLesson(prev => ({
                                      ...prev,
                                      attachments: prev.attachments.filter((_, i) => i !== index)
                                    }));
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newLesson.description}
                        onChange={(e) => setNewLesson(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white/70 text-gray-900"
                        placeholder="Describe what this lesson covers..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video URL (optional)
                      </label>
                      <Input
                        value={newLesson.videoUrl}
                        onChange={(e) => setNewLesson(prev => ({ ...prev, videoUrl: e.target.value }))}
                        placeholder="https://example.com/video.mp4"
                        className="bg-white/50 border-white/30 focus:bg-white/70"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lesson Content
                      </label>
                      <textarea
                        value={newLesson.content}
                        onChange={(e) => setNewLesson(prev => ({ ...prev, content: e.target.value }))}
                        rows={6}
                        className="w-full px-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white/70 text-gray-900"
                        placeholder="Enter the lesson content, notes, or instructions..."
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isPreview"
                        checked={newLesson.isPreview}
                        onChange={(e) => setNewLesson(prev => ({ ...prev, isPreview: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="isPreview" className="text-sm text-gray-700">
                        Make this a preview lesson (accessible to non-enrolled students)
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={addLesson}
                        disabled={!newLesson.title.trim()}
                        className="bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-800 hover:to-gray-900"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Lesson
                      </Button>
                      <Button
                        onClick={() => {
                          setShowAddLesson(false);
                          setNewLesson({
                            title: '',
                            description: '',
                            content: '',
                            videoUrl: '',
                            attachments: [],
                            isPreview: false
                          });
                        }}
                        variant="outline"
                        className="bg-white/50 border-white/30 hover:bg-white/70"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Actions */}
            <motion.div 
              className="flex gap-4"
              variants={itemVariants}
            >
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Updating...' : 'Update Course'}
              </Button>
              <Button
                onClick={() => router.push(`/courses/${course.id}`)}
                variant="outline"
                className="bg-white/50 border-white/30 hover:bg-white/70"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Preview */}
            <motion.div 
              className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Preview</h3>
              
              <div className="space-y-4">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl overflow-hidden">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-blue-400" />
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 line-clamp-2">
                    {course.title || 'Course Title'}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    by {course.instructorName}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Tag className="h-4 w-4 mr-2" />
                    {categories.find(c => c.id === course.category)?.name}
                  </div>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {course.level}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    Students
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {course.enrolledStudents || 0}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Help */}
            <motion.div 
              className="bg-blue-50/60 backdrop-blur-md border border-blue-200/30 rounded-2xl p-6 shadow-xl"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Tips for Success
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Keep your course title clear and descriptive</li>
                <li>• Write a compelling description that highlights benefits</li>
                <li>• Choose the right category and difficulty level</li>
                <li>• Use a high-quality thumbnail image</li>
                <li>• Preview your changes before saving</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <Footer />
    </motion.div>
  );
}
