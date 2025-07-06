'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Course, Enrollment } from '@/types';
import Image from 'next/image';
import { 
  User, 
  Edit, 
  Mail, 
  Calendar, 
  BookOpen, 
  Award, 
  Clock,
  Users,
  Star,
  ArrowLeft
} from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<(Enrollment & { course: Course })[]>([]);
  const [createdCourses, setCreatedCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState({
    totalEnrollments: 0,
    completedCourses: 0,
    totalStudents: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        if (user.role === 'student') {
          // Fetch student enrollments
          const enrollmentQuery = query(
            collection(db, 'enrollments'),
            where('userId', '==', user.id),
            orderBy('enrolledAt', 'desc')
          );
          
          const enrollmentSnap = await getDocs(enrollmentQuery);
          const enrollmentData = [];
          
          for (const doc of enrollmentSnap.docs) {
            const enrollment = { id: doc.id, ...doc.data() } as Enrollment;
            
            // Fetch course data for each enrollment
            const courseQuery = query(
              collection(db, 'courses'),
              where('__name__', '==', enrollment.courseId)
            );
            const courseSnap = await getDocs(courseQuery);
            
            if (!courseSnap.empty) {
              const course = { id: courseSnap.docs[0].id, ...courseSnap.docs[0].data() } as Course;
              enrollmentData.push({ ...enrollment, course });
            }
          }
          
          setEnrollments(enrollmentData);
          setStats({
            totalEnrollments: enrollmentData.length,
            completedCourses: enrollmentData.filter(e => e.progress === 100).length,
            totalStudents: 0,
            totalRevenue: 0
          });
        } else if (user.role === 'instructor') {
          // Fetch instructor's courses
          const coursesQuery = query(
            collection(db, 'courses'),
            where('instructorId', '==', user.id),
            orderBy('createdAt', 'desc')
          );
          
          const coursesSnap = await getDocs(coursesQuery);
          const coursesData = coursesSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Course[];
          
          setCreatedCourses(coursesData);
          
          const totalStudents = coursesData.reduce((sum, course) => sum + course.enrolledStudents, 0);
          const totalRevenue = coursesData.reduce((sum, course) => sum + (course.price * course.enrolledStudents), 0);
          
          setStats({
            totalEnrollments: 0,
            completedCourses: 0,
            totalStudents,
            totalRevenue
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 p-2 hover:bg-white/50 rounded-xl transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8">
              {/* Avatar */}
              <div className="text-center mb-6">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.displayName}
                    width={120}
                    height={120}
                    className="w-30 h-30 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-30 h-30 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-lg">
                    <User size={48} className="text-white" />
                  </div>
                )}
                <h1 className="text-2xl font-bold text-gray-800 mt-4">{user.displayName}</h1>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-500" />
                  <span className="text-gray-700">{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-gray-500" />
                  <span className="text-gray-700">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Edit Profile Button */}
              <button
                onClick={() => router.push('/profile/edit')}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                <Edit size={18} />
                Edit Profile
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h2>
              <div className="space-y-4">
                {user.role === 'student' ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-blue-500" />
                        <span className="text-gray-700">Enrolled Courses</span>
                      </div>
                      <span className="font-medium text-gray-800">{stats.totalEnrollments}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award size={16} className="text-green-500" />
                        <span className="text-gray-700">Completed</span>
                      </div>
                      <span className="font-medium text-gray-800">{stats.completedCourses}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-blue-500" />
                        <span className="text-gray-700">Courses Created</span>
                      </div>
                      <span className="font-medium text-gray-800">{createdCourses.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-green-500" />
                        <span className="text-gray-700">Total Students</span>
                      </div>
                      <span className="font-medium text-gray-800">{stats.totalStudents}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star size={16} className="text-yellow-500" />
                        <span className="text-gray-700">Revenue</span>
                      </div>
                      <span className="font-medium text-gray-800">Rs. {stats.totalRevenue.toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {user.role === 'student' ? (
              /* Student Enrollments */
              <div className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Learning</h2>
                
                {enrollments.length > 0 ? (
                  <div className="space-y-4">
                    {enrollments.map((enrollment) => (
                      <div
                        key={enrollment.id}
                        className="bg-white/50 border border-gray-200 rounded-2xl p-6 hover:bg-white/70 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <Image
                              src={enrollment.course.thumbnail || '/placeholder-course.jpg'}
                              alt={enrollment.course.title}
                              fill
                              className="object-cover rounded-xl"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                              {enrollment.course.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3">
                              by {enrollment.course.instructorName}
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>{Math.floor(enrollment.course.duration / 60)}h {enrollment.course.duration % 60}m</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users size={14} />
                                <span>{enrollment.course.enrolledStudents} students</span>
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{enrollment.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${enrollment.progress}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => router.push(`/courses/${enrollment.course.id}`)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm hover:from-blue-700 hover:to-purple-700 transition-colors"
                            >
                              {enrollment.progress === 100 ? 'Review' : 'Continue Learning'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Enrollments Yet</h3>
                    <p className="text-gray-600 mb-6">Start learning by enrolling in your first course</p>
                    <button
                      onClick={() => router.push('/courses')}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-colors"
                    >
                      Browse Courses
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Instructor Courses */
              <div className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
                  <button
                    onClick={() => router.push('/courses/create')}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm hover:from-blue-700 hover:to-purple-700 transition-colors"
                  >
                    Create Course
                  </button>
                </div>
                
                {createdCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {createdCourses.map((course) => (
                      <div
                        key={course.id}
                        className="bg-white/50 border border-gray-200 rounded-2xl p-6 hover:bg-white/70 transition-colors"
                      >
                        <div className="relative w-full h-32 mb-4">
                          <Image
                            src={course.thumbnail || '/placeholder-course.jpg'}
                            alt={course.title}
                            fill
                            className="object-cover rounded-xl"
                          />
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {course.title}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            <span>{course.enrolledStudents}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                            <span>{course.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-green-600 font-medium">
                            Rs. {course.price.toLocaleString()}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => router.push(`/courses/${course.id}`)}
                          className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm hover:from-blue-700 hover:to-purple-700 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Courses Yet</h3>
                    <p className="text-gray-600 mb-6">Share your knowledge by creating your first course</p>
                    <button
                      onClick={() => router.push('/courses/create')}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-colors"
                    >
                      Create Course
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
