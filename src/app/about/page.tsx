'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  GraduationCap, 
  Users, 
  Globe, 
  Award,
  BookOpen,
  TrendingUp,
  Heart,
  Target
} from 'lucide-react';

export default function AboutPage() {
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

  return (
    <>
      <Header />
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          variants={itemVariants}
        >
          <h1 className="text-4xl md:text-6xl font-light text-gray-800 mb-6">
            About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">EduFlow</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing education through technology, making quality learning accessible to everyone, everywhere.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div 
          className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8 md:p-12 mb-12"
          variants={itemVariants}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                At EduFlow, we believe that education is the most powerful tool for changing the world. 
                Our mission is to democratize access to quality education by breaking down geographical, 
                financial, and technological barriers.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We&apos;re building a platform where knowledge knows no boundaries, where students from 
                Sri Lanka to Silicon Valley can learn from the world&apos;s best instructors, and where 
                educators can reach global audiences with their expertise.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-white/50 rounded-2xl border border-gray-200">
                <GraduationCap size={32} className="mx-auto text-blue-500 mb-3" />
                <div className="text-2xl font-bold text-gray-800">10K+</div>
                <div className="text-gray-600 text-sm">Students Worldwide</div>
              </div>
              <div className="text-center p-6 bg-white/50 rounded-2xl border border-gray-200">
                <BookOpen size={32} className="mx-auto text-green-500 mb-3" />
                <div className="text-2xl font-bold text-gray-800">500+</div>
                <div className="text-gray-600 text-sm">Quality Courses</div>
              </div>
              <div className="text-center p-6 bg-white/50 rounded-2xl border border-gray-200">
                <Users size={32} className="mx-auto text-purple-500 mb-3" />
                <div className="text-2xl font-bold text-gray-800">100+</div>
                <div className="text-gray-600 text-sm">Expert Instructors</div>
              </div>
              <div className="text-center p-6 bg-white/50 rounded-2xl border border-gray-200">
                <Globe size={32} className="mx-auto text-orange-500 mb-3" />
                <div className="text-2xl font-bold text-gray-800">50+</div>
                <div className="text-gray-600 text-sm">Countries Served</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          variants={itemVariants}
        >
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Accessibility First</h3>
            <p className="text-gray-600 leading-relaxed">
              We design with accessibility in mind, ensuring our platform works for everyone, 
              regardless of their abilities or circumstances.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quality Excellence</h3>
            <p className="text-gray-600 leading-relaxed">
              Every course on our platform meets the highest standards of educational quality, 
              curated by experts and validated by real-world outcomes.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Community Driven</h3>
            <p className="text-gray-600 leading-relaxed">
              Learning is better together. We foster a supportive community where students 
              and instructors collaborate and grow together.
            </p>
          </div>
        </motion.div>

        {/* Story Section */}
        <motion.div 
          className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8 md:p-12 mb-12"
          variants={itemVariants}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Story</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-700 leading-relaxed mb-6">
              EduFlow was born from a simple observation: the best education shouldn&apos;t be limited 
              by geography or economic circumstances. As a student at Royal College Colombo, 
              I witnessed firsthand how talented individuals were held back not by their capability, 
              but by their access to quality educational resources.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              This realization sparked the vision for EduFlow - a platform that could bring 
              world-class education to anyone with an internet connection. We started with 
              the belief that technology could be the great equalizer in education, and today, 
              we&apos;re making that vision a reality.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Built with cutting-edge technology and designed with the learner at the center, 
              EduFlow represents the future of education - personalized, accessible, and globally connected.
            </p>
          </div>
        </motion.div>

        {/* Developer Section */}
        <motion.div 
          className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8 md:p-12"
          variants={itemVariants}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Meet the Developer</h2>
            <div className="max-w-3xl mx-auto">
              <div className="bg-white/50 rounded-2xl border border-gray-200 p-8">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">SS</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Shasvinth Srikanth</h3>
                <p className="text-blue-600 font-medium mb-4">Full-Stack Developer & Student</p>
                <p className="text-gray-600 mb-2">Royal College Colombo</p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Passionate about leveraging technology to solve real-world problems. With expertise 
                  in modern web technologies and a deep understanding of educational challenges, 
                  Shasvinth built EduFlow to bridge the gap between traditional education and 
                  the digital future.
                </p>
                <div className="flex justify-center space-x-4">
                  <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Next.js Expert
                  </div>
                  <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
                    Firebase Specialist
                  </div>
                  <div className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm">
                    UI/UX Enthusiast
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Vision Section */}
        <motion.div 
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 mt-12 text-center text-white"
          variants={itemVariants}
        >
          <TrendingUp size={48} className="mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-6">Our Vision for the Future</h2>
          <p className="text-xl leading-relaxed max-w-3xl mx-auto opacity-90">
            We envision a world where every person has access to personalized, high-quality education 
            that adapts to their learning style, schedule, and goals. Where artificial intelligence 
            enhances human teaching, and where global collaboration in learning becomes the norm.
          </p>
        </motion.div>
      </div>
      </motion.div>
      <Footer />
    </>
  );
}
