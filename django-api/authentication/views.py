from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from drf_spectacular.utils import extend_schema, OpenApiResponse
from rest_framework import serializers

from .serializers import UserRegistrationSerializer, UserLoginSerializer, RefreshTokenSerializer

User = get_user_model()


@extend_schema(
    operation_id='auth_register',
    summary='Registro de nuevo usuario',
    description='Crea una nueva cuenta de usuario con validaciones de seguridad.',
    request=UserRegistrationSerializer,
    responses={
        201: OpenApiResponse(
            description='Usuario creado exitosamente',
            response={
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'},
                    'user': {
                        'type': 'object',
                        'properties': {
                            'id': {'type': 'integer'},
                            'username': {'type': 'string'},
                            'email': {'type': 'string'},
                            'first_name': {'type': 'string'},
                            'last_name': {'type': 'string'},
                        }
                    }
                }
            }
        ),
        400: OpenApiResponse(
            description='Datos inválidos',
            response={
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'},
                    'details': {'type': 'object'}
                }
            }
        )
    },
    tags=['Autenticación']
)
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    🎯 OBJETIVO: Registrar un nuevo usuario en el sistema
    
    💡 CONCEPTO: Esta vista maneja el registro de nuevos usuarios utilizando
    el UserRegistrationSerializer que ya incluye todas las validaciones necesarias:
    - Email único
    - Username único
    - Contraseña segura (mínimo 8 caracteres + validadores Django)
    - Hasheo automático de contraseña
    
    📋 VALIDACIONES INCLUIDAS:
    - Email único en el sistema
    - Username único
    - Contraseñas coincidentes
    - Fortaleza de contraseña según estándares Django
    
    🔧 RESPUESTA:
    - 201: Usuario creado exitosamente con datos del usuario
    - 400: Errores de validación detallados
    """
    
    # Crear instancia del serializer con los datos recibidos
    serializer = UserRegistrationSerializer(data=request.data)
    
    # Validar los datos
    if serializer.is_valid():
        try:
            # Crear el usuario (el serializer maneja el hasheo de contraseña)
            user = serializer.save()
            
            # Respuesta exitosa con datos del usuario creado
            return Response({
                'message': 'Usuario registrado exitosamente',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            # Manejar errores inesperados durante la creación
            return Response({
                'error': 'Error interno del servidor durante el registro',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Retornar errores de validación
    return Response({
        'error': 'Datos de registro inválidos',
        'details': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    operation_id='auth_login',
    summary='Login de usuario',
    description='Autentica un usuario y retorna tokens JWT (access y refresh).',
    request=UserLoginSerializer,
    responses={
        200: OpenApiResponse(
            description='Login exitoso',
            response={
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'},
                    'user': {
                        'type': 'object',
                        'properties': {
                            'id': {'type': 'integer'},
                            'username': {'type': 'string'},
                            'email': {'type': 'string'},
                            'first_name': {'type': 'string'},
                            'last_name': {'type': 'string'},
                        }
                    },
                    'tokens': {
                        'type': 'object',
                        'properties': {
                            'access': {'type': 'string'},
                            'refresh': {'type': 'string'},
                        }
                    }
                }
            }
        ),
        400: OpenApiResponse(
            description='Credenciales inválidas',
            response={
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'},
                    'details': {'type': 'object'}
                }
            }
        )
    },
    tags=['Autenticación']
)
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """
    🎯 OBJETIVO: Autenticar usuario y generar tokens JWT
    
    💡 CONCEPTO: Esta vista maneja el login de usuarios utilizando
    el UserLoginSerializer que valida credenciales (username o email)
    y genera tokens JWT para la autenticación posterior.
    
    📋 FUNCIONALIDADES:
    - Validación de credenciales (username/email + password)
    - Generación de access token (corta duración)
    - Generación de refresh token (larga duración)
    - Respuesta con información del usuario autenticado
    
    🔧 RESPUESTA:
    - 200: Login exitoso con tokens y datos del usuario
    - 400: Credenciales inválidas o errores de validación
    """
    
    # Crear instancia del serializer con los datos recibidos
    serializer = UserLoginSerializer(data=request.data)
    
    # Validar credenciales
    if serializer.is_valid():
        try:
            # Obtener el usuario validado del serializer
            user = serializer.validated_data['user']
            
            # Generar tokens JWT
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            # Respuesta exitosa con tokens y datos del usuario
            return Response({
                'message': 'Login exitoso',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                },
                'tokens': {
                    'access': str(access_token),
                    'refresh': str(refresh),
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            # Manejar errores inesperados durante la autenticación
            return Response({
                'error': 'Error interno del servidor durante el login',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Retornar errores de validación
    return Response({
        'error': 'Credenciales de login inválidas',
        'details': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    request=RefreshTokenSerializer,
    responses={
        200: OpenApiResponse(
            description="Nuevo access token generado exitosamente",
            response={
                'type': 'object',
                'properties': {
                    'access': {'type': 'string', 'description': 'Nuevo access token'},
                    'refresh': {'type': 'string', 'description': 'Nuevo refresh token (si está habilitada la rotación)'},
                    'message': {'type': 'string', 'description': 'Mensaje de confirmación'}
                }
            }
        ),
        400: OpenApiResponse(
            description="Refresh token inválido o expirado",
            response={
                'type': 'object',
                'properties': {
                    'error': {'type': 'string', 'description': 'Descripción del error'}
                }
            }
        ),
        500: OpenApiResponse(
            description="Error interno del servidor",
            response={
                'type': 'object',
                'properties': {
                    'error': {'type': 'string', 'description': 'Error interno del servidor'}
                }
            }
        )
    },
    summary="Renovar access token",
    description="Valida un refresh token y genera un nuevo access token. Si está habilitada la rotación de tokens, también se genera un nuevo refresh token.",
    tags=["Autenticación"]
)
@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    """
    Vista para renovar el access token usando un refresh token válido
    
    Esta vista:
    1. Valida el refresh token recibido
    2. Genera un nuevo access token
    3. Si está habilitada la rotación, genera un nuevo refresh token
    4. Retorna los nuevos tokens
    """
    try:
        # Validar los datos de entrada
        serializer = RefreshTokenSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {'error': 'Datos inválidos', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Obtener el refresh token validado
        refresh_token_str = serializer.validated_data['refresh']
        
        try:
            # Crear objeto RefreshToken desde el string
            refresh = RefreshToken(refresh_token_str)
            
            # Generar nuevo access token
            new_access_token = str(refresh.access_token)
            
            # Preparar respuesta
            response_data = {
                'access': new_access_token,
                'message': 'Access token renovado exitosamente'
            }
            
            # Si está habilitada la rotación de refresh tokens, incluir el nuevo refresh token
            # Esto se configura en settings.py con ROTATE_REFRESH_TOKENS = True
            # La rotación está habilitada por defecto en nuestra configuración
            try:
                # Obtener el usuario del refresh token
                user_id = refresh.get('user_id')
                User = get_user_model()
                user = User.objects.get(id=user_id)
                
                # Generar nuevo refresh token
                new_refresh = RefreshToken.for_user(user)
                response_data['refresh'] = str(new_refresh)
                
                # Blacklist el refresh token anterior si está configurado
                try:
                    refresh.blacklist()
                except AttributeError:
                    # Si no está disponible el blacklist, continuar
                    pass
            except (User.DoesNotExist, KeyError):
                # Si hay problemas obteniendo el usuario, solo devolver el access token
                pass
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except TokenError as e:
            return Response(
                {'error': 'Refresh token inválido o expirado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except InvalidToken as e:
            return Response(
                {'error': 'Token inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
    except Exception as e:
        return Response(
            {'error': 'Error interno del servidor'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
