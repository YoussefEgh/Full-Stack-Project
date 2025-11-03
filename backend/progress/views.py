from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .firebase_service import (
    create_workout_progress,
    get_all_workout_progress,
    get_workout_progress,
    update_workout_progress,
    delete_workout_progress
)
from config.firebase import initialize_firebase

# Initialize Firebase on app startup
initialize_firebase()

@csrf_exempt
def workout_progress_list(request):
    if request.method == 'GET':
        # Get all workout progress entries sorted by intensity
        workouts = get_all_workout_progress()
        return JsonResponse(workouts, safe=False)
    elif request.method == 'POST':
        data = json.loads(request.body)
        wp = create_workout_progress(
            name=data['name'],
            weight=data['weight'],
            reps=data['reps'],
            sets=data['sets']
        )
        return JsonResponse({'id': wp['id']}, status=201)

@csrf_exempt
def workout_progress_detail(request, pk):
    wp = get_workout_progress(pk)
    
    if not wp:
        return JsonResponse({'error': 'Not found'}, status=404)

    if request.method == 'GET':
        return JsonResponse(wp)
    elif request.method == 'PUT':
        data = json.loads(request.body)
        updated_wp = update_workout_progress(
            workout_id=pk,
            name=data.get('name'),
            weight=data.get('weight'),
            reps=data.get('reps'),
            sets=data.get('sets')
        )
        return JsonResponse({'status': 'updated'})
    elif request.method == 'DELETE':
        delete_workout_progress(pk)
        return JsonResponse({'status': 'deleted'})