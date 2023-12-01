from django.urls import URLPattern, path
from base.views import user_views

urlpatterns = [
    path('login/', user_views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', user_views.register_user, name='register'),
    path('profile/', user_views.get_user_profile, name='users-profile'),
    path('profile/update/', user_views.update_user_profile, name='user-profile-update'),
    path('', user_views.get_users, name='users'),
    path('<str:pk>/', user_views.get_user_by_id, name='user'),
    path('update/<str:pk>/', user_views.update_user, name='user-update'),
    path('delete/<str:pk>/', user_views.delete_user, name='user-delete')
]