import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Award,
  MessageSquare,
  Target,
  ClipboardList
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { apiClient } from '../lib/api';
import ProjectList from '../components/ProjectList';
import AchievementScorecard from '../components/AchievementScorecard';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    user: null,
    recentActivities: [],
    upcomingTasks: [],
    achievements: [],
    personalityData: null,
    communicationSuggestions: [],
    loading: true
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // For demo purposes, using user ID 1
      const userId = 1;
      
      const [
        user,
        tasks,
        gamificationStats,
        assessments
      ] = await Promise.all([
        apiClient.getUser(userId),
        apiClient.getTasks({ user_id: userId }),
        apiClient.getUserAchievements(userId),
        apiClient.getUserAssessments(userId)
      ]);

      setDashboardData({
        user: user,
        recentActivities: [
          { id: 1, text: 'Completed DISC assessment', time: '2 hours ago', type: 'assessment' },
          { id: 2, text: 'Received feedback from Jane Smith', time: '1 day ago', type: 'feedback' },
          { id: 3, text: 'Completed Website Redesign task', time: '2 days ago', type: 'task' },
          { id: 4, text: 'Started new project: Marketing Campaign', time: '3 days ago', type: 'project' }
        ],
        upcomingTasks: tasks.filter(task => task.status !== 'completed').slice(0, 5),
        achievements: gamificationStats.achievements || [],
        personalityData: assessments.length > 0 ? generatePersonalityChart(assessments) : null,
        communicationSuggestions: [
          'Consider a quick call with Mike Johnson - he prefers direct verbal communication',
          'Send detailed email to Sarah Wilson - she appreciates comprehensive information',
          'Schedule face-to-face meeting with David Brown for project discussion'
        ],
        loading: false
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  const generatePersonalityChart = (assessments) => {
    // Mock personality data for visualization based on actual assessments
    // This would be more sophisticated in a real app, parsing actual assessment results
    return [
      { name: 'Dominance', value: 85, color: '#3B82F6' },
      { name: 'Influence', value: 70, color: '#10B981' },
      { name: 'Steadiness', value: 45, color: '#F59E0B' },
      { name: 'Conscientiousness', value: 60, color: '#8B5CF6' }
    ];
  };

  const achievementData = [
    { month: 'Jan', points: 120 },
    { month: 'Feb', points: 180 },
    { month: 'Mar', points: 240 },
    { month: 'Apr', points: 320 },
    { month: 'May', points: 450 }
  ];

  if (dashboardData.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {dashboardData.user?.first_name || 'User'}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your communication and projects today.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button>
            <MessageSquare className="w-4 h-4 mr-2" />
            Quick Message
          </Button>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.user?.total_points || 0}</div>
            <p className="text-xs text-muted-foreground">
              +20 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.upcomingTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              2 due this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assessments</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3/5</div>
            <p className="text-xs text-muted-foreground">
              Completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Level</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.user?.level || 'Beginner'}</div>
            <p className="text-xs text-muted-foreground">
              Keep it up!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {activity.type === 'assessment' && <ClipboardList className="w-4 h-4 text-blue-500" />}
                    {activity.type === 'feedback' && <MessageSquare className="w-4 h-4 text-green-500" />}
                    {activity.type === 'task' && <CheckCircle className="w-4 h-4 text-purple-500" />}
                    {activity.type === 'project' && <Target className="w-4 h-4 text-orange-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.text}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Personality Assessment Summary */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Personality Assessment</CardTitle>
            <CardDescription>Your DISC profile overview</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.personalityData ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={dashboardData.personalityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {dashboardData.personalityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2">
                  {dashboardData.personalityData.map((item) => (
                    <div key={item.name} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Complete assessments to see your profile</p>
                <Button className="mt-4" size="sm">Take Assessment</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Achievement Scorecard */}
        <AchievementScorecard userId={dashboardData.user?.id || 1} />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Your next priorities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.project_name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                      {task.priority}
                    </Badge>
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Communication Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle>Communication Suggestions</CardTitle>
            <CardDescription>Personalized tips for better interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.communicationSuggestions.map((suggestion, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm text-blue-800">{suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project List */}
      <ProjectList />
    </div>
  );
};

export default Dashboard;


