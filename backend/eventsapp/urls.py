from django.urls import path
from .views import RegisterView, LoginView
from .views import CreateStripeCheckoutSession
from rest_framework.routers import DefaultRouter
from .views import EventsappViewSet, RegistrationViewSet
router = DefaultRouter()
router.register(r'events', EventsappViewSet)
router.register(r'registrations', RegistrationViewSet)
urlpatterns = router.urls
urlpatterns += [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path("stripe/create-checkout-session/", CreateStripeCheckoutSession.as_view(), name="create-stripe-session"),

]