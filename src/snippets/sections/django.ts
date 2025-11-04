import { RawSection } from "../../types/types";

const section: RawSection = {
  id: "django",
  label: "Django",
  identifier: "bash",
  snippets: [
    {
      title: "Start a new Django project",
      description: "Create a new Django project and navigate into it:",
      markdown: `django-admin startproject myproject
cd myproject`,
    },
    {
      title: "Create a new app",
      description: "Inside your Django project, create an app called 'blog':",
      markdown: `python manage.py startapp blog`,
    },
    {
      title: "Run migrations",
      description: "Apply migrations to set up your database schema:",
      markdown: `python manage.py makemigrations
python manage.py migrate`,
    },
    {
      title: "Run development server",
      description: "Start Django’s local development server:",
      markdown: `python manage.py runserver`,
    },
    {
      title: "Create a superuser",
      description: "Create an admin user for the Django admin panel:",
      markdown: `python manage.py createsuperuser`,
    },
    {
      title: "Open Django shell",
      description: "Access the interactive Django shell (for ORM queries):",
      markdown: `python manage.py shell`,
    },
    {
      title: "Collect static files",
      description: "Gather static files into STATIC_ROOT for deployment:",
      markdown: `python manage.py collectstatic`,
    },
    {
      title: "Check project for potential problems",
      description: "Run Django’s built-in system check framework:",
      markdown: `python manage.py check`,
    },
    {
      title: "Dump and load data",
      description: "Export and import data using Django fixtures:",
      markdown: `python manage.py dumpdata > backup.json
python manage.py loaddata backup.json`,
    },
    {
      title: "Render a template in a view",
      description: "Return an HTML response from a view using render():",
      markdown: `# blog/views.py
from django.shortcuts import render

def home(request):
    context = {"title": "Welcome", "message": "Hello Django!"}
    return render(request, "home.html", context)`,
    },
    {
      title: "Example template",
      description: "A simple Django template using context variables:",
      markdown: `{% raw %}
<!-- templates/home.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>{{ title }}</title>
  </head>
  <body>
    <h1>{{ message }}</h1>
    <ul>
      {% for post in posts %}
        <li>{{ post.title }}</li>
      {% endfor %}
    </ul>
  </body>
</html>
{% endraw %}`,
    },
    {
      title: "Set up URLs in app and project",
      description: "Connect views to URLs in both app and project:",
      markdown: `# blog/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
]

# myproject/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("blog.urls")),
]`,
    },
    {
      title: "Static files setup",
      description: "Configure static file handling for templates:",
      markdown: `# myproject/settings.py
STATIC_URL = "/static/"
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]`,
    },
    {
      title: "Use static files in template",
      description: "Load and use static files in templates:",
      markdown: `{% raw %}
{% load static %}
<link rel="stylesheet" href="{% static 'css/style.css' %}">
<img src="{% static 'images/logo.png' %}" alt="Logo">
{% endraw %}`,
    },
    {
      title: "Set up templates directory",
      description: "Add your templates folder to Django settings:",
      markdown: `# myproject/settings.py
import os

TEMPLATES = [
  {
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [os.path.join(BASE_DIR, "templates")],
    "APP_DIRS": True,
    "OPTIONS": {
      "context_processors": [
        "django.template.context_processors.debug",
        "django.template.context_processors.request",
        "django.contrib.auth.context_processors.auth",
        "django.contrib.messages.context_processors.messages",
      ],
    },
  },
]`,
    },
    {
      title: "Query examples in Django shell",
      description: "Common ORM queries executed from the Django shell:",
      markdown: `from blog.models import Post
from django.contrib.auth.models import User

# Get all posts
Post.objects.all()

# Filter by field
Post.objects.filter(published=True)

# Get a single object
Post.objects.get(id=1)

# Create, update, delete
Post.objects.create(title="Hello", content="World")
post = Post.objects.get(id=1)
post.title = "Updated"
post.save()
post.delete()


# Create a new object
Post.objects.create(title="Hello", content="World")

# Update an object
post = Post.objects.get(id=1)
post.title = "Updated"
post.save()
post.delete()

# Related objects
user = User.objects.get(username="admin")
user.post_set.all()`,
    },
    {
      title: "Update only specific fields in a Django model",
      description: "Use `update_fields` to limit which columns are updated in the database.",
      markdown: `from blog.models import Post

# Fetch an existing post
post = Post.objects.get(id=1)

# Change some attributes
post.title = "New title"
post.views += 1

# Save only the modified fields
post.save(update_fields=["title", "views"])

# Django will run:
# UPDATE blog_post SET title = ..., views = ... WHERE id = ...;`,
    },
    {
      title: "Create a serializer for a model",
      description: "Convert Django models to JSON using a DRF serializer.",
      markdown: `# blog/serializers.py
from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["id", "title", "content", "author", "published", "created_at"]`,
    },

    {
      title: "Basic viewset and router",
      description: "Expose CRUD operations automatically using a ModelViewSet and router.",
      markdown: `# blog/views.py
from rest_framework import viewsets
from .models import Post
from .serializers import PostSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

# myproject/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from blog.views import PostViewSet

router = DefaultRouter()
router.register(r"posts", PostViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
]`,
    },

    {
      title: "Simple APIView example",
      description: "Use APIView for full control over HTTP methods.",
      markdown: `# blog/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class HelloView(APIView):
    def get(self, request):
        return Response({"message": "Hello, API!"})

    def post(self, request):
        name = request.data.get("name")
        return Response({"message": f"Hello, {name}!"}, status=status.HTTP_201_CREATED)

# myproject/urls.py
from django.urls import path
from blog.views import HelloView

urlpatterns = [
    path("api/hello/", HelloView.as_view(), name="hello"),
]`,
    },

    {
      title: "Add authentication and permissions",
      description: "Restrict API access to authenticated users.",
      markdown: `# myproject/settings.py
INSTALLED_APPS += ["rest_framework"]

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.BasicAuthentication",
    ],
}`,
    },

    {
      title: "Test an endpoint with cURL",
      description: "Query your API and view the JSON response in the terminal.",
      markdown: `# Get all posts
curl -s http://127.0.0.1:8000/api/posts/ | jq

# Create a new post (authenticated)
curl -X POST http://127.0.0.1:8000/api/posts/ \\
  -H "Content-Type: application/json" \\
  -u admin:password \\
  -d '{"title": "New Post", "content": "From API"}' | jq`,
    },

    {
      title: "Serializer validation example",
      description: "Add custom validation logic to your serializer.",
      markdown: `# blog/serializers.py
from rest_framework import serializers

class CommentSerializer(serializers.Serializer):
    author = serializers.CharField(max_length=50)
    text = serializers.CharField()

    def validate_text(self, value):
        if "spam" in value.lower():
            raise serializers.ValidationError("Spam content is not allowed.")
        return value`,
    },

    {
      title: "Pagination and filtering",
      description: "Enable pagination and query filters for large datasets.",
      markdown: `# myproject/settings.py
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
    "DEFAULT_FILTER_BACKENDS": [
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
}

# Example query
# GET /api/posts/?search=django&ordering=-created_at`,
    },
  ],
};

export default section;
