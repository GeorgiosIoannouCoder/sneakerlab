from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import product, order, order_item, shipping_address
from base.serializers import product_serializer, order_serializer
from rest_framework import status
from datetime import datetime

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_order_items(request):
    user = request.user
    data = request.data
    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        orderr = order.objects.create(user=user, shippingPrice=data['shippingPrice'], taxPrice=data['taxPrice'], totalPrice=data['totalPrice'], paymentMethod=data['paymentMethod'],)
        shipping = shipping_address.objects.create(order=orderr, zipCode=data['shippingAddress']['zipCode'], city=data['shippingAddress']['city'], address=data['shippingAddress']['address'], country=data['shippingAddress']['country'],)
        for i in orderItems:
            productt = product.objects.get(_id=i['product'])
            item = order_item.objects.create(order=orderr, product=productt, name=productt.name, image=productt.image.url, quantity=i['quantity'], price=i['price'])
            productt.countInStock -= item.quantity
            productt.save()
        
        serializer = order_serializer(orderr, many=False)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_orders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = order_serializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_by_id(request, pk):
    user = request.user
    try:
        orderr = order.objects.get(_id = pk)
        if (user.is_staff or orderr.user == user):
            serializer = order_serializer(orderr, many=False)
            return Response(serializer.data)
        else:
            Response({'detail':'Not authorized to view order'}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({'detail':'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_order_to_paid(request, pk):
    orderr = order.objects.get(_id=pk)
    orderr.isPaid = True
    orderr.paidAt = datetime.now()
    orderr.save()
    return Response('Order paid successfully')


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_orders(request):
    orders = order.objects.all()
    serializer = order_serializer(orders, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_order_to_delivered(request, pk):
    orderr = order.objects.get(_id=pk)
    orderr.isDelivered = True
    orderr.deliveredAt = datetime.now()
    orderr.save()
    return Response('Order delivered successfully')