# Native Imports
import json
import base64

# Django Import
from django.shortcuts import render

from django.utils import timezone
from django.template.loader import render_to_string
from django.utils.text import slugify
from datetime import timedelta
from rest_framework.response import Response
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.models import User
from django.db.models import Q, Count
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import RedirectView
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.utils.timezone import now
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator

from rest_framework import status
from .serializers import ForgotPasswordSerializer, PasswordChangeSerializer, PasswordResetConfirmSerializer

# Google Auth Imports
# from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
# from allauth.socialaccount.providers.oauth2.client import OAuth2Client
# from dj_rest_auth.registration.views import SocialLoginView

# Local Imports
from .serializers import RegisterationSerializer,UserProfileImageSerializer
from .send_mail import activateEmail
from .tokens import account_activation_token
from .models import UserProfileImage
from .utilities import check_user_activation_status


GOOGLE_REDIRECT_URL=""

# class GoogleLoginView(SocialLoginView):
#     adapter_class = GoogleOAuth2Adapter
#     callback_url = GOOGLE_REDIRECT_URL
#     client_class = OAuth2Client

class UserRedirectView(LoginRequiredMixin, RedirectView):
    """
    This view is needed by the dj-rest-auth-library in order to work the google login. It's a bug.
    """
    permanent = False

    def get_redirect_url(self):
        return "redirect-url"


@api_view(['GET'])
def delete_account_by_email(request,email):
    account = User.objects.filter(email=email)

    if account.exists():
        for i in account:
            i.delete()
        return Response({"msg" : "Account Deleted Successfully."}, status=200)
    else:
        return Response({"msg" : "No Account Found With This Email"}, status=404)

@api_view(['POST'])
def getAccountStatus(request,username):

    try:
        user = User.objects.get(username=username)
    except:
        return Response({"No User found with this query"})
    
    account_is_active = user.is_active
    message = ""
    if account_is_active:
        message = "This Account Has Been Activated."
    else:
        message = "This Account is not Activated."
    
    return Response({"account_status" : message}, status=200)


@api_view(['POST'])
def resendActivationLink(request):
    data = request.data

    if check_user_activation_status(data['username'], data['email']) == "is_not_activated":
        user = User.objects.get(username=data['username'])
        email_message = activateEmail(request,user,user.email)
        return Response({"msg" : email_message}, status=200)
    
    elif check_user_activation_status(data['username'], data['email']) == "This Username Already Exists With A Different Email.":
        return Response({"username":"This Username Already Exists With A Different Email."}, status=401)
    
    if check_user_activation_status(data['username'], data['email']) == "is_activated":
        return Response({"msg" : "This Account is already activated."}, status=200)


@api_view(['POST'])
def register(request):
    data = request.data
    
    serializer = RegisterationSerializer(data=data)

    if User.objects.filter(email=data['email']).exists():
        return Response({"error" : "An Account with this email already exists"}, status=401)
    response = {}

    if check_user_activation_status(data['username'], data['email']) == "is_not_activated":
        user = User.objects.get(username=data['username'])
        email_message = activateEmail(request,user,user.email)
    elif check_user_activation_status(data['username'], data['email']) == "This Username Already Exists With A Different Email.":
        return Response({"username":"This Username Already Exists With A Different Email."}, status=401)
    else:
        if serializer.is_valid():
            user = serializer.save()
            email_message = activateEmail(request, user, user.email)
        else:
            return Response(serializer.errors, status=406)

    response["message"] = email_message
    return Response(response, status=201)




@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def password_change(request):
    serializer = PasswordChangeSerializer(data=request.data)
    if serializer.is_valid():
        user = request.user
        if not user.check_password(serializer.validated_data["old_password"]):
            return Response({"msg":"Wrong old password"},status=406)
        print("here")
        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response({"msg":"Password changed successfully"},status=200)
    return Response({"error":serializer.errors}, status=400)



import logging

logger = logging.getLogger('auth_base')  # Replace with your app name

@api_view(['POST'])
def upload_user_profile(request):
    if request.method == 'POST':
        user = request.data.get('user')
        logger.debug(f"Received upload request for user: {user}")

        try:
            user_instance = User.objects.get(username=user)
        except User.DoesNotExist:
            logger.warning(f"User does not exist: {user}")
            return Response({"error": "This User Does Not Exist."}, status=404)

        base64_image = request.data.get('image')

        # Check for existing image
        existing_image = UserProfileImage.objects.filter(user=user_instance).first()

        if isinstance(base64_image, str) and base64_image.startswith('data:image/'):
            try:
                format, imgstr = base64_image.split(';base64,')
                ext = format.split('/')[-1]
                image_data = base64.b64decode(imgstr)
                file_name = f"{user_instance.username}_profile_image.{ext}"
                image_file = ContentFile(image_data, name=file_name)
                logger.debug(f"Uploading file: {file_name}")

                if existing_image:
                    existing_image.image = image_file
                    existing_image.save()
                    logger.debug(f"Successfully updated image for user: {user_instance.username}")
                    return Response({"message": "Image updated successfully."}, status=200)
                else:
                    uploaded_file_data = {"user": user_instance.username, "image": image_file}
                    serializer = UserProfileImageSerializer(data=uploaded_file_data)
                    if serializer.is_valid():
                        serializer.save()
                        logger.debug(f"Successfully uploaded image for user: {user_instance.username}")
                        return Response(serializer.data, status=201)
                    else:
                        logger.error(f"Serializer errors: {serializer.errors}")
                        return Response(serializer.errors, status=406)
            except Exception as e:
                logger.error(f"Invalid file format: {e}")
                return Response({"error": str(e)}, status=500)

        elif isinstance(base64_image, InMemoryUploadedFile):
            logger.debug(f"Received uploaded file for user: {user_instance.username}")

            if existing_image:
                existing_image.image = base64_image
                existing_image.save()
                logger.debug(f"Successfully updated image for user: {user_instance.username}")
                return Response({"message": "Image updated successfully."}, status=200)
            else:
                uploaded_file_data = {"user": user_instance.username, "image": base64_image}
                serializer = UserProfileImageSerializer(data=uploaded_file_data)
                if serializer.is_valid():
                    serializer.save()
                    logger.debug(f"Successfully uploaded image for user: {user_instance.username}")
                    return Response(serializer.data, status=201)
                else:
                    logger.error(f"Serializer errors: {serializer.errors}")
                    return Response(serializer.errors, status=406)

        else:
            logger.warning("No valid image file provided")
            return Response({'error': 'Image file not provided'}, status=400)

    logger.warning("Method not allowed")
    return Response({'error': 'Method not allowed'}, status=405)





