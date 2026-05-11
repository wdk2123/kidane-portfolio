from rest_framework import serializers
from .models import Project, Skill, Experience, Education, BlogPost, ContactMessage

class ProjectSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'

    def get_image(self, obj):
        if obj.image:
            return f"http://127.0.0.1:8000{obj.image.url}"
        return None

class ProjectListSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'image', 'technologies',
                  'category', 'featured', 'created_at']

    def get_image(self, obj):
        if obj.image:
            return f"http://127.0.0.1:8000{obj.image.url}"
        return None

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'

class BlogPostSerializer(serializers.ModelSerializer):
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = '__all__'
        read_only_fields = ['slug']

    def get_cover_image(self, obj):
        if obj.cover_image:
            return f"http://127.0.0.1:8000{obj.cover_image.url}"
        return None

class BlogPostListSerializer(serializers.ModelSerializer):
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'excerpt', 'cover_image',
                  'author', 'category', 'tags', 'published_at',
                  'read_time', 'featured']

    def get_cover_image(self, obj):
        if obj.cover_image:
            return f"http://127.0.0.1:8000{obj.cover_image.url}"
        return None

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']