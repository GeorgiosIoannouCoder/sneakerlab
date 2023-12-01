from django.urls import URLPattern, path
from base.views import order_views

urlpatterns = [
    path('', order_views.get_orders, name='myorders'),
    path('add/', order_views.add_order_items, name='orders-add'),
    path('myorders/', order_views.get_my_orders, name='myorders'),
    path('<str:pk>/deliver/', order_views.update_order_to_delivered, name='order-delivered'),
    path('<str:pk>/', order_views.get_order_by_id, name='user-order'),
    path('<str:pk>/pay/', order_views.update_order_to_paid, name='pay'),
]