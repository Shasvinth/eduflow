'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Course, Lesson, Enrollment } from '@/types';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle,
  Circle,
  FileText,
  Download,
  MessageCircle,
  BarChart3,
  Book,
  Clock,
  Lock,
  Unlock
} from 'lucide-react';

export default function CourseLearningPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !user) {
        router.push('/auth/signin');
        return;
      }

      try {
        // Fetch course data
        const courseRef = doc(db, 'courses', id as string);
        const courseSnap = await getDoc(courseRef);
        
        if (!courseSnap.exists()) {
          router.push('/courses');
          return;
        }

        const courseData = { id: courseSnap.id, ...courseSnap.data() } as Course;
        setCourse(courseData);

        // Check enrollment
        const enrollmentQuery = query(
          collection(db, 'enrollments'),
          where('userId', '==', user.id),
          where('courseId', '==', id)
        );
        const enrollmentSnap = await getDocs(enrollmentQuery);
        
        if (enrollmentSnap.empty) {
          router.push(`/courses/${id}`);
          return;
        }

        const enrollmentData = { 
          id: enrollmentSnap.docs[0].id, 
          ...enrollmentSnap.docs[0].data() 
        } as Enrollment;
        setEnrollment(enrollmentData);

        // Fetch lessons
        const lessonsQuery = query(
          collection(db, 'lessons'),
          where('courseId', '==', id),
          orderBy('order', 'asc')
        );
        const lessonsSnap = await getDocs(lessonsQuery);
        const lessonsData = lessonsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Lesson[];
        
        setLessons(lessonsData);
        
        // Set first lesson as current if no lesson selected
        if (lessonsData.length > 0) {
          setCurrentLesson(lessonsData[0]);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        router.push('/courses');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user, router]);

  const markLessonComplete = async (lessonId: string) => {
    if (!enrollment || !user) return;

    try {
      const updatedCompletedLessons = [...enrollment.completedLessons];
      if (!updatedCompletedLessons.includes(lessonId)) {
        updatedCompletedLessons.push(lessonId);
      }

      const progress = Math.round((updatedCompletedLessons.length / lessons.length) * 100);

      await updateDoc(doc(db, 'enrollments', enrollment.id), {
        completedLessons: updatedCompletedLessons,
        progress: progress,
        lastAccessedAt: new Date()
      });

      setEnrollment({
        ...enrollment,
        completedLessons: updatedCompletedLessons,
        progress: progress
      });

    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return enrollment?.completedLessons.includes(lessonId) || false;
  };

  const isLessonAccessible = (lesson: Lesson, index: number) => {
    if (lesson.isPreview) return true;
    if (index === 0) return true;
    if (index > 0 && isLessonCompleted(lessons[index - 1].id)) return true;
    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <div className="w-16 h-16 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center border border-gray-200">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full opacity-10 animate-pulse"></div>
          </div>
          <motion.p 
            className="text-gray-800 font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading course content...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!course || !enrollment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be enrolled in this course to access the content.</p>
          <button
            onClick={() => router.push(`/courses/${id}`)}
            className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-2xl hover:from-gray-800 hover:to-gray-900 transition-colors"
          >
            View Course Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/courses/${id}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Course</span>
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-800 truncate max-w-xs sm:max-w-sm md:max-w-md">
                {course.title}
              </h1>
              <p className="text-sm text-gray-600">Progress: {enrollment.progress}%</p>
            </div>
          </div>
          
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Book size={20} />
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Course Content */}
        <motion.div
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:relative z-30 w-80 h-screen bg-white/80 backdrop-blur-lg border-r border-gray-200/50 transition-transform duration-300 ease-in-out overflow-y-auto`}
          initial={{ x: -320 }}
          animate={{ x: sidebarOpen ? 0 : -320 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Course Content</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BarChart3 size={16} />
                <span>{enrollment.progress}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-gray-700 to-gray-800 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${enrollment.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              {lessons.length === 0 ? (
                <div className="text-center py-8">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No lessons available yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    The instructor is still preparing the course content.
                  </p>
                </div>
              ) : (
                lessons.map((lesson, index) => {
                  const isCompleted = isLessonCompleted(lesson.id);
                  const isAccessible = isLessonAccessible(lesson, index);
                  const isCurrent = currentLesson?.id === lesson.id;

                  return (
                    <motion.button
                      key={lesson.id}
                      onClick={() => isAccessible && setCurrentLesson(lesson)}
                      disabled={!isAccessible}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                        isCurrent
                          ? 'bg-gray-100 border-gray-300 shadow-md'
                          : isAccessible
                          ? 'bg-white/50 border-gray-200 hover:bg-white/80 hover:border-gray-300'
                          : 'bg-gray-50 border-gray-100 cursor-not-allowed opacity-60'
                      }`}
                      whileHover={isAccessible ? { scale: 1.02 } : {}}
                      whileTap={isAccessible ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {isCompleted ? (
                            <CheckCircle size={20} className="text-green-500" />
                          ) : isAccessible ? (
                            lesson.isPreview ? (
                              <Unlock size={20} className="text-blue-500" />
                            ) : (
                              <Circle size={20} className="text-gray-400" />
                            )
                          ) : (
                            <Lock size={20} className="text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium mb-1 ${
                            isAccessible ? 'text-gray-800' : 'text-gray-500'
                          } truncate`}>
                            {lesson.title}
                          </h3>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Play size={12} />
                              <span>{lesson.duration} min</span>
                            </div>
                            {lesson.isPreview && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                                Preview
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-0">
          {currentLesson ? (
            <div className="p-6">
              <motion.div
                className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Video Player */}
                <div className="relative aspect-video bg-gray-900">
                  {currentLesson.videoUrl ? (
                    <video
                      src={currentLesson.videoUrl}
                      controls
                      className="w-full h-full"
                      poster={course.thumbnail}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-white">
                        <Play size={64} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg mb-2">Video content coming soon</p>
                        <p className="text-sm opacity-75">
                          The instructor is still preparing the video for this lesson.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lesson Content */}
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {currentLesson.title}
                      </h1>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{currentLesson.duration} minutes</span>
                        </div>
                        {currentLesson.isPreview && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                            Preview Lesson
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => markLessonComplete(currentLesson.id)}
                      disabled={isLessonCompleted(currentLesson.id)}
                      className={`px-6 py-2 rounded-2xl font-medium transition-colors ${
                        isLessonCompleted(currentLesson.id)
                          ? 'bg-green-100 text-green-800 cursor-default'
                          : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-800 hover:to-gray-900'
                      }`}
                    >
                      {isLessonCompleted(currentLesson.id) ? 'Completed' : 'Mark Complete'}
                    </button>
                  </div>

                  {/* Lesson Description */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">About This Lesson</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {currentLesson.description || 'No description available for this lesson.'}
                    </p>
                  </div>

                  {/* Lesson Content */}
                  {currentLesson.content && (
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">Lesson Notes</h2>
                      <div className="bg-gray-50/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                        <div className="prose prose-gray max-w-none">
                          <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Attachments */}
                  {currentLesson.attachments && currentLesson.attachments.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">Resources</h2>
                      <div className="space-y-2">
                        {currentLesson.attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50/50 backdrop-blur-sm rounded-2xl border border-gray-200/50"
                          >
                            <div className="flex items-center gap-3">
                              <FileText size={20} className="text-gray-600" />
                              <span className="text-gray-800">{attachment}</span>
                            </div>
                            <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                              <Download size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Discussion Section */}
                  <div className="border-t border-gray-200 pt-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-800">Discussion</h2>
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors">
                        <MessageCircle size={16} />
                        <span>Ask a Question</span>
                      </button>
                    </div>
                    <div className="text-center py-8 text-gray-600">
                      <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No discussions yet for this lesson.</p>
                      <p className="text-sm mt-2">Be the first to start a conversation!</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-6">
              <div className="text-center">
                <Book size={64} className="mx-auto mb-4 text-gray-400" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Select a Lesson</h2>
                <p className="text-gray-600">Choose a lesson from the sidebar to start learning.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
