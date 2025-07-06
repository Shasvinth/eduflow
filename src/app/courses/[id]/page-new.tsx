'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Course, Enrollment } from '@/types';
import Image from 'next/image';
import Header from '@/components/Header';
import { 
  Users, 
  Star, 
  ArrowLeft, 
  Play,
  CheckCircle,
  UserCheck,
  Calendar,
  BarChart3
} from 'lucide-react';

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
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

          // Check if user is enrolled
          if (user) {
            const enrollmentQuery = query(
              collection(db, 'enrollments'),
              where('userId', '==', user.id),
              where('courseId', '==', id)
            );
            const enrollmentSnap = await getDocs(enrollmentQuery);
            
            if (!enrollmentSnap.empty) {
              const enrollmentData = { 
                id: enrollmentSnap.docs[0].id, 
                ...enrollmentSnap.docs[0].data() 
              } as Enrollment;
              setEnrollment(enrollmentData);
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
      
      // Refresh the page to show updated enrollment status
      window.location.reload();
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in course. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center pt-20">
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 text-center">Loading course details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center pt-20">
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h1>
            <p className="text-gray-600">The course you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <button
              onClick={() => router.push('/courses')}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              Browse All Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 p-2 hover:bg-white/50 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Courses
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Header */}
              <div className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {course.category}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium capitalize">
                    {course.level}
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{course.title}</h1>
                
                <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
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

                <p className="text-gray-700 leading-relaxed">{course.description}</p>
              </div>

              {/* Course Content Preview */}
              <div className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">What You&apos;ll Learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.learningOutcomes && course.learningOutcomes.length > 0 ? (
                    course.learningOutcomes.filter(outcome => outcome.trim() !== '').map((outcome, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{outcome}</span>
                      </div>
                    ))
                  ) : (
                    [
                      'Master core concepts and fundamentals',
                      'Build real-world projects',
                      'Industry best practices',
                      'Hands-on practical experience',
                      'Certificate of completion',
                      'Lifetime access to materials'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Course Requirements */}
              <div className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Requirements</h2>
                <div className="space-y-3">
                  {course.requirements && course.requirements.length > 0 ? (
                    course.requirements.filter(req => req.trim() !== '').map((requirement, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700">{requirement}</span>
                      </div>
                    ))
                  ) : (
                    [
                      'Basic computer literacy',
                      'Internet connection for online learning',
                      'Enthusiasm to learn',
                      'No prior experience required'
                    ].map((requirement, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700">{requirement}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Preview */}
              <div className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl overflow-hidden">
                <div className="relative aspect-video">
                  <Image
                    src={course.thumbnail || '/placeholder-course.jpg'}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <button className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <Play size={24} className="text-gray-800 ml-1" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="text-3xl font-bold text-gray-800 mb-4">
                    Free Course
                  </div>
                  
                  {enrollment ? (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                        <div className="flex items-center gap-2 text-green-800 mb-2">
                          <CheckCircle size={16} />
                          <span className="font-medium">Enrolled</span>
                        </div>
                        <div className="text-sm text-green-700">
                          Progress: {enrollment.progress}%
                        </div>
                      </div>
                      <button 
                        onClick={() => router.push(`/courses/${course.id}/learn`)}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-colors"
                      >
                        Continue Learning
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling || !user}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enrolling ? 'Enrolling...' : !user ? 'Sign In to Enroll' : 'Enroll Now'}
                    </button>
                  )}

                  <div className="mt-6 space-y-4 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Full lifetime access</span>
                      <CheckCircle size={16} className="text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Access on mobile and TV</span>
                      <CheckCircle size={16} className="text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Certificate of completion</span>
                      <CheckCircle size={16} className="text-green-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Stats */}
              <div className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-blue-500" />
                      <span className="text-gray-700">Students</span>
                    </div>
                    <span className="font-medium text-gray-800">{course.enrolledStudents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={16} className="text-purple-500" />
                      <span className="text-gray-700">Level</span>
                    </div>
                    <span className="font-medium text-gray-800 capitalize">{course.level}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-orange-500" />
                      <span className="text-gray-700">Updated</span>
                    </div>
                    <span className="font-medium text-gray-800">
                      {new Date(course.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
