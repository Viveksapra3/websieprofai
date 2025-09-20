import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { UI } from '../components/UI';
import { AuthNavbar } from '@/components/auth-navbar';
// import { Experience }  from '@/components/Experience';

const SyllabusPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      <AuthNavbar />
      <div className="flex min-h-screen">
      {/* Left Column - Syllabus */}
      <div className="w-1/3 bg-gray-100 p-6 overflow-y-auto text-black">
        <h2 className="text-2xl font-bold mb-4">Syllabus</h2>
        <ul className="space-y-3">
          <li className="p-3 bg-white rounded shadow">Chapter 1: Introduction</li>
          <li className="p-3 bg-white rounded shadow">Chapter 2: Basics</li>
          <li className="p-3 bg-white rounded shadow">Chapter 3: Advanced Topics</li>
          {/* Add your actual syllabus content dynamically */}
        </ul>
      </div>

      {/* Middle Column - Avatar (Canvas) */}
      <div className="w-1/3 relative">
        {/* <Canvas shadows camera={{ position: [0, 0, 0], fov: 30 }}>
          <Suspense>
            <Experience /> 
          </Suspense>
        </Canvas> */}
      </div>

      {/* Right Column - Chat */}
      <div className="w-1/3 bg-gray-50 p-6 flex flex-col text-black">
        <h2 className="text-xl font-bold mb-4">Chat</h2>
        <UI /> 
      </div>
      </div>
    </div>
  );
};

export default SyllabusPage;
