import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import pickle
import logging
from typing import Dict, Tuple

logger = logging.getLogger(__name__)


class MLTrafficClassifier:    
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self._initialize_model()
        
    def _initialize_model(self):
        self.model = RandomForestClassifier(
            n_estimators=50,
            max_depth=10,
            random_state=42
        )
        
        X_train = np.random.rand(100, 8)
        y_train = np.random.randint(0, 2, 100)
        
        self.scaler.fit(X_train)
        X_scaled = self.scaler.transform(X_train)
        self.model.fit(X_scaled, y_train)
        
        logger.info("ML classifier initialized")
    
    def predict(self, features: Dict) -> Tuple[float, str]:
        try:
            feature_vector = self._extract_feature_vector(features)
            
            X = self.scaler.transform([feature_vector])
            
            proba = self.model.predict_proba(X)[0]
            probability = float(proba[1])  # Probability of encrypted traffic
            
            if probability > 0.75:
                classification = "High Risk Encrypted Traffic"
            elif probability > 0.5:
                classification = "Moderate Risk"
            else:
                classification = "Normal Traffic"
                
            return probability, classification
            
        except Exception as e:
            logger.error(f"ML prediction error: {str(e)}")
            return 0.5, "Unknown"
    
    def _extract_feature_vector(self, features: Dict) -> np.ndarray:
        return np.array([
            features['mean_packet_size'],
            features['std_packet_size'],
            features['mean_iat'],
            features['std_iat'],
            features['packets_per_second'],
            features['bytes_per_second'],
            features['burst_count'],
            features['duration']
        ])
