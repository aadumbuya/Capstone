# third party imports
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    register,
    activate_account,
    # GoogleLoginView,
    UserRedirectView,
    upload_user_profile,
    get_user_info,
    edit_user_info_only,
    get_user_all_info, 
    get_user_by_query,
    password_change,
    forgot_password,
    password_reset_confirm,
    accounts_by_email,
    delete_account_by_email,
    # confirm_user
    confirm_user,
    getAccountStatus,
    resendActivationLink
)

urlpatterns = [
    path('auth/token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    
    path("auth/register", register, name="register"),

    path("auth/activate_account/<uidb64>/<token>/", activate_account, name="activate_account"),

    # path("auth/google_auth/", GoogleLoginView.as_view(), name="google_login"),
    path("~redirect/", view=UserRedirectView.as_view(), name="redirect"),

    path("upload_user_profile_image", upload_user_profile),
    path("get_user_info/<str:username>", get_user_info),
    path("confirm_user/<str:username>", confirm_user),
    path("edit_user_info_only", edit_user_info_only),
    path("get_user_all_info/<str:username>", get_user_all_info),
    path("get_user_by_query/<str:query>", get_user_by_query),

    path('accounts_by_email/<str:email>', accounts_by_email),
    path("delete_account_by_email/<email>", delete_account_by_email),

    path("change_password", password_change,name="change_password"),
    path('forgot_password', forgot_password, name='forgot-password'),
    path('password-reset-confirm', password_reset_confirm, name='password-reset-confirm'),

    path("get_account_status/<str:username>", getAccountStatus),
    path("resend_activation_link", resendActivationLink),
]




