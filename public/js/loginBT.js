document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todos los botones de toggle password
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            // Encontrar el input de password anterior (asumiendo la misma estructura HTML)
            const passwordInput = this.previousElementSibling;

            if (
                !passwordInput ||
                (passwordInput.type !== 'password' && passwordInput.type !== 'text')
            ) {
                console.error('Campo de contraseña no encontrado');
                return;
            }

            // Alternar el tipo de input
            const isShowing = passwordInput.type === "text";
            passwordInput.type = isShowing ? "password" : "text";

            // Cambiar el icono
            const icon = isShowing ? 'eye' : 'eye-slash';
            this.innerHTML = `<i class="fas fa-${icon}"></i>`;

            // Actualizar ARIA
            this.setAttribute(
                'aria-label',
                isShowing ? 'Mostrar contraseña' : 'Ocultar contraseña'
            );

            // Mantener el foco
            passwordInput.focus();
        });
    });

    // VALIDACIÓN DE TELÉFONO VENEZOLANO (Formato: +58 414 1234567)
    document.getElementById('telefono')?.addEventListener('blur', function() {
        const telefono = this.value.trim();
        const regex = /^\+58\s?(?:412|414|416|424|426)\s?\d{7}$/;

        if (telefono && !regex.test(telefono)) {
            Swal.fire({
                title: 'Teléfono inválido',
                html: 'El formato debe ser: <b>+58 414 1234567</b><br>' +
                        'Prefijos válidos: 412, 414, 416, 424, 426',
                icon: 'error',
                confirmButtonColor: '#4361ee'
            }).then(() => {
                this.value = '';
                this.focus();
            });
        }
    });
    // FORMATO AUTOMÁTICO MIENTRAS ESCRIBE (opcional)
    document.getElementById('telefono')?.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9+]/g, '');
        if (this.value.startsWith('58') && !this.value.startsWith('+58')) {
            this.value = '+' + this.value;
        }
        this.value = this.value.slice(0, 13);
    });


    // VERIFICAR CEDULA 
    document.getElementById('cedula')?.addEventListener('input', function() {
        let valor = this.value.toUpperCase().replace(/[^VEJG0-9]/gi, '');

        if (valor.length > 1 && /^[VEJG]/.test(valor[0])) {
            const letra = valor[0];
            const numeros = valor.slice(1).replace(/[^0-9]/g, '').slice(0, 9);
            this.value = `${letra}-${numeros}`;
        } else {
            this.value = valor;
        }
    });


    //VERIFICACION DE CORREO 
    let emailErrorShown = false;
    document.getElementById('email')?.addEventListener('blur', function() {
        const email = this.value.trim();
        
        if (!email || emailErrorShown) return;
        
        const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
        
        if (!emailPattern.test(email)) {
            emailErrorShown = true; 
            Swal.fire({
                title: 'Error: Correo no válido',
                text: 'Por favor ingrese un correo electrónico válido',
                icon: 'error',
                confirmButtonColor: '#4361ee'
            }).then(() => {
                this.value = '';
                this.focus();
            });
        }
    });
    document.getElementById('email')?.addEventListener('input', function() {
        emailErrorShown = false;
    });


    //VERFICA QUE EN NOMBRE Y APELLIDO SOLO HAYA LETRAS
    document.getElementById('name')?.addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '').slice(0, 50);
    });

    //VERFICA QUE EN USUARIO SOLO HAYA LETRAS Y NÚMEROS
    document.getElementById('user').addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
    });

    document.getElementById('loginForm').addEventListener('submit', function(e) {
        const cedula = document.getElementById('cedula').value;
        if (cedula.length < 7) {
            e.preventDefault();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La cédula debe tener al menos 7 dígitos.'
            });
        }
    });

    // VERIFICACION QUE LOS CAMPOS NO ESTEN VACIOS
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        const name = document.getElementById('name').value.trim();
        const user = document.getElementById('user').value.trim();
        const pass = document.getElementById('pass').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const cedula = document.getElementById('cedula').value.trim();
        const edificio = document.getElementById('edificio').value;
        const apartamento = document.getElementById('apartamento').value.trim();

        if (!name || !user || !pass || !email || !telefono || !cedula || !edificio || !apartamento) {
            e.preventDefault();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, complete todos los campos.'
            });
        }
    });
});