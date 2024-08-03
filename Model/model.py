# import sys
# import numpy as np
# from joblib import load
# import requests   
# import json 

# def load_model(model_path):
#     return load(model_path)

# def load_label_encoder(encoder_path):
#     return load(encoder_path)

# def encode_gender(label_encoder, gender):
#     return label_encoder.transform([gender])[0]  # Returns the encoded gender

# def process_data(data, encoded_gender):
#     data['encoded_gender'] = encoded_gender  # Add encoded gender to the data
#     data['message'] = 'Processed successfully'
#     return data

# # Usage
# if __name__ == "__main__":
#     model_path = '/Users/senilkakarunarathna/Documents/Projects/Sleep Tracker/sleep-tracker-app/Model/model.pkl'  # Hardcoded model path
#     encoder_path = '/Users/senilkakarunarathna/Documents/Projects/Sleep Tracker/sleep-tracker-app/Model/label_encoder.pkl'  # Hardcoded encoder path

#     model = load_model(model_path)  # Load the model if needed
#     label_encoder = load_label_encoder(encoder_path)  # Load the encoder

#     if len(sys.argv) > 1:
#         input_json = sys.argv[1]  # The JSON string passed from Node.js
#         try:
#             data = json.loads(input_json)
#             if 'gender' in data:
#                 encoded_gender = encode_gender(label_encoder, data['gender'])
#                 processed_data = process_data(data, encoded_gender)
#             else:
#                 processed_data = {'error': 'Gender not provided'}
            
#             output_json = json.dumps(processed_data)
#             print(output_json)
            
#         except json.JSONDecodeError as e:
#             print(f"Error decoding JSON: {e}", file=sys.stderr)
#     else:
#         print("No data provided", file=sys.stderr)

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
    features = [data[field] for field in ['userId', 'gender', 'age', 'sleepDuration', 'stressLevel', 'bmiCategory', 'heartRate', 'Systolic_BP', 'Diastolic_BP']]
    features = np.array(features).reshape(1, -1)  # Reshape for single prediction
    return model.predict(features)[0]  # Assuming model.predict returns a list


def process_data(model, data, encoded_gender):
    """Processes data by updating gender to encoded value and adding a success message."""
    try:
        data['gender'] = encoded_gender  # Overwrite the original gender with its encoded value
        if 'sleepDuration' in data:
            # Parse the ISO 8601 date string as timezone-aware
            duration_datetime = datetime.fromisoformat(data['sleepDuration'].replace('Z', '+00:00'))
            # Define epoch as timezone-aware
            epoch = datetime(1970, 1, 1, tzinfo=timezone.utc)
            # Convert total duration to hours
            total_seconds = (duration_datetime - epoch).total_seconds()
            total_hours = total_seconds / 3600
            # Format to one decimal place
            data['sleepDuration'] = f"{total_hours:.1f}"
        if 'bloodPressure' in data:
            split_and_convert_bp(data)

        # Predict sleep quality
        sleep_quality = predict_sleep_quality(model, data)
        return {'sleepQuality': sleep_quality}
    
    except Exception as e:
        return {'error': f'Error processing data: {str(e)}'}

# Usage
if __name__ == "__main__":
    model_path = '/Users/senilkakarunarathna/Documents/Projects/Sleep Tracker/sleep-tracker-app/Model/model.pkl'
    encoder_path = '/Users/senilkakarunarathna/Documents/Projects/Sleep Tracker/sleep-tracker-app/Model/label_encoder.pkl'

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
