from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import WorkoutProgress
import json
import heapq

@csrf_exempt
def workout_progress_list(request):
    if request.method == 'GET':
        # Server-side priority queue (max-heap) based on workout intensity = weight * reps * sets
        heap = []
        for wp in WorkoutProgress.objects.all():
            try:
                intensity = float(wp.weight) * int(wp.reps) * int(wp.sets)
            except Exception:
                intensity = 0.0
            payload = {
                'id': wp.id,
                'name': wp.name,
                'weight': wp.weight,
                'reps': wp.reps,
                'sets': wp.sets,
                'created_at': wp.created_at,
                'intensity': intensity,
            }
            # use negative intensity for max-heap
            heapq.heappush(heap, (-intensity, wp.id, payload))

        ordered = []
        while heap:
            _, _, payload = heapq.heappop(heap)
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
            'created_at': wp.created_at
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