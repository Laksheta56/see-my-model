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
  anomaly_flag: boolean;
  triggered_factors: string[];
}

interface AnomalyFactors {
  deviation_score: number;
  time_since_last_activity: number;
  signal_status: string;
  altitude_change: number;
  heart_rate: number;
  oxygen_saturation: number;
  body_temperature: number;
  fall_detected: boolean;
}

const MLDashboard = () => {
  const [factors, setFactors] = useState<AnomalyFactors>({
    deviation_score: 0,
    time_since_last_activity: 0,
    signal_status: "normal",
    altitude_change: 0,
    heart_rate: 70,
    oxygen_saturation: 98,
    body_temperature: 36.5,
    fall_detected: false
  });
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modelStats] = useState({
    accuracy: 0.89,
    precision: 0.92,
    recall: 0.87,
    f1Score: 0.89
  });

  const handlePredict = async () => {
    setIsLoading(true);
    
    try {
      // Check anomaly criteria
      const triggeredFactors: string[] = [];
      
      if (factors.deviation_score > 200) triggeredFactors.push("Route deviation");
      if (factors.time_since_last_activity > 30) triggeredFactors.push("Prolonged inactivity");
      if (factors.signal_status === "silent" && factors.time_since_last_activity > 20) triggeredFactors.push("Silent behavior");
      if (factors.signal_status === "missing") triggeredFactors.push("Missing signal");
      if (factors.signal_status === "distress") triggeredFactors.push("Distress signal");
      if (factors.altitude_change < -15) triggeredFactors.push("Sudden altitude drop");
      if (factors.heart_rate < 45 || factors.heart_rate > 150) triggeredFactors.push("Heart rate anomaly");
      if (factors.oxygen_saturation < 90) triggeredFactors.push("Oxygen anomaly");
      if (factors.body_temperature > 38.5) triggeredFactors.push("Temperature anomaly");
      if (factors.fall_detected) triggeredFactors.push("Fall detected");

      // Simulate model prediction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const anomaly_flag = triggeredFactors.length > 0;
      const mockProbability = anomaly_flag ? 0.85 + Math.random() * 0.15 : 0.15 + Math.random() * 0.3;
      
      setPrediction({
        probability: mockProbability,
        prediction: anomaly_flag ? "Anomaly Detected" : "Normal Behavior",
        confidence: mockProbability,
        anomaly_flag,
        triggered_factors: triggeredFactors
      });

      toast.success("Prediction completed successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Prediction failed");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = () => {
    setFactors({
      deviation_score: 250,
      time_since_last_activity: 35,
      signal_status: "silent",
      altitude_change: -20,
      heart_rate: 160,
      oxygen_saturation: 85,
      body_temperature: 39.2,
      fall_detected: true
    });
    toast.success("Sample anomaly data loaded");
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
                Anomaly Detection Factors
              </CardTitle>
              <CardDescription className="text-white/70">
                Enter the monitoring data for anomaly detection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deviation" className="text-white">Route Deviation Score</Label>
                  <Input
                    id="deviation"
                    type="number"
                    value={factors.deviation_score}
                    onChange={(e) => setFactors({...factors, deviation_score: Number(e.target.value)})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inactivity" className="text-white">Inactivity (min)</Label>
                  <Input
                    id="inactivity"
                    type="number"
                    value={factors.time_since_last_activity}
                    onChange={(e) => setFactors({...factors, time_since_last_activity: Number(e.target.value)})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heart_rate" className="text-white">Heart Rate (bpm)</Label>
                  <Input
                    id="heart_rate"
                    type="number"
                    value={factors.heart_rate}
                    onChange={(e) => setFactors({...factors, heart_rate: Number(e.target.value)})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="oxygen" className="text-white">Oxygen Saturation (%)</Label>
                  <Input
                    id="oxygen"
                    type="number"
                    value={factors.oxygen_saturation}
                    onChange={(e) => setFactors({...factors, oxygen_saturation: Number(e.target.value)})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temp" className="text-white">Body Temperature (°C)</Label>
                  <Input
                    id="temp"
                    type="number"
                    step="0.1"
                    value={factors.body_temperature}
                    onChange={(e) => setFactors({...factors, body_temperature: Number(e.target.value)})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="altitude" className="text-white">Altitude Change (m)</Label>
                  <Input
                    id="altitude"
                    type="number"
                    value={factors.altitude_change}
                    onChange={(e) => setFactors({...factors, altitude_change: Number(e.target.value)})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={loadSampleData}
                  variant="outline"
                  className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Load Anomaly Sample
                </Button>
                <Button
                  onClick={handlePredict}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-prediction text-white border-0 hover:scale-105 transition-transform"
                >
                  {isLoading ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Detect Anomaly
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
                        prediction.anomaly_flag 
                          ? 'bg-ml-error' 
                          : 'bg-ml-success'
                      }`}
                    >
                      {(prediction.probability * 100).toFixed(1)}% confidence
                    </Badge>
                  </div>
                  
                  {prediction.triggered_factors.length > 0 && (
                    <>
                      <Separator className="bg-white/20" />
                      <div className="space-y-2">
                        <h4 className="text-white font-semibold">Triggered Factors:</h4>
                        <div className="flex flex-wrap gap-2">
                          {prediction.triggered_factors.map((factor, index) => (
                            <Badge key={index} variant="destructive" className="bg-ml-warning text-white">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  
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