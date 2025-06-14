from django.apps import AppConfig


class AuthBaseConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'auth_base'

    def ready(self):
        import auth_base.signals
