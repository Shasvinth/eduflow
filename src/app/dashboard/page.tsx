"use client"

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Award, 
  Play, 
  CheckCircle,
  Star,
  Users,
  Zap,
  PlusCircle,
  BarChart3,
  DollarSign,
  Settings,
  UserCheck
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

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<(Enrollment & { course: Course })[]>([]);
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    hoursLearned: 0,
    certificates: 0,
    currentStreak: 0
  });
  const [instructorStats, setInstructorStats] = useState({
    publishedCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    avgRating: 0
  });
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    monthlyRevenue: 0
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUserData = async () => {
    try {
      setDataLoading(true);
      
      if (user?.role === 'student') {
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
            enrollmentsData.push({
              ...enrollmentData,
              course: courseData
            });
          }
        }
        
        setEnrollments(enrollmentsData);
        
        // Calculate student stats
        const enrolledCourses = enrollmentsData.length;
        const completedCourses = enrollmentsData.filter(e => e.progress >= 100).length;
        const totalMinutes = enrollmentsData.reduce((acc, e) => {
          return acc + (e.course.duration * (e.progress / 100));
        }, 0);
        const hoursLearned = Math.round(totalMinutes / 60);
        
        setStats({
          enrolledCourses,
          completedCourses,
          hoursLearned,
          certificates: completedCourses,
          currentStreak: Math.floor(Math.random() * 15) + 1
        });
        
      } else if (user?.role === 'instructor') {
        // Fetch instructor's courses
        const coursesQuery = query(
          collection(db, 'courses'),
          where('instructorId', '==', user?.id)
        );
        const coursesSnapshot = await getDocs(coursesQuery);
        const publishedCourses = coursesSnapshot.docs.filter(doc => doc.data().isPublished).length;
        
        // Calculate total students enrolled in instructor's courses
        let totalStudents = 0;
        for (const courseDoc of coursesSnapshot.docs) {
          const courseData = courseDoc.data() as Course;
          totalStudents += courseData.enrolledStudents || 0;
        }
        
        setInstructorStats({
          publishedCourses,
          totalStudents,
          totalRevenue: totalStudents * 50, // Simplified calculation
          avgRating: 4.7 // Placeholder
        });
        
      } else if (user?.role === 'admin') {
        // Fetch admin stats
        const [usersSnapshot, coursesSnapshot, enrollmentsSnapshot] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'courses')),
          getDocs(collection(db, 'enrollments'))
        ]);
        
        setAdminStats({
          totalUsers: usersSnapshot.size,
          totalCourses: coursesSnapshot.size,
          totalEnrollments: enrollmentsSnapshot.size,
          monthlyRevenue: enrollmentsSnapshot.size * 45 // Simplified calculation
        });
      }
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
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
                <motion.div
                  className="w-8 h-8 border-3 border-gray-800 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
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

  if (!user) {
    return null;
  }

  const renderStudentDashboard = () => (
    <>
      {/* Student Stats Cards */}
      <motion.div 
        className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-12"
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
              {stats.enrolledCourses}
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
              <Clock className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {stats.hoursLearned}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Hours Learned</p>
        </motion.div>

        <motion.div 
          className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl group cursor-pointer"
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-3 rounded-xl">
              <Award className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {stats.certificates}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Certificates</p>
        </motion.div>

        <motion.div 
          className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl group cursor-pointer"
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-xl">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {stats.currentStreak}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Day Streak</p>
        </motion.div>
      </motion.div>

      {/* Continue Learning Section */}
      <motion.div className="mb-12" variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Continue Learning</h2>
          <Link href="/courses">
            <Button className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white">
              Browse Courses
            </Button>
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <motion.div 
            className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-12 shadow-xl text-center"
            whileHover={{ scale: 1.02 }}
          >
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Yet</h3>
            <p className="text-gray-600 mb-6">Start your learning journey by enrolling in a course</p>
            <Link href="/courses">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                Explore Courses
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.slice(0, 6).map((enrollment, index) => (
              <motion.div
                key={enrollment.id}
                className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl overflow-hidden shadow-xl group"
                whileHover={{ y: -8, scale: 1.02 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
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
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-sm font-medium text-gray-900">
                      {Math.round(enrollment.progress)}%
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {enrollment.course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {enrollment.course.description}
                  </p>
                  <div className="mb-4">
                    <Progress value={enrollment.progress} className="h-2" />
                  </div>
                  <Link href={`/courses/${enrollment.course.id}`}>
                    <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                      <Play className="h-4 w-4 mr-2" />
                      Continue
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </>
  );

  const renderInstructorDashboard = () => (
    <>
      {/* Instructor Stats Cards */}
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
              {instructorStats.publishedCourses}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Published Courses</p>
        </motion.div>

        <motion.div 
          className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl group cursor-pointer"
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
              <Users className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {instructorStats.totalStudents}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Total Students</p>
        </motion.div>

        <motion.div 
          className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl group cursor-pointer"
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-3 rounded-xl">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              ${instructorStats.totalRevenue}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
        </motion.div>

        <motion.div 
          className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl group cursor-pointer"
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-xl">
              <Star className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {instructorStats.avgRating}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Avg Rating</p>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div className="mb-12" variants={itemVariants}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl text-center group cursor-pointer"
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlusCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Course</h3>
            <p className="text-gray-600 text-sm mb-4">Start creating a new course for your students</p>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              Get Started
            </Button>
          </motion.div>

          <motion.div 
            className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl text-center group cursor-pointer"
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">View Analytics</h3>
            <p className="text-gray-600 text-sm mb-4">Check your course performance and earnings</p>
            <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
              View Reports
            </Button>
          </motion.div>

          <motion.div 
            className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl text-center group cursor-pointer"
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Courses</h3>
            <p className="text-gray-600 text-sm mb-4">Edit and update your existing courses</p>
            <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
              Manage
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );

  const renderAdminDashboard = () => (
    <>
      {/* Admin Stats Cards */}
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
              <UserCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {adminStats.totalUsers}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Total Users</p>
        </motion.div>

        <motion.div 
          className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl group cursor-pointer"
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {adminStats.totalCourses}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Total Courses</p>
        </motion.div>

        <motion.div 
          className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl group cursor-pointer"
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-3 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {adminStats.totalEnrollments}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Total Enrollments</p>
        </motion.div>

        <motion.div 
          className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl group cursor-pointer"
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-xl">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              ${adminStats.monthlyRevenue}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Monthly Revenue</p>
        </motion.div>
      </motion.div>

      {/* Admin Actions */}
      <motion.div className="mb-12" variants={itemVariants}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">System Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl text-center group cursor-pointer"
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Users</h3>
            <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50">
              Manage
            </Button>
          </motion.div>

          <motion.div 
            className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl text-center group cursor-pointer"
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Courses</h3>
            <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50">
              Manage
            </Button>
          </motion.div>

          <motion.div 
            className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl text-center group cursor-pointer"
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
            <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50">
              View
            </Button>
          </motion.div>

          <motion.div 
            className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl text-center group cursor-pointer"
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings</h3>
            <Button size="sm" variant="outline" className="border-gray-300 hover:bg-gray-50">
              Configure
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );

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
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12"
        variants={containerVariants}
      >
        {/* Welcome Section */}
        <motion.div className="mb-12" variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl font-extralight text-black mb-4 tracking-tight bg-gradient-to-br from-black via-gray-800 to-gray-600 bg-clip-text text-transparent">
            Welcome back, <span className="font-normal">{user.displayName}</span>
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            {user.role === 'student' && 'Continue your learning journey and unlock new possibilities'}
            {user.role === 'instructor' && 'Manage your courses and inspire your students'}
            {user.role === 'admin' && 'Monitor the platform and manage all system operations'}
          </p>
        </motion.div>

        {/* Role-based Dashboard Content */}
        {user.role === 'student' && renderStudentDashboard()}
        {user.role === 'instructor' && renderInstructorDashboard()}
        {user.role === 'admin' && renderAdminDashboard()}
      </motion.div>

      <Footer />
    </motion.div>
  );
}
