"use client"

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  TrendingUp, 
  Play, 
  CheckCircle
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  doc,
  getDoc 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Course, Enrollment } from '@/types';

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<(Enrollment & { course: Course })[]>([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    activeCourses: 0,
    averageProgress: 0
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  const fetchStudentData = useCallback(async () => {
    try {
      setDataLoading(true);
      
      // Fetch student enrollments
      const enrollmentsQuery = query(
        collection(db, 'enrollments'),
        where('userId', '==', user?.id),
        orderBy('enrolledAt', 'desc')
      );
      
      const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
      const enrollmentsData: (Enrollment & { course: Course })[] = [];
      
      // For each enrollment, fetch the course details
      for (const enrollmentDoc of enrollmentsSnapshot.docs) {
        const enrollmentData = { id: enrollmentDoc.id, ...enrollmentDoc.data() } as Enrollment;
        
        // Fetch course details
        const courseDoc = await getDoc(doc(db, 'courses', enrollmentData.courseId));
        if (courseDoc.exists()) {
          const courseData = { id: courseDoc.id, ...courseDoc.data() } as Course;
          enrollmentsData.push({ ...enrollmentData, course: courseData });
        }
      }
      
      setEnrollments(enrollmentsData);
      
      // Calculate stats
      const totalCourses = enrollmentsData.length;
      const completedCourses = enrollmentsData.filter(e => e.progress === 100).length;
      const activeCourses = enrollmentsData.filter(e => e.progress > 0 && e.progress < 100).length;
      const averageProgress = totalCourses > 0 
        ? enrollmentsData.reduce((sum, e) => sum + e.progress, 0) / totalCourses 
        : 0;
      
      setStats({
        totalCourses,
        completedCourses,
        activeCourses,
        averageProgress: Math.round(averageProgress)
      });
      
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setDataLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id && user?.role === 'student') {
      fetchStudentData();
    } else if (user?.role !== 'student') {
      router.push('/dashboard');
    }
  }, [user, router, fetchStudentData]);

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
              <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full opacity-10 animate-pulse"></div>
            </div>
            <motion.p 
              className="text-gray-800 font-medium"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Loading your dashboard...
            </motion.p>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user || user.role !== 'student') {
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
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-10 blur-3xl"
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
        {/* Welcome Section */}
        <motion.div className="mb-12" variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl font-extralight text-black mb-4 tracking-tight bg-gradient-to-br from-black via-gray-800 to-gray-600 bg-clip-text text-transparent">
            Student Dashboard
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Welcome back, <span className="font-semibold">{user.displayName}</span>! Continue your learning journey.
          </p>
        </motion.div>

        {/* Student Stats Cards */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={itemVariants}
        >
          <motion.div 
            className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl group cursor-pointer"
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {stats.totalCourses}
              </span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Enrolled Courses</p>
          </motion.div>

          <motion.div 
            className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl group cursor-pointer"
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {stats.completedCourses}
              </span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Completed</p>
          </motion.div>

          <motion.div 
            className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl group cursor-pointer"
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {stats.activeCourses}
              </span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Active Courses</p>
          </motion.div>

          <motion.div 
            className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl group cursor-pointer"
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {stats.averageProgress}%
              </span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Avg Progress</p>
          </motion.div>
        </motion.div>

        {/* Current Courses */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">My Courses</h2>
            <Link href="/courses">
              <Button 
                variant="outline" 
                className="bg-white/50 border-white/30 hover:bg-white/70 transition-all duration-300"
              >
                Browse More Courses
              </Button>
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-12 shadow-xl max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 opacity-20">
                  <BookOpen className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Start Your Learning Journey
                </h3>
                <p className="text-gray-700 mb-6">
                  You haven&apos;t enrolled in any courses yet. Explore our course catalog to get started.
                </p>
                <Link href="/courses">
                  <Button className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white">
                    Explore Courses
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {enrollments.map((enrollment) => (
                <motion.div
                  key={enrollment.id}
                  className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
                    {enrollment.course.thumbnail ? (
                      <Image
                        src={enrollment.course.thumbnail}
                        alt={enrollment.course.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-blue-400" />
                      </div>
                    )}
                    
                    {/* Progress Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-900">
                        {enrollment.progress}%
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {enrollment.course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      by {enrollment.course.instructorName}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{enrollment.progress}%</span>
                      </div>
                      <Progress 
                        value={enrollment.progress} 
                        className="h-2 bg-gray-200"
                      />
                    </div>

                    <Link href={`/courses/${enrollment.course.id}`}>
                      <Button 
                        className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white"
                        size="sm"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {enrollment.progress === 0 ? 'Start Course' : 'Continue Learning'}
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>

      <Footer />
    </motion.div>
  );
}
