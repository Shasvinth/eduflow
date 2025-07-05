import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200/50 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-light text-black tracking-wide">EduFlow</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Modern learning platform designed for tomorrow&apos;s professionals.
            </p>
          </div>

          {/* Learn */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-black">Learn</h3>
            <div className="space-y-3">
              <Link href="/courses" className="block text-sm text-gray-600 hover:text-black transition-colors">
                Browse Courses
              </Link>
              <Link href="/dashboard" className="block text-sm text-gray-600 hover:text-black transition-colors">
                Dashboard
              </Link>
              <Link href="/auth/signup" className="block text-sm text-gray-600 hover:text-black transition-colors">
                Get Started
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-black">Company</h3>
            <div className="space-y-3">
              <Link href="/about" className="block text-sm text-gray-600 hover:text-black transition-colors">
                About
              </Link>
              <Link href="/contact" className="block text-sm text-gray-600 hover:text-black transition-colors">
                Contact
              </Link>
              <Link href="/careers" className="block text-sm text-gray-600 hover:text-black transition-colors">
                Careers
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-black">Support</h3>
            <div className="space-y-3">
              <Link href="/help" className="block text-sm text-gray-600 hover:text-black transition-colors">
                Help Center
              </Link>
              <Link href="/privacy" className="block text-sm text-gray-600 hover:text-black transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="block text-sm text-gray-600 hover:text-black transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200/50">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              © 2025 EduFlow. All rights reserved.
              <br />
              <span className="text-gray-500">Developed by Shasvinth Srikanth</span>
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-black transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-black transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
