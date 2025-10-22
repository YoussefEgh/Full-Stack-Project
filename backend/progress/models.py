from django.db import models

class WorkoutProgress(models.Model):
    name = models.CharField(max_length=100)
    weight = models.FloatField()
    reps = models.IntegerField()
    sets = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.weight}kg x {self.reps} reps x {self.sets} sets"