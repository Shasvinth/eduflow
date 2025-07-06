'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Course } from '@/types';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle,
  Users,
  Star,
  UserCheck,
  Play,
  Clock,
  Award
} from 'lucide-react';

export default function EnrollPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return;

      try {
        // Fetch course data
        const courseRef = doc(db, 'courses', id as string);
        const courseSnap = await getDoc(courseRef);
        
        if (courseSnap.exists()) {
          const courseData = { id: courseSnap.id, ...courseSnap.data() } as Course;
          setCourse(courseData);

          // Check if user is already enrolled
          if (user) {
            const enrollmentQuery = query(
              collection(db, 'enrollments'),
              where('userId', '==', user.id),
              where('courseId', '==', id)
            );
            const enrollmentSnap = await getDocs(enrollmentQuery);
            
            if (!enrollmentSnap.empty) {
              setIsEnrolled(true);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user || !course) return;

    setEnrolling(true);
    try {
      const enrollmentData = {
        userId: user.id,
        courseId: course.id,
        progress: 0,
        completedLessons: [],
        enrolledAt: new Date(),
        lastAccessedAt: new Date()
      };

      await addDoc(collection(db, 'enrollments'), enrollmentData);
      setIsEnrolled(true);
      
      // Redirect to learning page after a short delay
      setTimeout(() => {
        router.push(`/courses/${course.id}/learn`);
      }, 2000);
      
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in course. Please try again.');
    } finally {
      setEnrolling(false);
    }
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
            Loading course details...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h1>
          <p className="text-gray-600">The course you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <button
            onClick={() => router.push('/courses')}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-2xl hover:from-gray-800 hover:to-gray-900 transition-colors"
          >
            Browse All Courses
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">You need to sign in to enroll in this course.</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/auth/signin')}
              className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-2xl hover:from-gray-800 hover:to-gray-900 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push(`/courses/${id}`)}
              className="px-6 py-2 bg-white/50 border border-gray-300 text-gray-700 rounded-2xl hover:bg-white/70 transition-colors"
            >
              Back to Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-12 pb-12">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full opacity-10 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Back Button */}
        <motion.button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 p-2 hover:bg-white/50 rounded-xl transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ArrowLeft size={20} />
          Back
        </motion.button>

        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Course Header */}
            <div className="relative">
              <div className="aspect-video">
                <Image
                  src={course.thumbnail || '/placeholder-course.jpg'}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                      {course.category}
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium capitalize">
                      {course.level}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
                  <div className="flex items-center gap-4 text-white/90">
                    <div className="flex items-center gap-2">
                      <UserCheck size={16} />
                      <span>by {course.instructorName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>{course.enrolledStudents} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      <span>{course.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              {isEnrolled ? (
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Already Enrolled!</h2>
                  <p className="text-gray-600 mb-6">
                    You&apos;re already enrolled in this course. Continue your learning journey!
                  </p>
                  <button
                    onClick={() => router.push(`/courses/${course.id}/learn`)}
                    className="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-2xl font-medium hover:from-gray-800 hover:to-gray-900 transition-colors"
                  >
                    Continue Learning
                  </button>
                </motion.div>
              ) : (
                <>
                  {/* Course Description */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Course</h2>
                    <p className="text-gray-700 leading-relaxed">{course.description}</p>
                  </div>

                  {/* What You'll Learn */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">What You&apos;ll Learn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.learningOutcomes && course.learningOutcomes.length > 0 ? (
                        course.learningOutcomes.filter(outcome => outcome.trim() !== '').map((outcome, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{outcome}</span>
                          </motion.div>
                        ))
                      ) : (
                        [
                          'Master core concepts and fundamentals',
                          'Build real-world projects',
                          'Industry best practices',
                          'Hands-on practical experience'
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Requirements</h2>
                    <div className="space-y-3">
                      {course.requirements && course.requirements.length > 0 ? (
                        course.requirements.filter(req => req.trim() !== '').map((requirement, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            <span className="text-gray-700">{requirement}</span>
                          </motion.div>
                        ))
                      ) : (
                        [
                          'Basic computer literacy',
                          'Internet connection for online learning',
                          'Enthusiasm to learn'
                        ].map((requirement, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            <span className="text-gray-700">{requirement}</span>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Course Features */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Features</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Play size={24} className="text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">Video Lectures</h3>
                        <p className="text-sm text-gray-600">High-quality video content</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Clock size={24} className="text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">Lifetime Access</h3>
                        <p className="text-sm text-gray-600">Learn at your own pace</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Award size={24} className="text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">Certificate</h3>
                        <p className="text-sm text-gray-600">Certificate of completion</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Users size={24} className="text-orange-600" />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">Community</h3>
                        <p className="text-sm text-gray-600">Join course discussions</p>
                      </div>
                    </div>
                  </div>

                  {/* Enrollment Section */}
                  <motion.div
                    className="bg-gray-50/50 backdrop-blur-sm rounded-2xl p-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Start Learning?</h2>
                    <p className="text-gray-600 mb-6">
                      Join thousands of students and start your journey with this comprehensive course.
                    </p>
                    
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-gray-800 mb-2">Free Course</div>
                      <p className="text-gray-600">Full access • Lifetime enrollment • Certificate included</p>
                    </div>

                    <motion.button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="px-12 py-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-2xl font-medium text-lg hover:from-gray-800 hover:to-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {enrolling ? 'Enrolling...' : 'Enroll Now - It\'s Free!'}
                    </motion.button>

                    <p className="text-sm text-gray-500 mt-4">
                      By enrolling, you agree to our terms of service and privacy policy
                    </p>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
