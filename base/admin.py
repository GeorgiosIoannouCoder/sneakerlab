from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(product_description)
admin.site.register(product)
admin.site.register(review)
admin.site.register(order)
admin.site.register(order_item)
admin.site.register(shipping_address)