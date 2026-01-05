import React from 'react';
import ProjectList from '../components/ProjectList';

export default function Projects() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Projects & Tasks</h1>
      <p className="text-gray-600 mt-2">Manage your projects and track your tasks.</p>
      <ProjectList />
    </div>
  );
}

