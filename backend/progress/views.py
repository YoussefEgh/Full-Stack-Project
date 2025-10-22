from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import WorkoutProgress
import json
from config.data_structures.priority_queue import PriorityQueue

@csrf_exempt
def workout_progress_list(request):
    if request.method == 'GET':
        # Server-side priority queue using custom PriorityQueue class
        # Priority based on workout intensity = weight * reps * sets
        pq = PriorityQueue()
        
        for wp in WorkoutProgress.objects.all():
            try:
                intensity = int(float(wp.weight) * int(wp.reps) * int(wp.sets))
            except Exception:
                intensity = 0
            
            payload = {
                'id': wp.id,
                'name': wp.name,
                'weight': wp.weight,
                'reps': wp.reps,
                'sets': wp.sets,
                'created_at': wp.created_at.isoformat() if wp.created_at else None,
                'intensity': intensity,
            }
            # Push to priority queue with intensity as priority (higher = better)
            pq.push(payload, intensity)

        # Pop items from priority queue in descending order of intensity
        ordered = []
        while not pq.is_empty():
            priority, payload = pq.pop()
            ordered.append(payload)

        return JsonResponse(ordered, safe=False)
    elif request.method == 'POST':
        data = json.loads(request.body)
        wp = WorkoutProgress.objects.create(
            name=data['name'],
            weight=data['weight'],
            reps=data['reps'],
            sets=data['sets']
        )
        return JsonResponse({'id': wp.id}, status=201)

@csrf_exempt
def workout_progress_detail(request, pk):
    try:
        wp = WorkoutProgress.objects.get(pk=pk)
    except WorkoutProgress.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    if request.method == 'GET':
        return JsonResponse({
            'id': wp.id,
            'name': wp.name,
            'weight': wp.weight,
            'reps': wp.reps,
            'sets': wp.sets,
            'created_at': wp.created_at.isoformat() if wp.created_at else None
        })
    elif request.method == 'PUT':
        data = json.loads(request.body)
        wp.name = data.get('name', wp.name)
        wp.weight = data.get('weight', wp.weight)
        wp.reps = data.get('reps', wp.reps)
        wp.sets = data.get('sets', wp.sets)
        wp.save()
        return JsonResponse({'status': 'updated'})
    elif request.method == 'DELETE':
        wp.delete()
        return JsonResponse({'status': 'deleted'})