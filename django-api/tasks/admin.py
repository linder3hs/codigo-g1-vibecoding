from django.contrib import admin
from .models import Task

# Indicamos que queremos ver este modelo en el django admin
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'status', 'created_at', 'updated_at')
    list_filter = ('user', 'status')
    search_fields = ('title', 'description')
    ordering = ('-created_at',)

# admin.site.register(Task)
