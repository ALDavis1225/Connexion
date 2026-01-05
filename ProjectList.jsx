import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { apiClient } from '../lib/api';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projects = await apiClient.getProjects();
      setProjects(projects);
    } catch (err) {
      setError('Failed to fetch projects.');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      await apiClient.updateProject(projectId, { status: newStatus });
      fetchProjects(); // Refresh the list
    } catch (err) {
      setError('Failed to update project status.');
      console.error('Error updating project status:', err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${projectId}`);
        fetchProjects(); // Refresh the list
      } catch (err) {
        setError('Failed to delete project.');
        console.error('Error deleting project:', err);
      }
    }
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Projects</CardTitle>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Project</span>
        </Button>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <p>No projects found. Start by adding a new project!</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <div className="flex items-center gap-2">
                    {project.is_on_track ? (
                      <span className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4 mr-1" /> On Track
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" /> At Risk
                      </span>
                    )}
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteProject(project.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                  <span>Status: {project.status}</span>
                  <span>Due: {project.due_date ? new Date(project.due_date).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


