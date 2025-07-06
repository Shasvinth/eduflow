"use client"

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  Star,
  TrendingUp,
  ArrowLeft,
  UserCheck,
  GraduationCap,
  Calendar,
  Activity
} from 'lucide-react';
import { 
  collection, 
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Course, User, Enrollment } from '@/types';

export default function AdminAnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalInstructors: 0,
    averageRating: 0,
    topCourse: null as Course | null,
    recentUsers: [] as User[],
    popularCourses: [] as Course[]
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    } else if (user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const fetchAnalyticsData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setDataLoading(true);

      // Fetch all users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];

      // Fetch all courses
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const coursesData = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[];

      // Fetch all enrollments
      const enrollmentsSnapshot = await getDocs(collection(db, 'enrollments'));
      const enrollmentsData = enrollmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Enrollment[];

      // Calculate analytics
      const totalUsers = usersData.length;
      const totalCourses = coursesData.length;
      const totalEnrollments = enrollmentsData.length;
      const totalInstructors = usersData.filter(u => u.role === 'instructor').length;
      
      const averageRating = coursesData.length > 0 
        ? coursesData.reduce((sum, course) => sum + (course.rating || 0), 0) / coursesData.length 
        : 0;

      // Find top course by enrollment
      const topCourse = coursesData.reduce((top, course) => {
        return (course.enrolledStudents || 0) > (top?.enrolledStudents || 0) ? course : top;
      }, null as Course | null);

      // Get recent users (last 5)
      const recentUsers = usersData
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      // Get popular courses (top 5 by enrollment)
      const popularCourses = coursesData
        .sort((a, b) => (b.enrolledStudents || 0) - (a.enrolledStudents || 0))
        .slice(0, 5);

      setAnalytics({
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalInstructors,
        averageRating: Number(averageRating.toFixed(1)),
        topCourse,
        recentUsers,
        popularCourses
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setDataLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id && user?.role === 'admin') {
      fetchAnalyticsData();
    }
  }, [user, fetchAnalyticsData]);

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
                <BarChart3 className="h-8 w-8 animate-pulse text-gray-800" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full opacity-10 animate-pulse"></div>
            </div>
            <motion.p 
              className="text-gray-800 font-medium"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Loading analytics...
            </motion.p>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
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
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-green-200 to-blue-200 rounded-full opacity-10 blur-3xl"
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
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-gray-300 to-gray-200 rounded-full opacity-10 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div 
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12"
        variants={containerVariants}
      >
        {/* Header Section */}
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
          <h1 className="text-4xl md:text-5xl font-extralight text-black mb-4 tracking-tight bg-gradient-to-br from-black via-gray-800 to-gray-600 bg-clip-text text-transparent">
            Platform Analytics
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Monitor platform performance and user engagement across the entire system.
          </p>
        </motion.div>

        {/* Analytics Overview Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12"
          variants={itemVariants}
        >
          <motion.div 
            className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl"
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {analytics.totalUsers}
              </span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Total Users</p>
          </motion.div>

          <motion.div 
            className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl"
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {analytics.totalCourses}
              </span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Total Courses</p>
          </motion.div>

          <motion.div 
            className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl"
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-3 rounded-xl">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {analytics.totalEnrollments}
              </span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Total Enrollments</p>
          </motion.div>

          <motion.div 
            className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl"
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {analytics.totalInstructors}
              </span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Instructors</p>
          </motion.div>

          <motion.div 
            className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl"
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl">
                <Star className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {analytics.averageRating}
              </span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Avg Rating</p>
          </motion.div>
        </motion.div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Top Performing Course */}
          <motion.div 
            className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-8 shadow-xl"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Top Performing Course</h2>
            {analytics.topCourse ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{analytics.topCourse.title}</h3>
                    <p className="text-gray-600">by {analytics.topCourse.instructorName}</p>
                    <p className="text-gray-600">{analytics.topCourse.enrolledStudents} students enrolled</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{analytics.topCourse.rating || 0}</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{analytics.topCourse.level}</div>
                    <div className="text-sm text-gray-600">Level</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No courses available</p>
              </div>
            )}
          </motion.div>

          {/* Recent Users */}
          <motion.div 
            className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-8 shadow-xl"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Users</h2>
            <div className="space-y-4">
              {analytics.recentUsers.length > 0 ? (
                analytics.recentUsers.map((recentUser) => (
                  <div key={recentUser.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {recentUser.displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{recentUser.displayName}</p>
                        <p className="text-xs text-gray-600">{recentUser.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">
                        {new Date(recentUser.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent users</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Popular Courses */}
        <motion.div className="mb-12" variants={itemVariants}>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Popular Courses</h2>
          <div className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl overflow-hidden">
            {analytics.popularCourses.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {analytics.popularCourses.map((course, index) => (
                  <div key={course.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">#{index + 1}</span>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                          <p className="text-gray-600">by {course.instructorName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">{course.enrolledStudents || 0}</div>
                          <div className="text-gray-600">Students</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">{course.rating || 0}</div>
                          <div className="text-gray-600">Rating</div>
                        </div>
                        <div className="text-center">
                          <div className={`font-semibold ${course.isPublished ? 'text-green-600' : 'text-yellow-600'}`}>
                            {course.isPublished ? 'Published' : 'Draft'}
                          </div>
                          <div className="text-gray-600">Status</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No courses found</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Platform Insights */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={itemVariants}>
          <div className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                <p className="text-lg font-bold text-gray-900">+12.5%</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Monthly user growth</p>
          </div>

          <div className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Engagement</p>
                <p className="text-lg font-bold text-gray-900">78%</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Active users this month</p>
          </div>

          <div className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-100 p-3 rounded-xl">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Session</p>
                <p className="text-lg font-bold text-gray-900">24 min</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Average session duration</p>
          </div>
        </motion.div>
      </motion.div>

      <Footer />
    </motion.div>
  );
}
