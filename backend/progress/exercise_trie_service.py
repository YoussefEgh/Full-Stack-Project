"""
Service for managing exercise autocomplete using Trie data structure
"""
import requests
import threading
from config.data_structures.trie import Trie
from datetime import datetime, timedelta

# Global Trie instance
EXERCISE_TRIE = Trie()
TRIE_LAST_UPDATED = None
TRIE_LOCK = threading.Lock()  # Thread lock for thread-safe operations
TRIE_UPDATE_INTERVAL = timedelta(hours=24)  # Update trie once per day

# Custom exercises to always include in autocomplete
CUSTOM_EXERCISES = [
    "machine chest press",
    "machine chest fly",
    "machine dip",
    "machine shoulder press",
    "single-arm cable lateral raise",
    "tricep pushdown",
    "tricep overhead extension",
    "lat pulldown",
    "t-bar row",
    "single-arm cable row",
    "machine rear delt fly",
    "barbell curl",  # Assuming "bayesian curl" was meant to be "barbell curl"
    "preacher curl",
]


def fetch_all_exercises_from_api():
    """
    Fetch all exercises from ExerciseDB API
    
    Returns:
        List of exercise names (strings)
    """
    try:
        # ExerciseDB API endpoint - fetch all exercises
        # The API returns exercises in a list format
        api_url = "https://www.exercisedb.dev/api/v1/exercises"
        
        # Extract exercise names
        # The API returns: {"success": true, "data": [...], "metadata": {...}}
        # The API uses pagination, so we need to fetch multiple pages
        exercise_names = []
        seen_names = set()  # To avoid duplicates
        offset = 0
        limit = 100  # Fetch 100 at a time to reduce API calls
        page = 0
        max_pages = 200  # Safety limit (20,000 exercises max) - should be more than enough
        import time
        
        print(f"Starting to fetch exercises from ExerciseDB API...")
        
        while page < max_pages:
            # Fetch a page of exercises
            params = {'offset': offset, 'limit': limit}
            response = requests.get(api_url, params=params, timeout=30)
            
            # Handle rate limiting
            if response.status_code == 429:
                print(f"⚠️ Rate limited by API. Waiting 2 seconds before retry...")
                import time
                time.sleep(2)
                continue
            
            response.raise_for_status()
            
            try:
                data = response.json()
            except ValueError as e:
                print(f"Error parsing JSON response: {e}")
                print(f"Response text: {response.text[:200]}")
                break
            
            # Extract exercises from response
            if isinstance(data, dict):
                exercises = data.get('data', [])
                metadata = data.get('metadata', {})
                
                # Process exercises from this page
                for exercise in exercises:
                    if isinstance(exercise, dict):
                        name = exercise.get('name', '').strip()
                        if name and name.lower() not in seen_names:
                            exercise_names.append(name)
                            seen_names.add(name.lower())
                
                # Check if there are more pages
                next_page = metadata.get('nextPage')
                total_count = metadata.get('totalCount', 0)
                
                # If we got no exercises, we've reached the end
                if len(exercises) == 0:
                    print(f"Reached end of pagination (no exercises returned). Total fetched: {len(exercise_names)}")
                    break
                
                # Check if there are more pages to fetch
                # Continue if: (1) we got a full page (limit) OR (2) nextPage exists
                # Stop if: we got fewer than limit AND no nextPage
                if len(exercises) < limit and not next_page:
                    print(f"Reached end of pagination (got {len(exercises)} exercises, no nextPage). Total fetched: {len(exercise_names)}")
                    break
                
                offset += limit
                page += 1
                # Small delay to avoid rate limiting
                time.sleep(0.5)
                
                # Log progress every 10 pages
                if page % 10 == 0:
                    print(f"Fetched {page} pages, {len(exercise_names)} exercises so far...")
            elif isinstance(data, list):
                # If API returns a list directly
                for exercise in data:
                    if isinstance(exercise, dict):
                        name = exercise.get('name', '').strip()
                        if name and name.lower() not in seen_names:
                            exercise_names.append(name)
                            seen_names.add(name.lower())
                break
            else:
                break
        
        print(f"✅ Fetched {len(exercise_names)} unique exercises from ExerciseDB API (across {page + 1} pages)")
        if page >= max_pages - 1:
            print(f"⚠️ Warning: Hit max_pages limit ({max_pages}). There may be more exercises available.")
        return exercise_names
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching exercises from API: {e}")
        return []
    except Exception as e:
        print(f"Unexpected error fetching exercises: {e}")
        import traceback
        traceback.print_exc()
        return []


