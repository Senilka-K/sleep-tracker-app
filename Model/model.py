import sys
import json
from joblib import load
from datetime import datetime, timezone
import numpy as np

def load_model(model_path):
    try:
        return load(model_path)
    except Exception as e:
        print(json.dumps({'error': f'Failed to load model: {str(e)}'}))
        sys.exit(1)

def load_label_encoder(encoder_path):
    try:
        return load(encoder_path)
    except Exception as e:
        print(json.dumps({'error': f'Failed to load label encoder: {str(e)}'}))
        sys.exit(1)

def encode_gender(gender):
    """Encodes gender directly without using a label encoder."""
    gender_mapping = {'Male': 0, 'Female': 1}
    try:
        return gender_mapping[gender]
    except KeyError:
        print(json.dumps({'error': f'Invalid gender value: {gender}'}))
        sys.exit(1)

def split_and_convert_bp(data):
    """Splits the 'Blood Pressure' string into systolic and diastolic pressures and converts to integers."""
    systolic, diastolic = data['bloodPressure'].split('/')
    data['Systolic_BP'] = int(systolic)
    data['Diastolic_BP'] = int(diastolic)
    del data['bloodPressure']

def predict_sleep_quality(model, data):
    """Uses the model to predict sleep quality based on the provided data."""
    features = [data[field] for field in ['gender', 'age', 'sleepDuration', 'stressLevel', 'bmiCategory', 'heartRate', 'Systolic_BP', 'Diastolic_BP']]
    features = np.array(features).reshape(1, -1)  
    prediction = model.predict(features)[0]  
    return prediction.item() 

def process_data(model, data, encoded_gender):
    """Processes data by updating gender to encoded value and adding a success message."""
    try:
        data['gender'] = encoded_gender  
        if 'sleepDuration' in data:
            duration_datetime = datetime.fromisoformat(data['sleepDuration'].replace('Z', '+00:00'))
            epoch = datetime(1970, 1, 1, tzinfo=timezone.utc)
            total_seconds = (duration_datetime - epoch).total_seconds()
            total_hours = total_seconds / 3600 
            data['sleepDuration'] = f"{total_hours:.1f}"
        if 'bloodPressure' in data:
            split_and_convert_bp(data)

        sleep_quality = predict_sleep_quality(model, data)
        return {'sleepQuality': sleep_quality}
    
    except Exception as e:
        return {'error': f'Error processing data: {str(e)}'}

if __name__ == "__main__":
    model_path = '../model.pkl'
    encoder_path = '../label_encoder.pkl'

    try:
        model = load_model(model_path)
        label_encoder = load_label_encoder(encoder_path)

        if len(sys.argv) > 1:
            input_json = sys.argv[1]
            try:
                data = json.loads(input_json)
                if 'gender' in data:
                    encoded_gender = encode_gender(data['gender'])
                    result = process_data(model, data, encoded_gender)
                else:
                    result = {'error': 'Gender not provided'}
                
                output_json = json.dumps(result)
                print(output_json)
                
            except json.JSONDecodeError as e:
                print(json.dumps({'error': f'Error decoding JSON: {str(e)}'}))
        else:
            print(json.dumps({'error': 'No data provided'}))

    except Exception as e:
        print(json.dumps({'error': f'Unhandled exception: {str(e)}'}))
