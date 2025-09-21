import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Brain, Upload, Play, BarChart3, Target, Zap } from "lucide-react";
import { toast } from "sonner";

interface PredictionResult {
  probability: number;
  prediction: string;
  confidence: number;
}

const MLDashboard = () => {
  const [embeddings, setEmbeddings] = useState<string>("");
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modelStats] = useState({
    accuracy: 0.89,
    precision: 0.92,
    recall: 0.87,
    f1Score: 0.89
  });

  const handlePredict = async () => {
    if (!embeddings.trim()) {
      toast.error("Please enter embedding values");
      return;
    }

    setIsLoading(true);
    
    try {
      // Parse embeddings input
      const embeddingArray = embeddings.split(',').map(val => parseFloat(val.trim()));
      
      if (embeddingArray.some(isNaN)) {
        throw new Error("Invalid embedding format. Please use comma-separated numbers.");
      }

      // Simulate model prediction (replace with actual API call to Supabase Edge Function)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock prediction result
      const mockProbability = 0.75 + Math.random() * 0.2;
      const mockPrediction = mockProbability > 0.5 ? "Positive" : "Negative";
      
      setPrediction({
        probability: mockProbability,
        prediction: mockPrediction,
        confidence: mockProbability
      });

      toast.success("Prediction completed successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Prediction failed");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = () => {
    // Sample embedding vector (384 dimensions typical for some models)
    const sampleEmbeddings = Array.from({ length: 10 }, () => 
      (Math.random() * 2 - 1).toFixed(4)
    ).join(', ');
    setEmbeddings(sampleEmbeddings);
    toast.success("Sample embedding data loaded");
  };

  return (
    <div className="min-h-screen bg-gradient-primary p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-white/10 backdrop-blur-glass">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">XGBoost Model Visualizer</h1>
          </div>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Interactive machine learning dashboard for your trained XGBoost classifier
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Model Info */}
          <Card className="bg-white/10 backdrop-blur-glass border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                Model Performance
              </CardTitle>
              <CardDescription className="text-white/70">
                Current model metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Accuracy</span>
                  <Badge variant="secondary" className="bg-ml-success text-white">
                    {(modelStats.accuracy * 100).toFixed(1)}%
                  </Badge>
                </div>
                <Progress value={modelStats.accuracy * 100} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Precision</span>
                  <Badge variant="secondary" className="bg-ml-info text-white">
                    {(modelStats.precision * 100).toFixed(1)}%
                  </Badge>
                </div>
                <Progress value={modelStats.precision * 100} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Recall</span>
                  <Badge variant="secondary" className="bg-ml-warning text-white">
                    {(modelStats.recall * 100).toFixed(1)}%
                  </Badge>
                </div>
                <Progress value={modelStats.recall * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Input Section */}
          <Card className="bg-white/10 backdrop-blur-glass border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Input Embeddings
              </CardTitle>
              <CardDescription className="text-white/70">
                Enter your embedding vector for prediction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="embeddings" className="text-white">
                  Embedding Vector (comma-separated)
                </Label>
                <textarea
                  id="embeddings"
                  value={embeddings}
                  onChange={(e) => setEmbeddings(e.target.value)}
                  placeholder="0.1234, -0.5678, 0.9012, ..."
                  className="w-full h-24 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 resize-none"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={loadSampleData}
                  variant="outline"
                  className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Load Sample
                </Button>
                <Button
                  onClick={handlePredict}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-prediction text-white border-0 hover:scale-105 transition-transform"
                >
                  {isLoading ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                      Predicting...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Predict
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-white/10 backdrop-blur-glass border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Prediction Results
              </CardTitle>
              <CardDescription className="text-white/70">
                Model output and confidence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {prediction ? (
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-white">
                      {prediction.prediction}
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`text-white ${
                        prediction.prediction === 'Positive' 
                          ? 'bg-ml-success' 
                          : 'bg-ml-error'
                      }`}
                    >
                      {(prediction.probability * 100).toFixed(1)}% probability
                    </Badge>
                  </div>
                  
                  <Separator className="bg-white/20" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-white/80">
                      <span>Confidence</span>
                      <span>{(prediction.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={prediction.confidence * 100} 
                      className="h-3"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-white/60">
                  <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Run a prediction to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Feature Importance Visualization Placeholder */}
        <Card className="bg-white/10 backdrop-blur-glass border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Model Insights
            </CardTitle>
            <CardDescription className="text-white/70">
              Feature importance and model interpretation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-white/60">
              <div className="space-y-4">
                <BarChart3 className="h-16 w-16 mx-auto opacity-50" />
                <h3 className="text-xl font-semibold text-white/80">
                  Advanced Visualizations Coming Soon
                </h3>
                <p className="max-w-md mx-auto">
                  Feature importance plots, SHAP values, and model interpretation tools
                  will be available when connected to a backend service.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MLDashboard;