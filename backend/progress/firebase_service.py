"""
Firebase service layer for Progress
"""
from config.firestore import get_firestore_client
from datetime import datetime
import uuid

def create_workout_day(user_uid, date, workout_type):
    """
    Create a new workout day in Firestore
    """
    db = get_firestore_client()
    day_id = str(uuid.uuid4())
    now = datetime.now()
    
    day_data = {
        'id': day_id,
        'user_uid': user_uid,
        'date': date,  # ISO format date string
        'workout_type': workout_type,  # upper/lower/push/pull/legs/regular
        'exercises': [],  # List of exercise objects
        'created_at': now,
        'updated_at': now
    }
    
    db.collection('workout_days').document(day_id).set(day_data)
    
    # Convert datetime objects to ISO format strings for JSON serialization
    day_data['created_at'] = now.isoformat()
    day_data['updated_at'] = now.isoformat()
    
    return day_data

def get_all_workout_days(user_uid):
    """
    Get all workout days for a user, sorted by date (newest first)
    Note: We fetch all and sort in Python to avoid requiring a Firestore composite index
    """
    db = get_firestore_client()
    
    # Fetch all workout days for this user (without order_by to avoid index requirement)
    days_query = db.collection('workout_days').where('user_uid', '==', user_uid)
    days = days_query.stream()
    
    days_list = []
    for day in days:
        day_data = day.to_dict()
        # Handle datetime objects - convert to ISO format strings
        if day_data.get('created_at'):
            if hasattr(day_data['created_at'], 'isoformat'):
                day_data['created_at'] = day_data['created_at'].isoformat()
            elif isinstance(day_data['created_at'], str):
                pass  # Already a string
        else:
            day_data['created_at'] = None
            
        if day_data.get('updated_at'):
            if hasattr(day_data['updated_at'], 'isoformat'):
                day_data['updated_at'] = day_data['updated_at'].isoformat()
            elif isinstance(day_data['updated_at'], str):
                pass  # Already a string
        else:
            day_data['updated_at'] = None
            
        days_list.append(day_data)
    
    # Sort by date descending (newest first) - done in Python to avoid Firestore index requirement
    days_list.sort(key=lambda x: x.get('date', ''), reverse=True)
    
    return days_list

def get_workout_day(day_id):
    """
    Get a specific workout day by ID
    """
    db = get_firestore_client()
    day_ref = db.collection('workout_days').document(day_id)
    day = day_ref.get()
    
    if not day.exists:
        return None
    
    day_data = day.to_dict()
    day_data['created_at'] = day_data['created_at'].isoformat() if day_data.get('created_at') else None
    day_data['updated_at'] = day_data['updated_at'].isoformat() if day_data.get('updated_at') else None
    
    return day_data

def add_exercise_to_day(day_id, exercise_name, reps, sets, weight):
    """
    Add an exercise to a workout day
    """
    db = get_firestore_client()
    day_ref = db.collection('workout_days').document(day_id)
    day = day_ref.get()
    
    if not day.exists:
        return None
    
    day_data = day.to_dict()
    exercises = day_data.get('exercises', [])
    
    exercise = {
        'id': str(uuid.uuid4()),
        'name': exercise_name,
        'reps': int(reps),
        'sets': int(sets),
        'weight': float(weight)
    }
    
    exercises.append(exercise)
    
    day_ref.update({
        'exercises': exercises,
        'updated_at': datetime.now()
    })
    
    return get_workout_day(day_id)

def update_exercise_in_day(day_id, exercise_id, exercise_name=None, reps=None, sets=None, weight=None):
    """
    Update an exercise in a workout day
    """
    db = get_firestore_client()
    day_ref = db.collection('workout_days').document(day_id)
    day = day_ref.get()
    
    if not day.exists:
        return None
    
    day_data = day.to_dict()
    exercises = day_data.get('exercises', [])
    
    # Find and update the exercise
    for exercise in exercises:
        if exercise.get('id') == exercise_id:
            if exercise_name is not None:
                exercise['name'] = exercise_name
            if reps is not None:
                exercise['reps'] = int(reps)
            if sets is not None:
                exercise['sets'] = int(sets)
            if weight is not None:
                exercise['weight'] = float(weight)
            break
    
    day_ref.update({
        'exercises': exercises,
        'updated_at': datetime.now()
    })
    
    return get_workout_day(day_id)

def delete_exercise_from_day(day_id, exercise_id):
    """
    Delete an exercise from a workout day
    """
    db = get_firestore_client()
    day_ref = db.collection('workout_days').document(day_id)
    day = day_ref.get()
    
    if not day.exists:
        return None
    
    day_data = day.to_dict()
    exercises = day_data.get('exercises', [])
    
    # Remove the exercise
    exercises = [ex for ex in exercises if ex.get('id') != exercise_id]
    
    day_ref.update({
        'exercises': exercises,
        'updated_at': datetime.now()
    })
    
    return get_workout_day(day_id)

def update_workout_day(day_id, date=None, workout_type=None):
    """
    Update a workout day (date or workout type)
    """
    db = get_firestore_client()
    day_ref = db.collection('workout_days').document(day_id)
    
    updates = {'updated_at': datetime.now()}
    if date is not None:
        updates['date'] = date
    if workout_type is not None:
        updates['workout_type'] = workout_type
    
    day_ref.update(updates)
    return get_workout_day(day_id)

def delete_workout_day(day_id):
    """
    Delete a workout day
    """
    db = get_firestore_client()
    db.collection('workout_days').document(day_id).delete()
    return True

# Legacy functions for backward compatibility (if needed)
def create_workout_progress(name, weight, reps, sets):
    """Legacy function - kept for backward compatibility"""
    return create_workout_day('legacy', datetime.now().isoformat()[:10], 'regular')

def get_all_workout_progress():
    """Legacy function - returns empty array"""
    return []

