"""Serializers para la aplicación de autenticación.

Este módulo contiene todos los serializers necesarios para manejar
la autenticación de usuarios, registro, login, perfil y cambio de contraseña.
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer para el registro de nuevos usuarios.
    
    Maneja la creación de nuevos usuarios con validaciones de seguridad
    para email único y contraseña segura.
    """
    
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'},
        help_text="La contraseña debe tener al menos 8 caracteres"
    )
    password_confirm = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
        help_text="Confirma tu contraseña"
    )
    email = serializers.EmailField(
        required=True,
        help_text="Email único para el usuario"
    )
    
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password', 'password_confirm')
        extra_kwargs = {
            'username': {
                'help_text': 'Nombre de usuario único. Solo letras, números y @/./+/-/_ permitidos.'
            },
            'first_name': {
                'help_text': 'Nombre del usuario'
            },
            'last_name': {
                'help_text': 'Apellido del usuario'
            }
        }
    
    def validate_email(self, value):
        """Valida que el email sea único en el sistema."""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Ya existe un usuario con este email."
            )
        return value
    
    def validate_username(self, value):
        """Valida que el username sea único."""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "Ya existe un usuario con este nombre de usuario."
            )
        return value
    
    def validate(self, attrs):
        """Valida que las contraseñas coincidan y sean seguras."""
        password = attrs.get('password')
        password_confirm = attrs.get('password_confirm')
        
        # Verificar que las contraseñas coincidan
        if password != password_confirm:
            raise serializers.ValidationError({
                'password_confirm': 'Las contraseñas no coinciden.'
            })
        
        # Validar la fortaleza de la contraseña usando los validadores de Django
        try:
            validate_password(password)
        except ValidationError as e:
            raise serializers.ValidationError({
                'password': list(e.messages)
            })
        
        return attrs
    
    def create(self, validated_data):
        """Crea un nuevo usuario con la contraseña hasheada."""
        # Remover password_confirm ya que no es parte del modelo
        validated_data.pop('password_confirm')
        
        # Crear el usuario
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer para el login de usuarios.
    
    Valida las credenciales del usuario y retorna la información
    necesaria para la autenticación.
    """
    
    username = serializers.CharField(
        help_text="Nombre de usuario o email"
    )
    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
        help_text="Contraseña del usuario"
    )
    
    def validate(self, attrs):
        """Valida las credenciales del usuario."""
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            # Intentar autenticar con username
            user = authenticate(username=username, password=password)
            
            # Si no funciona con username, intentar con email
            if not user:
                try:
                    user_obj = User.objects.get(email=username)
                    user = authenticate(username=user_obj.username, password=password)
                except User.DoesNotExist:
                    pass
            
            if user:
                if not user.is_active:
                    raise serializers.ValidationError(
                        'La cuenta de usuario está desactivada.'
                    )
                attrs['user'] = user
                return attrs
            else:
                raise serializers.ValidationError(
                    'Credenciales inválidas. Verifica tu usuario/email y contraseña.'
                )
        else:
            raise serializers.ValidationError(
                'Debe proporcionar username/email y contraseña.'
            )


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer para mostrar y actualizar el perfil del usuario.
    
    Excluye campos sensibles como la contraseña y permite
    actualizar información básica del perfil.
    """
    
    email = serializers.EmailField(read_only=True)
    username = serializers.CharField(read_only=True)
    date_joined = serializers.DateTimeField(read_only=True)
    last_login = serializers.DateTimeField(read_only=True)
    
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'date_joined', 'last_login', 'is_active'
        )
        read_only_fields = ('id', 'username', 'email', 'date_joined', 'last_login', 'is_active')
        extra_kwargs = {
            'first_name': {
                'help_text': 'Nombre del usuario'
            },
            'last_name': {
                'help_text': 'Apellido del usuario'
            }
        }
    
    def validate_first_name(self, value):
        """Valida que el nombre no esté vacío si se proporciona."""
        if value and len(value.strip()) < 2:
            raise serializers.ValidationError(
                "El nombre debe tener al menos 2 caracteres."
            )
        return value.strip() if value else value
    
    def validate_last_name(self, value):
        """Valida que el apellido no esté vacío si se proporciona."""
        if value and len(value.strip()) < 2:
            raise serializers.ValidationError(
                "El apellido debe tener al menos 2 caracteres."
            )
        return value.strip() if value else value


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer para cambiar la contraseña del usuario.
    
    Requiere la contraseña actual para validar la identidad
    y la nueva contraseña con confirmación.
    """
    
    current_password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
        help_text="Contraseña actual del usuario"
    )
    new_password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'},
        help_text="Nueva contraseña (mínimo 8 caracteres)"
    )
    new_password_confirm = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
        help_text="Confirma la nueva contraseña"
    )
    
    def validate_current_password(self, value):
        """Valida que la contraseña actual sea correcta."""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError(
                "La contraseña actual es incorrecta."
            )
        return value
    
    def validate(self, attrs):
        """Valida que las nuevas contraseñas coincidan y sean seguras."""
        new_password = attrs.get('new_password')
        new_password_confirm = attrs.get('new_password_confirm')
        current_password = attrs.get('current_password')
        
        # Verificar que las nuevas contraseñas coincidan
        if new_password != new_password_confirm:
            raise serializers.ValidationError({
                'new_password_confirm': 'Las nuevas contraseñas no coinciden.'
            })
        
        # Verificar que la nueva contraseña sea diferente a la actual
        if current_password == new_password:
            raise serializers.ValidationError({
                'new_password': 'La nueva contraseña debe ser diferente a la actual.'
            })
        
        # Validar la fortaleza de la nueva contraseña
        try:
            validate_password(new_password, user=self.context['request'].user)
        except ValidationError as e:
            raise serializers.ValidationError({
                'new_password': list(e.messages)
            })
        
        return attrs
    
    def save(self):
        """Actualiza la contraseña del usuario."""
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user