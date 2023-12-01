from tokenize import Comment
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import product, review
from base.serializers import product_serializer
from rest_framework import status

@api_view(['GET'])
def get_products(request):
    products = product.objects.all()
    serializer = product_serializer(products, many = True)
    return Response(serializer.data)

@api_view(['GET'])
def get_product(request, pk):
    productt = product.objects.get(_id=pk)
    serializer = product_serializer(productt, many = False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_product(request):
    user = request.user
    productt = product.objects.create(
        user=user,
        price=0,
        category='',
        brand='',
        name='',
        description='',
        countInStock=0,
        size=''
    )
    serializer = product_serializer(productt, many = False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_product(request, pk):
    data = request.data
    productt = product.objects.get(_id=pk)
    productt.price = data['price']
    productt.category = data['category']
    productt.brand = data['brand']
    productt.name = data['name']
    productt.description = data['description']
    productt.countInStock = data['countInStock']
    productt.size = data['size']
    productt.save()
    serializer = product_serializer(productt, many = False)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_product(request, pk):
    productt = product.objects.get(_id=pk)
    productt.delete()
    return Response('Product was successfully deleted.')

@api_view(['POST'])
def upload_image(request):
    data = request.data
    product_id = data['product_id']
    productt = product.objects.get(_id=product_id)
    productt.image = request.FILES.get('image')
    productt.save()
    return Response('Image was successfully uploaded')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_product_review(request, pk):
    user = request.user
    productt = product.objects.get(_id=pk)
    data = request.data

    already_exists = productt.review_set.filter(user=user).exists()
    if already_exists:
        content = {'detail':'Product has been already reviewed.'}
        return Response(content, status = status.HTTP_400_BAD_REQUEST)
    elif data['rating'] == 0:
        content = {'detail':'Please rate the product.'}
        return Response(content, status = status.HTTP_400_BAD_REQUEST)
    else:
        revieww = review.objects.create(
            user = user, product = productt, name = user.first_name, rating = data['rating'], comment = data['comment']
        )
        reviews = productt.review_set.all()
        productt.numReviews = len(reviews)
        total = 0
        for i in reviews:
            total = total + i.rating
        productt.rating = total / len(reviews)
        productt.save()
        return Response('Review Successfully Added')
