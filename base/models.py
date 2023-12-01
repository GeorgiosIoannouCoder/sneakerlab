from csv import unregister_dialect
from ctypes import addressof
from email.policy import default
from pickletools import read_stringnl_noescape
from unicodedata import name
from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class product_description(models.Model):
    price = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    category = models.CharField(max_length=100, null=True, blank=True)
    brand = models.CharField(max_length=300, null=True, blank=True)
    name = models.CharField(max_length=300, null=True, blank=True)
    image = models.ImageField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.name)


class product(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    productDescription = models.ForeignKey(
        product_description, on_delete=models.SET_NULL, null=True, blank=True
    )
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    category = models.CharField(max_length=100, null=True, blank=True)
    brand = models.CharField(max_length=300, null=True, blank=True)
    name = models.CharField(max_length=300, null=True, blank=True)
    image = models.ImageField(null=True, blank=True, default="/coming_soon.png")
    description = models.TextField(null=True, blank=True)
    countInStock = models.IntegerField(null=True, blank=True, default=0)
    rating = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    size = models.CharField(max_length=10, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.name) + " - Size: " + str(self.size)


class review(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    product = models.ForeignKey(product, on_delete=models.SET_NULL, null=True)
    rating = models.IntegerField(null=True, blank=True, default=0)
    name = models.CharField(max_length=300, null=True, blank=True)
    comment = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return (
            "Name: "
            + str(self.name)
            + " | Product: "
            + str(self.product)
            + " | Rating: "
            + str(self.rating)
        )


class order(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    shippingPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True
    )
    taxPrice = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    totalPrice = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    paymentMethod = models.CharField(max_length=100, null=True, blank=True)
    isPaid = models.BooleanField(default=False)
    isDelivered = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    deliveredAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.createdAt)[0:10] + " " + str(self.createdAt)[11:19]


class order_item(models.Model):
    order = models.ForeignKey(order, on_delete=models.SET_NULL, null=True)
    product = models.ForeignKey(product, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=300, null=True, blank=True)
    image = models.CharField(max_length=1000, null=True, blank=True)
    quantity = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.product)


class shipping_address(models.Model):
    order = models.OneToOneField(order, on_delete=models.CASCADE, null=True, blank=True)
    zipCode = models.CharField(max_length=15, null=True, blank=True)
    city = models.CharField(max_length=30, null=True, blank=True)
    address = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    shippingPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True
    )
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.address)
