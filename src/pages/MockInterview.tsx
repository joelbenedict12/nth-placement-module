import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Mic, MicOff, Send, Clock, Brain, ChevronRight, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { interviewAPI } from "@/services/api";
import { toast } from "sonner";

const MockInterview = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [interviewId, setInterviewId] = useState<string | null>(null);

  // Start mock interview
  const startInterviewMutation = useMutation({
    mutationFn: (data: { type: string; difficulty: string }) => 
      interviewAPI.startMockInterview(data),
    onSuccess: (data) => {
      setInterviewId(data.interviewId);
      setInterviewStarted(true);
      toast.success('Interview started! Good luck!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to start interview');
    },
  });

  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: (data: { interviewId: string; questionId: string; answer: string }) =>
      interviewAPI.submitAnswer(data.interviewId, data.questionId, data.answer),
    onSuccess: () => {
      toast.success('Answer submitted successfully!');
      setCurrentAnswer("");
      
      // Move to next question or complete interview
      const currentInterview = startInterviewMutation.data;
      if (currentInterview && currentQuestionIndex < currentInterview.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Interview completed
        setInterviewCompleted(true);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit answer');
    },
  });

  // Complete interview mutation
  const completeInterviewMutation = useMutation({
    mutationFn: (interviewId: string) => interviewAPI.completeInterview(interviewId),
    onSuccess: () => {
      toast.success('Interview completed! Check your results.');
      navigate('/student');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to complete interview');
    },
  });

  const handleStartInterview = (type: string, difficulty: string) => {
    startInterviewMutation.mutate({ type, difficulty });
  };

  const handleSubmitAnswer = () => {
    if (!interviewId || !currentAnswer.trim()) return;
    
    const currentQuestion = startInterviewMutation.data?.questions[currentQuestionIndex];
    if (currentQuestion) {
      submitAnswerMutation.mutate({
        interviewId,
        questionId: currentQuestion.id,
        answer: currentAnswer,
      });
    }
  };

  const handleCompleteInterview = () => {
    if (interviewId) {
      completeInterviewMutation.mutate(interviewId);
    }
  };

  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-4xl px-6 py-10 lg:px-10 lg:py-12">
          <div className="text-center mb-12">
            <Brain className="h-16 w-16 text-accent-cyan mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-slate-100 mb-4">AI Mock Interview</h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Practice with AI-generated questions tailored to your profile and target roles. 
              Get instant feedback and improve your interview skills.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-slate-800 bg-slate-900/60 hover:bg-slate-900/80 transition-colors">
              <CardHeader>
                <CardTitle className="text-slate-100">Technical Interview</CardTitle>
                <CardDescription className="text-slate-400">
                  Questions about programming, algorithms, and technical concepts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    onClick={() => handleStartInterview('technical', 'easy')}
                    disabled={startInterviewMutation.isPending}
                    variant="outline"
                    className="w-full border-slate-700 text-slate-200 hover:bg-slate-800"
                  >
                    Easy (15 min)
                  </Button>
                  <Button
                    onClick={() => handleStartInterview('technical', 'medium')}
                    disabled={startInterviewMutation.isPending}
                    className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple"
                  >
                    Medium (25 min)
                  </Button>
                  <Button
                    onClick={() => handleStartInterview('technical', 'hard')}
                    disabled={startInterviewMutation.isPending}
                    variant="destructive"
                    className="w-full"
                  >
                    Hard (45 min)
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/60 hover:bg-slate-900/80 transition-colors">
              <CardHeader>
                <CardTitle className="text-slate-100">Behavioral Interview</CardTitle>
                <CardDescription className="text-slate-400">
                  Questions about teamwork, leadership, and problem-solving
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    onClick={() => handleStartInterview('behavioral', 'easy')}
                    disabled={startInterviewMutation.isPending}
                    variant="outline"
                    className="w-full border-slate-700 text-slate-200 hover:bg-slate-800"
                  >
                    Entry Level (20 min)
                  </Button>
                  <Button
                    onClick={() => handleStartInterview('behavioral', 'medium')}
                    disabled={startInterviewMutation.isPending}
                    className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple"
                  >
                    Mid Level (30 min)
                  </Button>
                  <Button
                    onClick={() => handleStartInterview('behavioral', 'hard')}
                    disabled={startInterviewMutation.isPending}
                    variant="destructive"
                    className="w-full"
                  >
                    Senior Level (45 min)
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/60 hover:bg-slate-900/80 transition-colors">
              <CardHeader>
                <CardTitle className="text-slate-100">Mixed Interview</CardTitle>
                <CardDescription className="text-slate-400">
                  Combination of technical and behavioral questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    onClick={() => handleStartInterview('mixed', 'easy')}
                    disabled={startInterviewMutation.isPending}
                    variant="outline"
                    className="w-full border-slate-700 text-slate-200 hover:bg-slate-800"
                  >
                    Easy (20 min)
                  </Button>
                  <Button
                    onClick={() => handleStartInterview('mixed', 'medium')}
                    disabled={startInterviewMutation.isPending}
                    className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple"
                  >
                    Medium (35 min)
                  </Button>
                  <Button
                    onClick={() => handleStartInterview('mixed', 'hard')}
                    disabled={startInterviewMutation.isPending}
                    variant="destructive"
                    className="w-full"
                  >
                    Hard (60 min)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (interviewCompleted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <Card className="border-slate-800 bg-slate-900/60 max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-accent-green mx-auto mb-4" />
            <CardTitle className="text-2xl text-slate-100">Interview Completed!</CardTitle>
            <CardDescription className="text-slate-400">
              Great job! Your responses have been analyzed and feedback is ready.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleCompleteInterview}
              disabled={completeInterviewMutation.isPending}
              className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple"
            >
              View Results & Feedback
            </Button>
            <Button
              onClick={() => navigate('/student')}
              variant="outline"
              className="w-full border-slate-700 text-slate-200 hover:bg-slate-800"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = startInterviewMutation.data?.questions[currentQuestionIndex];
  const totalQuestions = startInterviewMutation.data?.questions.length || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-10 lg:px-10 lg:py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-slate-100">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </h2>
            <Badge className="bg-slate-800 text-slate-200">
              <Clock className="h-3 w-3 mr-1" />
              Mock Interview
            </Badge>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-accent-cyan to-accent-purple h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Question */}
        <Card className="border-slate-800 bg-slate-900/60 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-100">Current Question</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-slate-300 leading-relaxed">
              {currentQuestion?.question}
            </p>
          </CardContent>
        </Card>

        {/* Answer Input */}
        <Card className="border-slate-800 bg-slate-900/60 mb-6">
          <CardHeader>
            <CardTitle className="text-slate-100">Your Answer</CardTitle>
            <CardDescription className="text-slate-400">
              Provide a detailed response. You can use voice recording or type your answer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button
                onClick={() => setIsRecording(!isRecording)}
                variant={isRecording ? "destructive" : "outline"}
                className="border-slate-700 text-slate-200 hover:bg-slate-800"
              >
                {isRecording ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
              <Button
                onClick={() => setCurrentAnswer("")}
                variant="outline"
                className="border-slate-700 text-slate-200 hover:bg-slate-800"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
            
            <Textarea
              placeholder="Type your answer here..."
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              className="min-h-[200px] border-slate-700 bg-slate-950/70 text-slate-100 placeholder:text-slate-400 focus-visible:ring-accent-cyan"
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleSubmitAnswer}
            disabled={!currentAnswer.trim() || submitAnswerMutation.isPending}
            className="flex-1 bg-gradient-to-r from-accent-cyan to-accent-purple"
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Answer
          </Button>
          <Button
            onClick={() => navigate('/student')}
            variant="outline"
            className="border-slate-700 text-slate-200 hover:bg-slate-800"
          >
            End Interview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;