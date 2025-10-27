from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests

# import the priority queue
from .data_structures.priority_queue import PriorityQueue

# module-level singleton queue (simple stateful store for dev/testing)
PRIORITY_QUEUE = PriorityQueue()

def progress_view(request):
    # For now, static/mock data
    progress_data = {
        "total_workouts": 18,
        "completed_this_week": 4,
        "streak": 7,
        "goals": [
            {"name": "Push-ups", "progress": 75},
            {"name": "Running", "progress": 50},
            {"name": "Squats", "progress": 90},
        ],
    }
    return JsonResponse(progress_data)


# -------------------------
# Priority queue endpoints
# -------------------------
@csrf_exempt
def queue_enqueue(request):
    """
    POST: { "item": "...", "priority": 5 }
    """
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)
    try:
        data = json.loads(request.body)
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    item = data.get("item")
    priority = data.get("priority")

    if item is None or priority is None:
        return JsonResponse({"error": "Both 'item' and 'priority' are required"}, status=400)

    try:
        priority = int(priority)
    except ValueError:
        return JsonResponse({"error": "'priority' must be an integer"}, status=400)

    PRIORITY_QUEUE.push(item, priority)
    return JsonResponse({"success": True, "size": len(PRIORITY_QUEUE)})


@csrf_exempt
def queue_dequeue(request):
    """
    POST: (no body required)
    Returns the popped (priority, item) or null if empty.
    """
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    top = PRIORITY_QUEUE.pop()
    if top is None:
        return JsonResponse({"success": False, "message": "Queue empty", "item": None})
    priority, item = top
    return JsonResponse({"success": True, "item": item, "priority": priority, "size": len(PRIORITY_QUEUE)})


def queue_peek(request):
    """
    GET: returns the current top without removing
    """
    if request.method != "GET":
        return JsonResponse({"error": "GET required"}, status=400)

    top = PRIORITY_QUEUE.peek()
    if top is None:
        return JsonResponse({"success": False, "message": "Queue empty", "item": None})
    priority, item = top
    return JsonResponse({"success": True, "item": item, "priority": priority, "size": len(PRIORITY_QUEUE)})


def queue_list(request):
    """
    GET: returns internal heap list (priority,item) pairs - useful for debugging
    """
    if request.method != "GET":
        return JsonResponse({"error": "GET required"}, status=400)

    items = PRIORITY_QUEUE.as_list()
    # convert to json-friendly structure
    return JsonResponse({"success": True, "queue": [{"priority": p, "item": it} for p, it in items], "size": len(PRIORITY_QUEUE)})


# -------------------------
# ExerciseDB API endpoints
# -------------------------
def exercises_list(request):
    """
    GET: returns list of exercises from ExerciseDB.dev API
    Optional query parameters: q (search query), bodyPart, equipment, target
    """
    if request.method != "GET":
        return JsonResponse({"error": "GET required"}, status=400)

    # Get query parameters
    search_query = request.GET.get('q', '')
    body_part = request.GET.get('bodyPart', '')
    equipment = request.GET.get('equipment', '')
    target = request.GET.get('target', '')
    
    # Build the API URL and parameters
    api_url = "https://www.exercisedb.dev/api/v1/exercises/search"
    params = {}
    
    # Use search query if provided, otherwise use specific filters
    if search_query:
        params['q'] = search_query
    else:
        # Build search query from individual filters
        search_terms = []
        if body_part:
            search_terms.append(body_part)
        if equipment:
            search_terms.append(equipment)
        if target:
            search_terms.append(target)
        
        if search_terms:
            params['q'] = ' '.join(search_terms)
    
    try:
        response = requests.get(api_url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        # Extract exercises from the response
        exercises = data.get('data', [])
        
        # Limit the number of exercises returned for better performance
        if len(exercises) > 50:
            exercises = exercises[:50]
            
        return JsonResponse({
            "success": True, 
            "exercises": exercises,
            "count": len(exercises)
        })
        
    except requests.exceptions.RequestException as e:
        return JsonResponse({
            "success": False, 
            "error": f"Failed to fetch exercises: {str(e)}"
        }, status=500)
    except Exception as e:
        return JsonResponse({
            "success": False, 
            "error": f"Unexpected error: {str(e)}"
        }, status=500)


def exercise_detail(request, exercise_id):
    """
    GET: returns specific exercise details by ID
    """
    if request.method != "GET":
        return JsonResponse({"error": "GET required"}, status=400)
    
    api_url = f"https://www.exercisedb.dev/api/v1/exercises/{exercise_id}"
    
    try:
        response = requests.get(api_url, timeout=10)
        response.raise_for_status()
        exercise = response.json()
        
        return JsonResponse({
            "success": True, 
            "exercise": exercise
        })
        
    except requests.exceptions.RequestException as e:
        return JsonResponse({
            "success": False, 
            "error": f"Failed to fetch exercise: {str(e)}"
        }, status=500)
    except Exception as e:
        return JsonResponse({
            "success": False, 
            "error": f"Unexpected error: {str(e)}"
        }, status=500)


def exercise_body_parts(request):
    """
    GET: returns list of common body parts for filtering
    Since exercisedb.dev doesn't have a specific body parts endpoint,
    we return a predefined list of common body parts
    """
    if request.method != "GET":
        return JsonResponse({"error": "GET required"}, status=400)
    
    # Common body parts for exercise filtering
    body_parts = [
        "chest", "back", "shoulders", "arms", "biceps", "triceps",
        "legs", "quadriceps", "hamstrings", "calves", "glutes",
        "abs", "core", "waist", "neck", "forearms"
    ]
    
    return JsonResponse({
        "success": True, 
        "bodyParts": body_parts
    })


def exercise_targets(request):
    """
    GET: returns list of common target muscles for filtering
    Since exercisedb.dev doesn't have a specific targets endpoint,
    we return a predefined list of common target muscles
    """
    if request.method != "GET":
        return JsonResponse({"error": "GET required"}, status=400)
    
    # Common target muscles for exercise filtering
    targets = [
        "pectorals", "latissimus dorsi", "deltoids", "biceps", "triceps",
        "quadriceps", "hamstrings", "calves", "glutes", "abs",
        "obliques", "trapezius", "rhomboids", "forearms", "core"
    ]
    
    return JsonResponse({
        "success": True, 
        "targets": targets
    })
