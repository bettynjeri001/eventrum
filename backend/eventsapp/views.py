from rest_framework import generics, status
import stripe
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
# from django.contrib.auth import login
from django.contrib.auth.models import User
from .models import Eventsapp, Registration,UserProfile
from .serializers import EventsappSerializer, RegisterSerializer, UserProfileSerializer, LoginSerializer, RegistrationSerializer
from rest_framework import serializers
from django.contrib.auth import login
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Eventsapp
from django.shortcuts import get_object_or_404

class EventsappListCreateView(generics.ListCreateAPIView):
    serializer_class = EventsappSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Eventsapp.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class EventsappDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EventsappSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Eventsapp.objects.filter(user=self.request.user)


# Registration view
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            login(request, user)
            return Response({'id': user.id, 'role': user.role}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class EventsappViewSet(viewsets.ModelViewSet):
    queryset = Eventsapp.objects.all()
    serializer_class = EventsappSerializer

class RegistrationViewSet(viewsets.ModelViewSet):
    
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Registration.objects.all()
        attendee_id = self.request.query_params.get('attendee')
        if attendee_id:
            queryset = queryset.filter(user__id=attendee_id)
        elif hasattr(user, "role") and user.role == "attendee":
            queryset = queryset.filter(user=user)
        return queryset

stripe.api_key = settings.STRIPE_SECRET_KEY

@method_decorator(csrf_exempt, name='dispatch')
class CreateStripeCheckoutSession(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if hasattr(request.user, "role") and request.user.role == "organizer":
            return Response({"error": "Organizers cannot get tickets."}, status=403)
        event_id = request.data.get("event_id")
        if not event_id:
            return Response({"error": "event_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        event = get_object_or_404(Eventsapp, id=event_id)

        try:
            ticket_price = int(float(event.ticket) * 100)  # Convert to cents
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'kes',  # Change to 'usd' if needed
                        'product_data': {
                            'name': event.title,
                        },
                        'unit_amount': ticket_price,
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url='http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url='http://localhost:3000/cancel',
                metadata={
                    "user_id": str(request.user.id),
                    "event_id": str(event.id),
                }
            )
            return Response({"id": session.id})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
