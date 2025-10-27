"""
Firebase service layer for Progress
"""
from config.firestore import get_firestore_client
from datetime import datetime
import uuid

def create_workout_progress(name, weight, reps, sets):
    """
    Create a new workout progress entry in Firestore
    """
    db = get_firestore_client()
    workout_id = str(uuid.uuid4())
    
    workout_data = {
        'id': workout_id,
        'name': name,
        'weight': float(weight),
        'reps': int(reps),
        'sets': int(sets),
        'created_at': datetime.now()
    }
    
    db.collection('workout_progress').document(workout_id).set(workout_data)
    return workout_data

def get_all_workout_progress():
    """
    Get all workout progress entries, sorted by intensity (weight * reps * sets)
    """
    db = get_firestore_client()
    workouts_query = db.collection('workout_progress').order_by('created_at', direction='DESCENDING')
    workouts = workouts_query.stream()
    
    workouts_list = []
    for workout in workouts:
        workout_data = workout.to_dict()
        workout_data['created_at'] = workout_data['created_at'].isoformat() if workout_data.get('created_at') else None
        
        # Calculate intensity
        try:
            intensity = int(float(workout_data['weight']) * int(workout_data['reps']) * int(workout_data['sets']))
        except Exception:
            intensity = 0
        
        workout_data['intensity'] = intensity
        workouts_list.append(workout_data)
    
    # Sort by intensity descending
    workouts_list.sort(key=lambda x: x['intensity'], reverse=True)
    
    return workouts_list

def get_workout_progress(workout_id):
    """
    Get a specific workout progress entry by ID
    """
    db = get_firestore_client()
    workout_ref = db.collection('workout_progress').document(workout_id)
    workout = workout_ref.get()
    
    if not workout.exists:
        return None
    
    workout_data = workout.to_dict()
    workout_data['created_at'] = workout_data['created_at'].isoformat() if workout_data.get('created_at') else None
    
    return workout_data

def update_workout_progress(workout_id, name=None, weight=None, reps=None, sets=None):
    """
    Update a workout progress entry
    """
    db = get_firestore_client()
    workout_ref = db.collection('workout_progress').document(workout_id)
    
    updates = {}
    if name is not None:
        updates['name'] = name
    if weight is not None:
        updates['weight'] = float(weight)
    if reps is not None:
        updates['reps'] = int(reps)
    if sets is not None:
        updates['sets'] = int(sets)
    
    workout_ref.update(updates)
    return get_workout_progress(workout_id)

def delete_workout_progress(workout_id):
    """
    Delete a workout progress entry
    """
    db = get_firestore_client()
    db.collection('workout_progress').document(workout_id).delete()
    return True

