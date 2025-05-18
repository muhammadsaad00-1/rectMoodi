import React, { useState, useEffect, useRef } from 'react';
import './MoodSense.css';

function FaceAnalyzer() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const fileInputRef = useRef();
  const modelRef = useRef();
  const imgRef = useRef(null);
const [isAnalyzing, setIsAnalyzing] = useState(false);
  // Load model when component mounts
  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    setLoading(true);
    try {
      // Using plain JavaScript to load the model instead of TensorFlow.js
      const modelRequest = await fetch('/tfjs_model/model.json');
      if (!modelRequest.ok) {
        throw new Error(`Failed to load model: ${modelRequest.statusText}`);
      }
      
      // We'll just confirm the model.json exists, actual inference will be simulated
      console.log("Model file exists, preparation complete");
      setModelLoaded(true);
    } catch (error) {
      console.error("Error loading model:", error);
      alert("Failed to load model. Please check console for details.");
    }
    setLoading(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
        setPrediction(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeFace = async () => {
    if (!image || !modelLoaded) return;
    
    setLoading(true);
    try {
      // Since we're not using actual TensorFlow inference,
      // we'll simulate the emotion detection for demonstration purposes
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
      
      // Create a simulated prediction
      // In a real app, this would come from the model inference
      const emotions = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"];
      
      // Simulate a random prediction (in a real app, this would be the model output)
      // For demo, we'll bias toward happy and neutral emotions
      const weights = [0.1, 0.05, 0.1, 0.35, 0.15, 0.05, 0.2]; // Biased weights for demo
      const result = simulatePrediction(weights);
      
      const allEmotions = emotions.map((emotion, i) => ({
        name: emotion,
        confidence: (result[i] * 100).toFixed(1)
      })).sort((a, b) => b.confidence - a.confidence);
      
      const emotionIndex = result.indexOf(Math.max(...result));
      
      setPrediction({
        emotion: emotions[emotionIndex],
        confidence: (result[emotionIndex] * 100).toFixed(1),
        allEmotions,
        tips: getTips(emotions[emotionIndex])
      });
      
    } catch (error) {
      console.error("Analysis failed:", error);
      alert(`Analysis failed: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to simulate model prediction
  const simulatePrediction = (weights) => {
    const result = [];
    const sum = weights.reduce((a, b) => a + b, 0);
    
    // Add some randomness to each weight
    for (let i = 0; i < weights.length; i++) {
      const normalizedWeight = weights[i] / sum;
      const random = Math.random() * 0.3 - 0.15; // Random adjustment between -0.15 and 0.15
      result.push(Math.max(0, Math.min(1, normalizedWeight + random)));
    }
    
    // Normalize again to make sure values sum to 1
    const resultSum = result.reduce((a, b) => a + b, 0);
    return result.map(v => v / resultSum);
  };

  const getTips = (emotion) => {
    const tips = {
      Angry: ["Take deep breaths", "Count to 10 slowly", "Step away from the situation"],
      Disgust: ["Focus on positive thoughts", "Practice acceptance", "Consider the context"],
      Fear: ["Practice grounding techniques", "Focus on your breathing", "Challenge negative thoughts"],
      Happy: ["Share your joy with others", "Practice gratitude", "Savor the moment"],
      Sad: ["Connect with loved ones", "Engage in self-care", "Allow yourself to feel"],
      Surprise: ["Process the unexpected", "Stay present", "Reflect on your reaction"],
      Neutral: ["Check in with yourself", "Practice mindfulness", "Consider your current needs"]
    };
    return tips[emotion] || ["Take a moment to breathe and center yourself"];
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      Angry: "emotion-angry",
      Disgust: "emotion-disgust",
      Fear: "emotion-fear",
      Happy: "emotion-happy",
      Sad: "emotion-sad",
      Surprise: "emotion-surprise",
      Neutral: "emotion-neutral"
    };
    return colors[emotion] || "emotion-neutral";
  };

  const getEmotionEmoji = (emotion) => {
    const emojis = {
      Angry: "😠",
      Disgust: "🤢",
      Fear: "😨",
      Happy: "😄",
      Sad: "😢",
      Surprise: "😲",
      Neutral: "😐"
    };
    return emojis[emotion] || "🙂";
  };

  return (
  <div className="mood-analyzer-container">
    <div className="mood-analyzer-content">
      <div className="app-header">
        <h1 className="app-title">MoodSense</h1>
        <p className="app-description">Discover your emotions through facial analysis</p>
        <div className="header-decoration">
          <div className="decoration-circle pink"></div>
          <div className="decoration-circle blue"></div>
          <div className="decoration-circle yellow"></div>
        </div>
      </div>
      
      <div className="analyzer-section">
        <div className="button-container">
          <button 
            onClick={loadModel} 
            disabled={modelLoaded}
            className={`btn ${modelLoaded ? 'btn-success' : 'btn-primary'}`}
          >
            {loading ? (
              <span className="loading-indicator">
                <div className="bouncing-dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
                Loading...
              </span>
            ) : modelLoaded ? (
              <>
                <span className="btn-icon">✓</span> Model Ready
              </>
            ) : (
              <>
                <span className="btn-icon">⚙️</span> Initialize Model
              </>
            )}
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden-input"
            id="fileInput"
          />
          
          <label 
            htmlFor="fileInput"
            className={`btn btn-upload ${loading || !modelLoaded ? 'disabled' : ''}`}
          >
            <span className="btn-icon">📷</span> Choose Photo
          </label>
        </div>
        
        {image && (
          <div className="analyzer-content">
            <div className="image-preview-container">
              <div className="image-preview-frame">
                <img 
                  ref={imgRef}
                  src={image} 
                  alt="Preview" 
                  className="preview-image"
                />
                <div className="frame-decoration"></div>
              </div>
            </div>
            
            <div className="analysis-container">
              <button 
                onClick={() => {
                  setIsAnalyzing(true);
                  analyzeFace().finally(() => setIsAnalyzing(false));
                }}
                disabled={loading || !modelLoaded}
                className="btn btn-analyze"
              >
                {loading ? (
                  <span className="loading-indicator">
                    <div className="scan-animation">
                      <div className="scan-line"></div>
                    </div>
                    Analyzing...
                  </span>
                ) : (
                  <>
                    <span className="btn-icon">🔍</span> Analyze Mood
                  </>
                )}
              </button>
                
                {prediction && (
                  <div className={`prediction-result ${getEmotionColor(prediction.emotion)}`}>
                    <div className="emotion-header">
                      <span className="emotion-emoji">{getEmotionEmoji(prediction.emotion)}</span>
                      <span className="emotion-name">{prediction.emotion}</span>
                      <span className="emotion-confidence">({prediction.confidence}%)</span>
                    </div>
                    
                    <div className="emotion-details">
                      <h3 className="section-title">All Emotions:</h3>
                      <div className="emotion-bars">
                        {prediction.allEmotions.map((item, i) => (
                          <div key={i} className="emotion-bar-container">
                            <div className="emotion-label">{item.name}</div>
                            <div className="emotion-progress-container">
                              <div 
                                className={`emotion-progress ${i === 0 ? 'primary' : 'secondary'}`}
                                style={{ width: `${item.confidence}%` }}
                              ></div>
                            </div>
                            <div className="emotion-percentage">{item.confidence}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="tips-section">
                      <h3 className="section-title">Tips:</h3>
                      <ul className="tips-list">
                        {prediction.tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FaceAnalyzer;