#!/usr/bin/env python
"""
Test script to verify Trie is working and build it manually
"""
import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from config.firebase import initialize_firebase
from progress.exercise_trie_service import build_exercise_trie, get_autocomplete_suggestions, EXERCISE_TRIE

initialize_firebase()

print("=" * 60)
print("Testing Exercise Trie")
print("=" * 60)

# Build the Trie
print("\n1. Building Trie...")
count = build_exercise_trie(force_rebuild=True)
print(f"   Trie built with {count} exercises")

# Test autocomplete
print("\n2. Testing autocomplete...")
test_prefixes = ["bench", "squat", "dead", "curl", "press"]

for prefix in test_prefixes:
    suggestions = get_autocomplete_suggestions(prefix, max_results=5)
    print(f"   '{prefix}': {len(suggestions)} suggestions")
    if suggestions:
        print(f"      Examples: {suggestions[:3]}")

print("\n3. Trie Statistics:")
print(f"   Total exercises in Trie: {len(EXERCISE_TRIE)}")
print(f"   Sample exercises: {list(EXERCISE_TRIE.get_all_words()[:10])}")

print("\n" + "=" * 60)
print("Test complete!")

