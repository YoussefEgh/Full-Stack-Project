from django.core.management.base import BaseCommand
from communities.models import Post, Reply
from datetime import datetime, timedelta

class Command(BaseCommand):
    help = 'Add mock data for communities'

    def handle(self, *args, **options):
        # Clear existing data
        Post.objects.all().delete()
        
        # Create mock posts
        posts_data = [
            {
                'title': "Best Pre-Workout for Morning Sessions?",
                'author': "GymBro92",
                'content': "What's everyone using for pre-workout lately? I've been trying C4 but it makes me tingle too much 😅",
                'likes': 15,
                'category': "Supplements",
                'created_at': datetime.now() - timedelta(days=2, hours=2),
                'replies': [
                    {'user': "FitQueen", 'text': "Try Gorilla Mode — clean energy, no crash!"},
                    {'user': "BulkBeast", 'text': "I just drink black coffee before training."},
                ]
            },
            {
                'title': "Favorite Bicep Exercises?",
                'author': "FlexKing",
                'content': "Mine are incline dumbbell curls and preacher curls. Curious what everyone else does for that peak 💪",
                'likes': 23,
                'category': "Exercises",
                'created_at': datetime.now() - timedelta(days=3, hours=8),
                'replies': [
                    {'user': "IronManiac", 'text': "Hammer curls all day — hits the brachialis hard!"},
                ]
            },
            {
                'title': "High Protein Snack Ideas?",
                'author': "NutriNerd",
                'content': "Need some quick, easy snacks for cutting that are high in protein but low in calories.",
                'likes': 9,
                'category': "Nutrition",
                'created_at': datetime.now() - timedelta(hours=5),
                'replies': [
                    {'user': "MealPrepPro", 'text': "Try Greek yogurt + protein powder mix!"},
                    {'user': "ShredQueen", 'text': "Tuna packets — 20g protein, zero prep."},
                ]
            },
        ]
        
        for post_data in posts_data:
            replies_data = post_data.pop('replies')
            post = Post.objects.create(**post_data)
            
            for reply_data in replies_data:
                Reply.objects.create(post=post, **reply_data)
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {len(posts_data)} posts with replies')
        )
