"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  BookOpen,
  Users,
  Award,
  ArrowRight,
  Play,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-black">
      {/* Modern floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-gray-200/20 to-gray-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-gray-300/20 to-gray-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-7xl md:text-9xl font-extralight mb-6 tracking-tight bg-gradient-to-br from-black via-gray-800 to-gray-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              Learn.
              <br />
              <motion.span 
                className="font-thin text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Grow.
              </motion.span>
              <br />
              <motion.span 
                className="font-light bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                Succeed.
              </motion.span>
            </motion.h1>
          </motion.div>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            The modern learning platform designed for tomorrow&apos;s professionals.
            <br />
            <span className="text-gray-500">Simple, elegant, effective.</span>
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Link href="/auth/signup">
                <Button 
                  size="lg" 
                  className="bg-black text-white hover:bg-gray-800 px-10 py-6 text-lg font-medium rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                >
                  <span className="flex items-center gap-3">
                    Start Learning
                    <motion.div
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </span>
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-10 py-6 text-lg font-medium rounded-2xl backdrop-blur-sm bg-white/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <span className="flex items-center gap-3">
                  <motion.div
                    className="group-hover:scale-110 transition-transform duration-300"
                  >
                    <Play className="w-5 h-5" />
                  </motion.div>
                  Watch Demo
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Modern glassmorphism stats section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="backdrop-blur-xl bg-white/40 rounded-3xl border border-white/30 shadow-2xl p-16 hover:shadow-3xl transition-all duration-500"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{ y: -5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
              >
                <motion.div 
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Users className="w-10 h-10 text-gray-700" />
                </motion.div>
                <motion.h3 
                  className="text-5xl font-light mb-3 bg-gradient-to-br from-black to-gray-600 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  10K+
                </motion.h3>
                <p className="text-gray-600 font-medium">Active Students</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
              >
                <motion.div 
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ rotate: -5, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <BookOpen className="w-10 h-10 text-gray-700" />
                </motion.div>
                <motion.h3 
                  className="text-5xl font-light mb-3 bg-gradient-to-br from-black to-gray-600 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  500+
                </motion.h3>
                <p className="text-gray-600 font-medium">Courses Available</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
              >
                <motion.div 
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Award className="w-10 h-10 text-gray-700" />
                </motion.div>
                <motion.h3 
                  className="text-5xl font-light mb-3 bg-gradient-to-br from-black to-gray-600 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  98%
                </motion.h3>
                <p className="text-gray-600 font-medium">Success Rate</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modern Features Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl md:text-7xl font-extralight mb-8 bg-gradient-to-br from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
              Why Choose EduFlow
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Clean, focused learning without the noise.
              <br />
              <span className="text-gray-500">Built for the modern learner.</span>
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            <motion.div
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="backdrop-blur-xl bg-white/30 rounded-3xl border border-white/30 shadow-xl p-10 h-full hover:shadow-2xl transition-all duration-500 group-hover:bg-white/40">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-8 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle className="w-8 h-8 text-gray-700" />
                </motion.div>
                <h3 className="text-2xl font-medium mb-6 text-gray-900 group-hover:text-black transition-colors duration-300">
                  Expert Instructors
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg group-hover:text-gray-700 transition-colors duration-300">
                  Learn from industry professionals with years of real-world experience and proven track records.
                </p>
                <motion.div
                  className="mt-6 text-gray-400 group-hover:text-gray-600 transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="backdrop-blur-xl bg-white/30 rounded-3xl border border-white/30 shadow-xl p-10 h-full hover:shadow-2xl transition-all duration-500 group-hover:bg-white/40">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-8 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
                  whileHover={{ rotate: -10, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <BookOpen className="w-8 h-8 text-gray-700" />
                </motion.div>
                <h3 className="text-2xl font-medium mb-6 text-gray-900 group-hover:text-black transition-colors duration-300">
                  Structured Learning
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg group-hover:text-gray-700 transition-colors duration-300">
                  Carefully designed curriculum that builds knowledge step by step with clear learning objectives.
                </p>
                <motion.div
                  className="mt-6 text-gray-400 group-hover:text-gray-600 transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="backdrop-blur-xl bg-white/30 rounded-3xl border border-white/30 shadow-xl p-10 h-full hover:shadow-2xl transition-all duration-500 group-hover:bg-white/40">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-8 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Award className="w-8 h-8 text-gray-700" />
                </motion.div>
                <h3 className="text-2xl font-medium mb-6 text-gray-900 group-hover:text-black transition-colors duration-300">
                  Certification
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg group-hover:text-gray-700 transition-colors duration-300">
                  Earn recognized certificates to showcase your new skills and advance your career prospects.
                </p>
                <motion.div
                  className="mt-6 text-gray-400 group-hover:text-gray-600 transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div 
            className="backdrop-blur-xl bg-gradient-to-br from-gray-50/60 to-white/40 rounded-3xl border border-white/40 shadow-2xl p-20 hover:shadow-3xl transition-all duration-500 relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{ y: -5, scale: 1.01 }}
          >
            {/* Floating background elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-gray-200/30 to-gray-300/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-gray-300/20 to-gray-200/30 rounded-full blur-2xl"></div>
            
            <motion.h2 
              className="text-5xl md:text-6xl font-extralight mb-8 bg-gradient-to-br from-black via-gray-700 to-gray-600 bg-clip-text text-transparent relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Ready to Start Learning?
            </motion.h2>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto font-light leading-relaxed relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Join thousands of students who are advancing their careers with EduFlow.
              <br />
              <span className="text-gray-500">Start your journey today.</span>
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="relative z-10"
            >
              <Link href="/auth/signup">
                <Button 
                  size="lg" 
                  className="bg-black text-white hover:bg-gray-800 px-12 py-6 text-xl font-medium rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                >
                  <span className="flex items-center gap-4">
                    Get Started Today
                    <motion.div
                      className="group-hover:translate-x-2 transition-transform duration-300"
                    >
                      <ArrowRight className="w-6 h-6" />
                    </motion.div>
                  </span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
