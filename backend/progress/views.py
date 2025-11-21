from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
import json
from .firebase_service import (
    create_workout_day,
    get_all_workout_days,
    get_workout_day,
    add_exercise_to_day,
    update_exercise_in_day,
    delete_exercise_from_day,
    update_workout_day,
    delete_workout_day
)
from authentication.firebase_service import verify_firebase_token
from config.firebase import initialize_firebase
from .exercise_trie_service import get_autocomplete_suggestions, build_exercise_trie

# Initialize Firebase on app startup
initialize_firebase()

def get_user_uid(request):
    """Helper to get user UID from Firebase token"""
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split('Bearer ')[1]
    decoded_token = verify_firebase_token(token)
    
    if not decoded_token:
        return None
    
    return decoded_token['uid']

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def workout_days_list(request):
    """Get all workout days for the current user, or create a new one"""
    try:
        user_uid = get_user_uid(request)
        
        if not user_uid:
            print("No user_uid found in request")
            return JsonResponse({'error': 'Unauthorized - No valid token'}, status=401)
        
        if request.method == 'GET':
            days = get_all_workout_days(user_uid)
            return JsonResponse(days, safe=False)
        
        elif request.method == 'POST':
            try:
                body = request.body.decode('utf-8') if isinstance(request.body, bytes) else request.body
                data = json.loads(body) if body else {}
            except json.JSONDecodeError as e:
                print(f"JSON decode error: {e}")
                return JsonResponse({'error': f'Invalid JSON: {str(e)}'}, status=400)
            
            # Validate required fields
            date = data.get('date', datetime.now().isoformat()[:10])
            workout_type = data.get('workout_type', 'regular')
            
            print(f"Creating workout day for user {user_uid}: date={date}, type={workout_type}")
            
            try:
                day = create_workout_day(
                    user_uid=user_uid,
                    date=date,
                    workout_type=workout_type
                )
                
                print(f"Workout day created successfully: {day.get('id')}")
                return JsonResponse(day, status=201)
            except Exception as e:
                print(f"Error creating workout day in Firestore: {e}")
                import traceback
                traceback.print_exc()
                return JsonResponse({'error': f'Failed to save workout day: {str(e)}'}, status=500)
    except Exception as e:
        print(f"Error in workout_days_list: {e}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def workout_day_detail(request, day_id):
    """Get, update, or delete a specific workout day"""
    user_uid = get_user_uid(request)
    
    if not user_uid:
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    
    day = get_workout_day(day_id)
    
    if not day:
        return JsonResponse({'error': 'Not found'}, status=404)
    
    # Verify ownership
    if day.get('user_uid') != user_uid:
        return JsonResponse({'error': 'Forbidden'}, status=403)
    
    if request.method == 'GET':
        return JsonResponse(day)
    
    elif request.method == 'PUT':
        data = json.loads(request.body)
        updated_day = update_workout_day(
            day_id=day_id,
            date=data.get('date'),
            workout_type=data.get('workout_type')
        )
        return JsonResponse(updated_day)
    
    elif request.method == 'DELETE':
        delete_workout_day(day_id)
        return JsonResponse({'status': 'deleted'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_exercise(request, day_id):
    """Add an exercise to a workout day"""
    user_uid = get_user_uid(request)
    
    if not user_uid:
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    
    day = get_workout_day(day_id)
    
    if not day:
        return JsonResponse({'error': 'Day not found'}, status=404)
    
    if day.get('user_uid') != user_uid:
        return JsonResponse({'error': 'Forbidden'}, status=403)
    
    data = json.loads(request.body)
    updated_day = add_exercise_to_day(
        day_id=day_id,
        exercise_name=data['name'],
        reps=data['reps'],
        sets=data['sets'],
        weight=data['weight']
    )
    
    return JsonResponse(updated_day, status=201)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def exercise_detail(request, day_id, exercise_id):
    """Update or delete an exercise from a workout day"""
    user_uid = get_user_uid(request)
    
    if not user_uid:
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    
    day = get_workout_day(day_id)
    
    if not day:
        return JsonResponse({'error': 'Day not found'}, status=404)
    
    if day.get('user_uid') != user_uid:
        return JsonResponse({'error': 'Forbidden'}, status=403)
    
    if request.method == 'PUT':
        data = json.loads(request.body)
        updated_day = update_exercise_in_day(
            day_id=day_id,
            exercise_id=exercise_id,
            exercise_name=data.get('name'),
            reps=data.get('reps'),
            sets=data.get('sets'),
            weight=data.get('weight')
        )
        return JsonResponse(updated_day)
    
    elif request.method == 'DELETE':
        updated_day = delete_exercise_from_day(day_id, exercise_id)
        return JsonResponse(updated_day)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def exercise_autocomplete(request):
    """
    Get autocomplete suggestions for exercise names based on prefix
    Query parameter: 'q' (the prefix to search for)
    Optional parameter: 'limit' (max number of results, default: 10)
    """
    prefix = request.GET.get('q', '').strip()
    max_results = int(request.GET.get('limit', 10))
    
    if not prefix:
        return JsonResponse({'suggestions': []})
    
    try:
        print(f"Autocomplete request for prefix: '{prefix}'")
        suggestions = get_autocomplete_suggestions(prefix, max_results)
        print(f"Found {len(suggestions)} suggestions: {suggestions[:5]}...")
        return JsonResponse({
            'suggestions': suggestions,
            'count': len(suggestions)
        })
    except Exception as e:
        print(f"Error in exercise_autocomplete: {e}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': str(e), 'suggestions': []}, status=500)


@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def rebuild_exercise_trie(request):
    """
    Manually rebuild the exercise Trie (admin/debug endpoint)
    GET: Check Trie status
    POST: Rebuild the Trie
    """
    from .exercise_trie_service import EXERCISE_TRIE, build_exercise_trie
    
    if request.method == 'GET':
        # Return Trie status
        return JsonResponse({
            'success': True,
            'trie_size': len(EXERCISE_TRIE),
            'message': f'Trie contains {len(EXERCISE_TRIE)} exercises'
        })
    
    elif request.method == 'POST':
        try:
            count = build_exercise_trie(force_rebuild=True)
            return JsonResponse({
                'success': True,
                'count': count,
                'message': f'Exercise Trie rebuilt with {count} exercises'
            })
        except Exception as e:
            print(f"Error rebuilding exercise trie: {e}")
            import traceback
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=500)