import React from 'react';
import Image from 'next/image';

const StudentSuccessSection = () => {
  return (
    <div className="p-8">
      {/* Heading with line break */}
      <h2 className="text-5xl font-normal leading-tight mb-8">
        Student Success
        <br />
        Starts with Us!
      </h2>

      {/* Image section with floating text bubbles */}
      <div className="relative w-full h-[500px] rounded-3xl overflow-hidden">
        <Image
          src="/studentsuccess.png"
          alt="Student accommodation"
          fill
          className="object-cover"
          sizes="100vw"
        />

        {/* Floating text bubbles */}
        <div className="absolute inset-0 flex flex-col justify-center gap-6">
          {/* Middle text bubble */}
          <div className="flex justify-center">
            <div className="bg-white rounded-full py-3 px-6 shadow-lg mx-4">
              <p className="text-blue-500 text-lg flex items-center gap-2">
                <span>•</span>
                Elevate Your College Living Experience!
                <span>•</span>
              </p>
            </div>
          </div>

          {/* Bottom text bubble */}
          <div className="flex justify-start ml-8">
            <div className="bg-white rounded-full py-3 px-6 shadow-lg">
              <p className="text-blue-500 text-lg flex items-center gap-2">
                <span>•</span>
                Empowering Students for Success!
                <span>•</span>
              </p>
            </div>
          </div>

          {/* Top right text bubble */}
          <div className="flex justify-end mr-8">
            <div className="bg-white rounded-full py-3 px-6 shadow-lg">
              <p className="text-blue-500 text-lg flex items-center gap-2">
                <span>•</span>
                Smart solutions for study success.
                <span>•</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSuccessSection;