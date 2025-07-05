"use client"

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  Star,
  PlusCircle,
  BarChart3,
  Settings,
  Edit,
  Eye
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Course } from '@/types';

export default function InstructorDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState({
    publishedCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    avgRating: 0
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  const fetchInstructorData = useCallback(async () => {
    try {
      setDataLoading(true);
      
      // Fetch instructor's courses
      const coursesQuery = query(
        collection(db, 'courses'),
        where('instructorId', '==', user?.id),
        orderBy('createdAt', 'desc')
      );
      
      const coursesSnapshot = await getDocs(coursesQuery);
      const coursesData = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[];
      
      setCourses(coursesData);
      
      // Calculate stats
      const publishedCourses = coursesData.filter(c => c.isPublished).length;
      const totalStudents = coursesData.reduce((sum, course) => sum + (course.enrolledStudents || 0), 0);
      const totalRevenue = coursesData.reduce((sum, course) => 
        sum + ((course.enrolledStudents || 0) * (course.price || 0)), 0
      );
      const avgRating = coursesData.length > 0 
        ? coursesData.reduce((sum, course) => sum + (course.rating || 0), 0) / coursesData.length 
        : 0;
      
      setStats({
        publishedCourses,
        totalStudents,
        totalRevenue,
        avgRating: Number(avgRating.toFixed(1))
      });
      
    } catch (error) {
      console.error('Error fetching instructor data:', error);
    } finally {
      setDataLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id && user?.role === 'instructor') {
      fetchInstructorData();
    } else if (user?.role !== 'instructor') {
      router.push('/dashboard');
    }
  }, [user, router, fetchInstructorData]);

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

  if (!user || user.role !== 'instructor') {
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
        {/* Welcome Section */}
        <motion.div className="mb-12" variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl font-extralight text-black mb-4 tracking-tight bg-gradient-to-br from-black via-gray-800 to-gray-600 bg-clip-text text-transparent">
            Instructor Dashboard
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Welcome back, <span className="font-semibold">{user.displayName}</span>! Manage your courses and inspire your students.
          </p>
        </motion.div>

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
                {stats.publishedCourses}
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
                {stats.totalStudents}
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
                Rs.{stats.totalRevenue.toLocaleString()}
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
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                <Star className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {stats.avgRating}
              </span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Average Rating</p>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="mb-12"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl w-fit mb-4">
                <PlusCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Course</h3>
              <p className="text-gray-600 text-sm mb-4">Start building your next course and share your knowledge with students worldwide.</p>
              <Button className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white">
                Create Course
              </Button>
            </motion.div>

            <motion.div
              className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl w-fit mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">View Analytics</h3>
              <p className="text-gray-600 text-sm mb-4">Track your course performance, student engagement, and revenue insights.</p>
              <Button variant="outline" className="w-full bg-white/50 border-white/30 hover:bg-white/70">
                View Analytics
              </Button>
            </motion.div>

            <motion.div
              className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl w-fit mb-4">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Profile</h3>
              <p className="text-gray-600 text-sm mb-4">Update your instructor profile, bio, and teaching credentials.</p>
              <Button variant="outline" className="w-full bg-white/50 border-white/30 hover:bg-white/70">
                Edit Profile
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* My Courses */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">My Courses</h2>
            <Button className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Course
            </Button>
          </div>

          {courses.length === 0 ? (
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
                  Create Your First Course
                </h3>
                <p className="text-gray-700 mb-6">
                  Share your expertise with the world. Create engaging courses and start teaching today.
                </p>
                <Button className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <motion.div
                  key={course.id}
                  className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
                    {course.thumbnail ? (
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-blue-400" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        course.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all duration-300"
                      >
                        <Edit className="h-4 w-4 text-gray-600" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all duration-300"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    
                    {/* Course Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {course.enrolledStudents || 0} students
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-400" />
                        {course.rating || 0}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Rs.{course.price?.toLocaleString() || 0}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-white/50 border-white/30 hover:bg-white/70"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
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
