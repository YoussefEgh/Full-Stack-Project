from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# import the priority queue
from .data_structures.priority_queue import PriorityQueue

# module-level singleton queue (simple stateful store for dev/testing)
PRIORITY_QUEUE = PriorityQueue()

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except Exception:
            return JsonResponse({"success": False, "message": "Invalid JSON"}, status=400)

        email = data.get("email")
        password = data.get("password")

        if email == "test@gmail.com" and password == "123":
            return JsonResponse({"success": True, "message": "Login successful"})
        else:
            return JsonResponse({"success": False, "message": "Invalid credentials"})

    return JsonResponse({"error": "POST required"}, status=400)


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
