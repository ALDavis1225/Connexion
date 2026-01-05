import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Award, TrendingUp, User as UserIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { apiClient } from '../lib/api';

export default function AchievementScorecard({ userId = 1 }) {
  const [gamificationStats, setGamificationStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGamificationStats();
  }, [userId]);

  const fetchGamificationStats = async () => {
    try {
      setLoading(true);
      const achievements = await apiClient.getUserAchievements(userId);
      setGamificationStats(achievements);
    } catch (err) {
      setError('Failed to fetch gamification stats.');
      console.error('Error fetching gamification stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading Achievement Scorecard...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!gamificationStats) return <div>No gamification data available.</div>;

  const { total_points, current_level, next_level, progress_to_next_level, achievements } = gamificationStats;

  const getBadgeIcon = (badge_icon) => {
    switch (badge_icon) {
      case 'bronze_star': return <Star className="h-4 w-4 text-yellow-600" />;
      case 'silver_medal': return <Award className="h-4 w-4 text-gray-400" />;
      case 'gold_badge': return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'team_trophy': return <Users className="h-4 w-4 text-blue-500" />;
      case 'insight_gem': return <Lightbulb className="h-4 w-4 text-purple-500" />;
      case 'growth_leaf': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'streak_fire': return <Fire className="h-4 w-4 text-red-500" />;
      case 'streak_flame': return <Flame className="h-4 w-4 text-orange-500" />;
      case 'task_master_bronze': return <CheckCircle className="h-4 w-4 text-yellow-600" />;
      case 'task_master_silver': return <CheckCircle className="h-4 w-4 text-gray-400" />;
      case 'task_master_gold': return <CheckCircle className="h-4 w-4 text-yellow-500" />;
      case 'early_bird_badge': return <Clock className="h-4 w-4 text-blue-400" />;
      case 'deadline_shield': return <ShieldCheck className="h-4 w-4 text-green-600" />;
      default: return <Award className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Achievement Scorecard
        </CardTitle>
        <CardDescription>Track your progress and earn rewards!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Points</p>
            <p className="text-3xl font-bold">{total_points}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Level</p>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {current_level.name}
            </Badge>
          </div>
        </div>

        {next_level && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Next Level: {next_level.name}</span>
              <span>{total_points - current_level.threshold}/{next_level.threshold - current_level.threshold} points</span>
            </div>
            <Progress value={progress_to_next_level} className="w-full" />
          </div>
        )}

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Recent Achievements</h3>
          {achievements.length === 0 ? (
            <p className="text-sm text-gray-500">No achievements yet. Keep working!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {achievements.slice(0, 4).map((achievement) => (
                <Card key={achievement.id} className="p-3 flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {getBadgeIcon(achievement.badge_icon)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{achievement.title}</p>
                    <p className="text-xs text-gray-500">+{achievement.points} points</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


