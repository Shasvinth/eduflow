"use client"

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  Play,
  BookOpen,
  Heart,
  Share2,
  User,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Course } from '@/types';

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch courses from Firebase
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const coursesQuery = query(
          collection(db, 'courses'),
          orderBy('createdAt', 'desc')
        );
        const coursesSnapshot = await getDocs(coursesQuery);
        const coursesData = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Course[];
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
        // If no courses in Firebase, add some sample data
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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
        duration: 0.6
      }
    }
  };

  const cardHoverVariants = {
    rest: { 
      scale: 1,
      y: 0
    },
    hover: { 
      scale: 1.02,
      y: -8,
      transition: { 
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  };

  // Categories and levels for filtering
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'programming', name: 'Programming' },
    { id: 'design', name: 'Design' },
    { id: 'business', name: 'Business' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'data-science', name: 'Data Science' },
    { id: 'ai-ml', name: 'AI & ML' },
  ];

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
  ];

  // Filter courses based on search and selections
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  if (loading) {
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
                <Loader2 className="h-8 w-8 animate-spin text-gray-800" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full opacity-10 animate-pulse"></div>
            </div>
            <motion.p 
              className="text-gray-800 font-medium"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Loading courses...
            </motion.p>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
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

      {/* Hero Section */}
      <motion.div 
        className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-extralight text-black mb-6 tracking-tight bg-gradient-to-br from-black via-gray-800 to-gray-600 bg-clip-text text-transparent">
              Explore Our Courses
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Discover world-class courses designed to help you master new skills and advance your career
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-6 shadow-xl">
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search courses, instructors, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 w-full bg-white/50 border-white/30 rounded-xl focus:bg-white/70 transition-all duration-300"
                />
              </div>

              {/* Filter Toggle */}
              <div className="flex justify-center mb-4">
                <motion.button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/50 rounded-lg border border-white/30 hover:bg-white/70 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  <motion.div
                    animate={{ rotate: showFilters ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </motion.button>
              </div>

              {/* Filters */}
              <motion.div
                initial={false}
                animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-3 bg-white/50 border border-white/30 rounded-lg focus:bg-white/70 transition-all duration-300"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Level Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="w-full p-3 bg-white/50 border border-white/30 rounded-lg focus:bg-white/70 transition-all duration-300"
                    >
                      {levels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {level.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Courses Section */}
      <motion.div 
        className="px-4 sm:px-6 lg:px-8 pb-20"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto">
          {/* Results Info */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-gray-800">
              {filteredCourses.length === 0 && courses.length > 0
                ? "No courses found matching your criteria"
                : filteredCourses.length === 0
                ? "No courses available yet"
                : `${filteredCourses.length} course${filteredCourses.length !== 1 ? 's' : ''} found`
              }
            </p>
          </motion.div>

          {/* Empty State */}
          {filteredCourses.length === 0 ? (
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
                  {courses.length === 0 ? 'No Courses Available' : 'No Results Found'}
                </h3>
                <p className="text-gray-700 mb-6">
                  {courses.length === 0 
                    ? 'Courses will appear here once instructors start creating content.'
                    : 'Try adjusting your search terms or filters to find what you\'re looking for.'
                  }
                </p>
                {filteredCourses.length === 0 && courses.length > 0 && (
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedLevel('all');
                    }}
                    className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            /* Courses Grid */
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
            >
              {filteredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  variants={itemVariants}
                  initial="rest"
                  whileHover="hover"
                  className="group"
                >
                  <motion.div
                    variants={cardHoverVariants}
                    className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl overflow-hidden h-full transition-all duration-300 group-hover:shadow-2xl"
                  >
                    {/* Course Thumbnail */}
                    <div className="relative overflow-hidden h-48 bg-gradient-to-br from-blue-100 to-purple-100">
                      {course.thumbnail ? (
                        <Image
                          src={course.thumbnail}
                          alt={course.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="h-16 w-16 text-blue-400" />
                        </div>
                      )}
                      
                      {/* Overlay Actions */}
                      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <motion.button
                          whileHover={{ 
                            scale: 1.15,
                            backgroundColor: "white",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
                          }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2.5 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all duration-300 group/heart"
                        >
                          <Heart className="h-4 w-4 text-gray-600 group-hover/heart:text-red-500 transition-colors duration-300" />
                        </motion.button>
                        <motion.button
                          whileHover={{ 
                            scale: 1.15,
                            backgroundColor: "white",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
                          }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2.5 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all duration-300 group/share"
                        >
                          <Share2 className="h-4 w-4 text-gray-600 group-hover/share:text-blue-500 transition-colors duration-300" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <motion.span 
                          className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded-md"
                          whileHover={{ scale: 1.05 }}
                        >
                          {categories.find(c => c.id === course.category)?.name || course.category}
                        </motion.span>
                        <div className="flex items-center text-sm text-gray-700">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="font-medium">{course.rating || 4.5}</span>
                        </div>
                      </div>

                      <motion.h3 
                        className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-800 transition-colors duration-300"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {course.title}
                      </motion.h3>

                      <p className="text-sm text-gray-700 mb-4 line-clamp-2 leading-relaxed">
                        {course.description || 'A comprehensive course to master this subject.'}
                      </p>

                      <motion.div 
                        className="flex items-center mb-4"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-900 font-medium">{course.instructorName}</span>
                      </motion.div>

                      <div className="flex items-center justify-between text-sm text-gray-700 mb-6">
                        <motion.div 
                          className="flex items-center"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Users className="h-4 w-4 mr-1 text-gray-600" />
                          {course.enrolledStudents ? course.enrolledStudents.toLocaleString() : '0'} students
                        </motion.div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Link href={`/courses/${course.id}`}>
                          <motion.div
                            whileHover={{ 
                              scale: 1.05,
                              boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button 
                              size="sm" 
                              className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 group text-white"
                            >
                              <motion.div
                                whileHover={{ x: 2 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center"
                              >
                                <Play className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                                Enroll Now
                              </motion.div>
                            </Button>
                          </motion.div>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      <Footer />
    </motion.div>
  );
}