@api_view(['GET'])
def get_user_all_info(request, username):
    if User.objects.filter(username=username).exists():
        user = User.objects.get(username=username)
        #profile_image_user = UserProfileImage.objects.filter(user=username)
        profile_image = ""
        #if profile_image_user.exists():
            #profile_image = profile_image_user[0].image.url
        email = user.email
        fName = user.first_name
        lName = user.last_name

        context = {
            "username" : user.username,
            "profile_image" : profile_image,
            "email" : email,
            "first_name" : fName,
            "last_name" : lName
        }
        return Response({"msg":context}, status=200)
    return Response({"error" : "User Not Found"}, status=404)

@api_view(['GET'])
def get_user_info(request, username):
    if User.objects.filter(username=username).exists():
        user = User.objects.get(username=username)
        #profile_image_user = UserProfileImage.objects.filter(user=username)
        profile_image = ""
        #if profile_image_user.exists():
            #profile_image = profile_image_user[0].image.url
        #email = user.email
        fName = user.first_name
        lName = user.last_name

        context = {
            "username" : user.username,
            "profile_image" : profile_image,
            #"email" : email,
            "first_name" : fName,
            "last_name" : lName
        }
        return Response({"msg":context}, status=200)
    return Response({"error" : "User Not Found"}, status=404)


@api_view(['GET'])
def confirm_user(request, username):
    flag = False
    if User.objects.filter(username=username).exists():
        flag = True
    return Response({"msg":flag}, status=200)


@api_view(['GET'])
def get_user_by_query(request,query):
    #query = request.GET.get('q', None)
    if not query:
        return Response({"error": "Query parameter is required"}, status=400)

    try:
        users = User.objects.filter(
            Q(username__icontains=query) |
            Q(email__icontains=query) |
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query)
        )

        user_list = []
        for user in users:
            profile_query = UserProfileImage.objects.filter(user=user.username)
            profile = ""
            if profile_query.exists():
                profile = profile_query[0].image.url

            user_info = {
                'username': user.username,
                #'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'profile' : profile
            }
            user_list.append(user_info)

        return Response({"result" : user_list}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
def edit_user_info_only(request):
    data = request.data
    if User.objects.filter(username=data["username"]).exists():
        user = User.objects.filter(username=data["username"]).first()
        user.email = data["email"]
        user.fName = data["first_name"]
        user.lName = data["last_name"]
        user.save(update_fields=["email","first_name","last_name"])
        return Response({"msg":"Saved"}, status=200)
    return Response({"error" : "User Not Found"}, status=404)



@api_view(['POST'])
def activate_account(request, uidb64, token):
    try:
        # get the user with the decoded id
        id = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(id=id)
    except:
        user = None

    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        return Response({"message" : "Email Verified and Account Activated!"}, status=200)
    else:
        return Response({"message" : "Invalid Activation Link"}, status=406)




@api_view(['POST'])
def forgot_password(request):
    DOMAIN = ''
    from .serializers import ForgotPasswordSerializer
    serializer = ForgotPasswordSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = User.objects.get(email=serializer.validated_data['email'])
        except User.DoesNotExist:
            return Response({"error" : "No Account With This Email EXists"})
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # Updated URL to match the new endpoint
        #reset_url = reverse('password-reset-confirm')
        reset_url = "/confirm_password_reset"
        full_url = f"{DOMAIN}{reset_url}?uidb64={uid}&token={token}"

        from_email = settings.DEFAULT_FROM_EMAIL
        # Send the reset link via email
        send_mail(
            'Password Reset Request',
            f'Click the link to reset your password: {full_url}',
            f'{from_email}',
            [user.email],
        )
        return Response({"message": "Password reset email sent!"}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def password_reset_confirm(request):
    serializer = PasswordResetConfirmSerializer(data=request.data)
    if serializer.is_valid():
        return Response({"message": "Password has been reset successfully!"}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def accounts_by_email(request,email):
    if not email:
        return Response({'error': 'Email parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

    users = User.objects.filter(email=email)
    if not users.exists():
        return Response({'message': 'No accounts found for this email'}, status=status.HTTP_404_NOT_FOUND)

    user_data = [{'username': user.username, 'email': user.email} for user in users]
    return Response({'accounts': user_data}, status=status.HTTP_200_OK)
