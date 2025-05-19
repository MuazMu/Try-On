import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">About Virtual Tryon</h1>
        
        <div className="prose prose-blue max-w-none">
          <p className="text-lg text-gray-500 mb-6">
            Virtual Tryon is a cutting-edge platform that uses AI and 3D technology to revolutionize
            the online shopping experience. Our mission is to make online clothing shopping as confident
            and accurate as in-store shopping, without the hassle.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Technology</h2>
          <p className="text-gray-500 mb-4">
            We use advanced AI algorithms to create an accurate 3D avatar from a single photo, 
            allowing you to virtually try on clothes from our extensive catalog. Our platform leverages:
          </p>
          <ul className="list-disc pl-6 text-gray-500 mb-6">
            <li className="mb-2">
              <strong>Rodin AI</strong> - State-of-the-art 3D modeling from 2D images
            </li>
            <li className="mb-2">
              <strong>React Three Fiber</strong> - For smooth, interactive 3D rendering in the browser
            </li>
            <li className="mb-2">
              <strong>Gemini 2.5 Pro</strong> - Powering our virtual style assistant to give you personalized recommendations
            </li>
            <li className="mb-2">
              <strong>Advanced size estimation</strong> - Using your avatar's measurements to recommend the best fit
            </li>
          </ul>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Privacy First</h2>
          <p className="text-gray-500 mb-6">
            We take your privacy seriously. Your photos are used only to generate your avatar and are 
            deleted from our servers immediately after processing. We don't store personal information, 
            and your avatar data is only kept for the duration of your session.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Partners</h2>
          <p className="text-gray-500 mb-6">
            We collaborate with a range of clothing retailers to offer you a diverse selection of items to try on.
            From casual wear to formal attire, local brands to international designers, we're constantly expanding
            our catalog to provide more options for our users.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How To Get Started</h2>
          <p className="text-gray-500 mb-4">
            Getting started with Virtual Tryon is simple:
          </p>
          <ol className="list-decimal pl-6 text-gray-500 mb-6">
            <li className="mb-2">Upload a full-body photo</li>
            <li className="mb-2">Wait a few seconds for your 3D avatar to generate</li>
            <li className="mb-2">Browse our catalog and try on different outfits</li>
            <li className="mb-2">Save your favorites and make confident purchases</li>
          </ol>
          
          <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Ready to transform your online shopping experience?</h3>
            <Link
              to="/try-on"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Try It Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 