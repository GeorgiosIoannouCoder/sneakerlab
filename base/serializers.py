from rest_framework import serializers
from django.contrib.auth.models import User
from .models import product, order, order_item, shipping_address, review
from rest_framework_simplejwt.tokens import RefreshToken

class user_serializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin']

    def get__id(self, obj):
        return obj.id

    def get_name(self, obj):
        name = obj.first_name
        if(name == ''):
            name = obj.email
        return name

    def get_isAdmin(self, obj):
        return obj.is_staff

class user_serializer_with_token(user_serializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)

class review_serializer(serializers.ModelSerializer):
    class Meta:
        model = review
        fields = '__all__'

class product_serializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = product
        fields = '__all__'
    
    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = review_serializer(reviews, many=True)
        return serializer.data

class shipping_address_serializer(serializers.ModelSerializer):
    class Meta:
        model = shipping_address
        fields = '__all__'


class order_item_serializer(serializers.ModelSerializer):
    class Meta:
        model = order_item
        fields = '__all__'


class order_serializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = order
        fields = '__all__'
    def get_orderItems(self, obj):
        items = obj.order_item_set.all()
        serializer = order_item_serializer(items, many=True)
        return serializer.data
    
    def get_shippingAddress(self, obj):
        try:
            address = shipping_address_serializer(obj.shipping_address, many=False).data
        except:
            address = False
        return address

    def get_user(self, obj):
        user = obj.user
        serializer = user_serializer(user, many=False)
        return serializer.data