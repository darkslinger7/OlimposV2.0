document.addEventListener('DOMContentLoaded', function () {
    const recoveryForm = document.getElementById('recoveryForm');
    const passwordModal = document.getElementById('passwordModal');
    const closeModal = document.getElementById('closeModal');
    const passwordForm = document.getElementById('passwordForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.querySelector('.btn-text');
    const btnLoader = document.querySelector('.btn-loader');
    let correoUsuario = "";

    // Función para mostrar/ocultar el loader
    function toggleLoader(show) {
        if (show) {
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline';
            submitBtn.disabled = true;
        } else {
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
        }
    }

    // Limpiar mensajes de error
    function clearErrors() {
        document.getElementById('emailError').textContent = '';
        document.getElementById('passwordError').textContent = '';
        document.getElementById('confirmPasswordError').textContent = '';
    }

    // Validar email
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Formulario de recuperación
    recoveryForm.addEventListener('submit', function (e) {
        e.preventDefault();
        clearErrors();
        
        const email = document.getElementById('email').value.trim();

        // Validaciones
        if (!email) {
            document.getElementById('emailError').textContent = 'El email es requerido';
            return;
        }

        if (!validateEmail(email)) {
            document.getElementById('emailError').textContent = 'Ingresa un email válido';
            return;
        }

        toggleLoader(true);

        fetch('/verificar-correo', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            toggleLoader(false);
            
            if (data.existe) {
                correoUsuario = email;
                passwordModal.style.display = 'flex';
                // Limpiar los campos del modal
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmPassword').value = '';
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Correo no encontrado',
                    text: 'El correo ingresado no está registrado en nuestro sistema.',
                    confirmButtonColor: '#3085d6'
                });
            }
        })
        .catch(error => {
            toggleLoader(false);
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor. Intenta nuevamente.',
                confirmButtonColor: '#3085d6'
            });
        });
    });

    // Cerrar modal
    closeModal.addEventListener('click', () => {
        passwordModal.style.display = 'none';
        clearErrors();
    });

    // Cerrar modal al hacer clic fuera
    passwordModal.addEventListener('click', (e) => {
        if (e.target === passwordModal) {
            passwordModal.style.display = 'none';
            clearErrors();
        }
    });

    // Formulario de cambio de contraseña
    passwordForm.addEventListener('submit', function (e) {
        e.preventDefault();
        clearErrors();
        
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validaciones
        if (!newPassword) {
            document.getElementById('passwordError').textContent = 'La contraseña es requerida';
            return;
        }

        if (newPassword.length < 4) {
            document.getElementById('passwordError').textContent = 'La contraseña debe tener al menos 4 caracteres';
            return;
        }

        if (!confirmPassword) {
            document.getElementById('confirmPasswordError').textContent = 'Confirma tu contraseña';
            return;
        }

        if (newPassword !== confirmPassword) {
            document.getElementById('confirmPasswordError').textContent = 'Las contraseñas no coinciden';
            Swal.fire({
                icon: 'warning',
                title: 'Las contraseñas no coinciden',
                text: 'Por favor, verifica que ambas contraseñas sean iguales.',
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        // Enviar petición para cambiar contraseña
        fetch('/cambiar-clave', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                email: correoUsuario, 
                newPassword: newPassword // Cambiado de 'nuevaClave' a 'newPassword'
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.ok) {
                passwordModal.style.display = 'none';
                Swal.fire({
                    icon: 'success',
                    title: '¡Contraseña actualizada!',
                    text: 'Tu contraseña ha sido cambiada exitosamente. Ya puedes iniciar sesión.',
                    confirmButtonColor: '#3085d6'
                }).then(() => {
                    window.location.href = '/login';
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar',
                    text: data.error || 'No se pudo actualizar la contraseña. Intenta nuevamente.',
                    confirmButtonColor: '#3085d6'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor. Intenta nuevamente.',
                confirmButtonColor: '#3085d6'
            });
        });
    });

    // Agregar validación en tiempo real para las contraseñas
    document.getElementById('confirmPassword').addEventListener('input', function() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = this.value;
        
        if (confirmPassword && newPassword !== confirmPassword) {
            document.getElementById('confirmPasswordError').textContent = 'Las contraseñas no coinciden';
        } else {
            document.getElementById('confirmPasswordError').textContent = '';
        }
    });
});