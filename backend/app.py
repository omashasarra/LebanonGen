from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load the enhanced 5-feature model
model = joblib.load('model.pkl')

@app.route('/', methods=['GET'])
def home():
    return "Genetic Counseling ML Model API is running successfully!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Sequentially unpack all 5 individual feature flags
        features = [
            float(data.get('base_probability', 0.0)),
            int(data.get('husband_familyHistory', 0)),
            int(data.get('wife_familyHistory', 0)),
            int(data.get('husband_hasAffectedChild', 0)),
            int(data.get('wife_hasAffectedChild', 0))
        ]
        
        # Reshape to match scikit-learn standard structure 
        input_data = np.array([features])
        
        # Predict probability outcome bounded strictly between 0 and 1
        predicted_val = model.predict(input_data)[0]
        probability = float(np.clip(predicted_val, 0.0, 1.0))
        
        return jsonify({'probability': probability})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7860, debug=True)