def build_exercise_trie(force_rebuild=False):
    """
    Build or rebuild the exercise Trie from ExerciseDB API
    
    Args:
        force_rebuild: If True, rebuild the trie even if it was recently updated
        
    Returns:
        Number of exercises added to the trie
    """
    global EXERCISE_TRIE, TRIE_LAST_UPDATED
    
    with TRIE_LOCK:
        # Check if we need to update
        if not force_rebuild and TRIE_LAST_UPDATED:
            time_since_update = datetime.now() - TRIE_LAST_UPDATED
            if time_since_update < TRIE_UPDATE_INTERVAL and len(EXERCISE_TRIE) > 0:
                print(f"Trie is up to date ({len(EXERCISE_TRIE)} exercises). Last updated: {TRIE_LAST_UPDATED}")
                return len(EXERCISE_TRIE)
        
        print("Building exercise Trie from ExerciseDB API...")
        
        # Fetch exercises from API
        exercise_names = fetch_all_exercises_from_api()
        
        # Add custom exercises to the list (avoid duplicates)
        seen_names = {name.lower() for name in exercise_names}
        custom_added = 0
        for custom_ex in CUSTOM_EXERCISES:
            if custom_ex.lower() not in seen_names:
                exercise_names.append(custom_ex)
                seen_names.add(custom_ex.lower())
                custom_added += 1
        
        if custom_added > 0:
            print(f"Added {custom_added} custom exercises to the list")
        
        if not exercise_names:
            print("⚠️ No exercises fetched from API!")
            if len(EXERCISE_TRIE) > 0:
                print(f"Using existing trie with {len(EXERCISE_TRIE)} exercises")
                return len(EXERCISE_TRIE)
            print("❌ Trie is empty and API fetch failed!")
            return 0
        
        # Clear and rebuild the trie
        EXERCISE_TRIE.clear()
        
        print(f"Inserting {len(exercise_names)} exercises into Trie...")
        for i, name in enumerate(exercise_names):
            EXERCISE_TRIE.insert(name)
            if (i + 1) % 100 == 0:
                print(f"  Inserted {i + 1}/{len(exercise_names)} exercises...")
        
        TRIE_LAST_UPDATED = datetime.now()
        
        print(f"✅ Exercise Trie built successfully with {len(EXERCISE_TRIE)} exercises")
        print(f"   Sample exercises: {list(exercise_names[:5])}")
        return len(EXERCISE_TRIE)


def get_autocomplete_suggestions(prefix: str, max_results: int = 10) -> list:
    """
    Get autocomplete suggestions for exercise names based on prefix
    
    Args:
        prefix: The prefix to search for
        max_results: Maximum number of suggestions to return
        
    Returns:
        List of exercise names that start with the prefix
    """
    global EXERCISE_TRIE
    
    # Ensure trie is built
    if len(EXERCISE_TRIE) == 0:
        print(f"Trie is empty, building now...")
        result = build_exercise_trie()
        if result == 0:
            print("⚠️ Warning: Trie build returned 0 exercises. API may be rate limiting or unavailable.")
    
    print(f"Trie size: {len(EXERCISE_TRIE)} exercises")
    
    with TRIE_LOCK:
        # Try prefix match first
        suggestions = EXERCISE_TRIE.autocomplete(prefix, max_results, contains=False)
        
        # If not enough results and prefix is 3+ chars, try contains search
        if len(suggestions) < max_results and len(prefix) >= 3:
            # Get all words and filter for contains
            all_words = EXERCISE_TRIE.get_all_words()
            prefix_lower = prefix.lower()
            seen = {s.lower() for s in suggestions}
            
            for word in all_words:
                if prefix_lower in word.lower() and word.lower() not in seen:
                    suggestions.append(word)
                    seen.add(word.lower())
                    if len(suggestions) >= max_results:
                        break
        
        print(f"Autocomplete for '{prefix}': found {len(suggestions)} suggestions")
        if len(suggestions) > 0:
            print(f"First few suggestions: {suggestions[:5]}")
    
    return suggestions


def initialize_exercise_trie():
    """
    Initialize the exercise Trie (call this on app startup)
    This will build the trie in the background
    """
    # Build trie in a separate thread to avoid blocking
    thread = threading.Thread(target=build_exercise_trie, daemon=True)
    thread.start()
    print("Exercise Trie initialization started in background...")


# Don't auto-initialize on import - let it be called explicitly or on first use
# This prevents rate limiting issues on startup
# initialize_exercise_trie()

