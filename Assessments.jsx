import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  Play, 
  Eye,
  TrendingUp
} from 'lucide-react';
import { apiClient } from '@/lib/api';

const Assessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = 1; // Demo user ID

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      const [allAssessments, userAssessments] = await Promise.all([
        apiClient.getAssessments(),
        apiClient.getUserAssessments(userId)
      ]);

      setAssessments(allAssessments);
      setUserResults(userAssessments);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load assessments:', error);
      setLoading(false);
    }
  };

  const isCompleted = (assessmentId) => {
    return userResults.some(result => result.assessment_id === assessmentId);
  };

  const getCompletionPercentage = () => {
    const completed = assessments.filter(assessment => isCompleted(assessment.id)).length;
    return Math.round((completed / assessments.length) * 100);
  };

  const startAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < selectedAssessment.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitAssessment = async () => {
    setIsSubmitting(true);
    try {
      const answersArray = selectedAssessment.questions.map(question => ({
        question_id: question.id,
        answer: answers[question.id] || 3 // Default to neutral if not answered
      }));

      await apiClient.submitAssessment(userId, selectedAssessment.id, answersArray);
      
      // Reload assessments to update completion status
      await loadAssessments();
      
      setSelectedAssessment(null);
      setCurrentQuestion(0);
      setAnswers({});
    } catch (error) {
      console.error('Failed to submit assessment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const viewResults = async (assessmentId) => {
    try {
      const result = await apiClient.getAssessmentResult(userId, assessmentId);
      // For now, just log the results. In a real app, you'd show them in a modal or separate page
      console.log('Assessment results:', result);
      alert(`Assessment completed! Check console for results.`);
    } catch (error) {
      console.error('Failed to load results:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading assessments...</div>
      </div>
    );
  }

  // Assessment taking interface
  if (selectedAssessment) {
    const currentQ = selectedAssessment.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedAssessment.questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{selectedAssessment.name}</CardTitle>
                <CardDescription>
                  Question {currentQuestion + 1} of {selectedAssessment.questions.length}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSelectedAssessment(null)}
              >
                Exit
              </Button>
            </div>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">{currentQ.text}</h3>
              
              {/* Rating scale */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Strongly Disagree</span>
                  <span>Strongly Agree</span>
                </div>
                <div className="flex justify-between">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label key={value} className="flex flex-col items-center cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${currentQ.id}`}
                        value={value}
                        checked={answers[currentQ.id] === value}
                        onChange={() => handleAnswer(currentQ.id, value)}
                        className="mb-2"
                      />
                      <span className="text-sm">{value}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              {currentQuestion === selectedAssessment.questions.length - 1 ? (
                <Button 
                  onClick={submitAssessment}
                  disabled={isSubmitting || !answers[currentQ.id]}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                </Button>
              ) : (
                <Button 
                  onClick={nextQuestion}
                  disabled={!answers[currentQ.id]}
                >
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main assessments list
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Personality Assessments</h1>
          <p className="text-gray-600 mt-1">
            Complete assessments to understand your communication style and improve team interactions.
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Progress</CardTitle>
          <CardDescription>
            {userResults.length} of {assessments.length} assessments completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Progress value={getCompletionPercentage()} className="flex-1" />
            <span className="text-sm font-medium">{getCompletionPercentage()}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((assessment) => {
          const completed = isCompleted(assessment.id);
          
          return (
            <Card key={assessment.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{assessment.name}</CardTitle>
                    <CardDescription className="mt-2">
                      {assessment.description}
                    </CardDescription>
                  </div>
                  {completed && (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {assessment.estimated_time} min
                    </div>
                    <div className="flex items-center">
                      <ClipboardList className="w-4 h-4 mr-1" />
                      {assessment.questions.length} questions
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {completed ? (
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => viewResults(assessment.id)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Results
                      </Button>
                    ) : (
                      <Button 
                        className="flex-1"
                        onClick={() => startAssessment(assessment)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Assessment
                      </Button>
                    )}
                  </div>

                  {completed && (
                    <Badge variant="secondary" className="w-full justify-center">
                      Completed
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Results Summary */}
      {userResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Assessment Results</CardTitle>
            <CardDescription>Summary of your completed assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userResults.map((result) => (
                <div key={result.id} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">{result.assessment_name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Completed {new Date(result.completed_at).toLocaleDateString()}
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto mt-2"
                    onClick={() => viewResults(result.assessment_id)}
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Assessments;

