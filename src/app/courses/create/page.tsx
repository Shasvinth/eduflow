"use client"

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Upload, 
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
  collection, 
  addDoc, 
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function CreateCourse() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: 'programming',
    level: 'beginner',
    thumbnail: '',
    whatYouWillLearn: [''],
    requirements: ['']
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    } else if (user?.role !== 'instructor') {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const categories = [
    { id: 'programming', name: 'Programming' },
    { id: 'design', name: 'Design' },
    { id: 'business', name: 'Business' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'data-science', name: 'Data Science' },
    { id: 'ai-ml', name: 'AI & ML' },
  ];

  const levels = [
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
  ];

  const addLearningPoint = () => {
    setCourseData(prev => ({
      ...prev,
      whatYouWillLearn: [...prev.whatYouWillLearn, '']
    }));
  };

  const removeLearningPoint = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      whatYouWillLearn: prev.whatYouWillLearn.filter((_, i) => i !== index)
    }));
  };

  const updateLearningPoint = (index: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      whatYouWillLearn: prev.whatYouWillLearn.map((item, i) => i === index ? value : item)
    }));
  };

  const addRequirement = () => {
    setCourseData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeRequirement = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      requirements: prev.requirements.map((item, i) => i === index ? value : item)
    }));
  };

  const handleSubmit = async (isDraft = false) => {
    try {
      setIsSubmitting(true);
      
      const course = {
        ...courseData,
        instructorId: user?.id,
        instructorName: user?.displayName || 'Unknown Instructor',
        isPublished: !isDraft,
        enrolledStudents: 0,
        rating: 0,
        reviews: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'courses'), course);
      
      router.push(`/dashboard/instructor`);
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <BookOpen className="h-8 w-8 animate-pulse text-gray-800" />
              </div>
            </div>
            <motion.p 
              className="text-gray-800 font-medium"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Loading course builder...
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
      </div>

      <motion.div 
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div className="mb-8" variants={itemVariants}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="bg-white/50 border-white/30 hover:bg-white/70"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-extralight text-black tracking-tight">
                  Create New Course
                </h1>
                <p className="text-gray-600 mt-1">
                  Share your knowledge and inspire students worldwide
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
                className="bg-white/50 border-white/30 hover:bg-white/70"
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
                variant="outline"
                className="bg-white/50 border-white/30 hover:bg-white/70"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Publish Course
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <motion.div 
              className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl"
              variants={itemVariants}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Basic Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <Input
                    value={courseData.title}
                    onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter your course title"
                    className="bg-white/50 border-white/30 focus:bg-white/70"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Description *
                  </label>
                  <textarea
                    value={courseData.description}
                    onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what your course is about..."
                    rows={4}
                    className="w-full p-3 bg-white/50 border border-white/30 rounded-lg focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={courseData.category}
                      onChange={(e) => setCourseData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-3 bg-white/50 border border-white/30 rounded-lg focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
                      Level *
                    </label>
                    <select
                      value={courseData.level}
                      onChange={(e) => setCourseData(prev => ({ ...prev, level: e.target.value }))}
                      className="w-full p-3 bg-white/50 border border-white/30 rounded-lg focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      {levels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {level.name}
                        </option>
                      ))}
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
                            setCourseData(prev => ({ ...prev, thumbnail: reader.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                    />
                    {courseData.thumbnail && (
                      <div className="relative w-32 h-20 rounded-lg overflow-hidden">
                        <Image
                          src={courseData.thumbnail}
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

            {/* What You'll Learn */}
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
                  onClick={addLearningPoint}
                  size="sm"
                  variant="outline"
                  className="bg-white/50 border-white/30 hover:bg-white/70"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Point
                </Button>
              </div>

              <div className="space-y-3">
                {courseData.whatYouWillLearn.map((point, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Input
                      value={point}
                      onChange={(e) => updateLearningPoint(index, e.target.value)}
                      placeholder="What will students learn?"
                      className="bg-white/50 border-white/30 focus:bg-white/70"
                    />
                    {courseData.whatYouWillLearn.length > 1 && (
                      <Button
                        onClick={() => removeLearningPoint(index)}
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
                  onClick={addRequirement}
                  size="sm"
                  variant="outline"
                  className="bg-white/50 border-white/30 hover:bg-white/70"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Requirement
                </Button>
              </div>

              <div className="space-y-3">
                {courseData.requirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Input
                      value={req}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      placeholder="What do students need to know?"
                      className="bg-white/50 border-white/30 focus:bg-white/70"
                    />
                    {courseData.requirements.length > 1 && (
                      <Button
                        onClick={() => removeRequirement(index)}
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Stats Preview */}
            <motion.div 
              className="bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Preview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Tag className="h-4 w-4 mr-2" />
                    Category
                  </div>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {courseData.category}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Level
                  </div>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {courseData.level}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    Students
                  </div>
                  <span className="text-sm font-medium text-gray-900">0</span>
                </div>
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div 
              className="bg-blue-50/60 backdrop-blur-md border border-blue-200/30 rounded-2xl p-6 shadow-xl"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Course Creation Tips</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Write a compelling course title that clearly describes the outcome</li>
                <li>• Use bullet points to list what students will learn</li>
                <li>• Keep your course description concise but informative</li>
                <li>• Choose an appropriate difficulty level for your target audience</li>
                <li>• Add a high-quality thumbnail image to attract students</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <Footer />
    </motion.div>
  );
}
