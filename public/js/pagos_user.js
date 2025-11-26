document.addEventListener('DOMContentLoaded', function () {
    const paymentForm = document.getElementById('paymentForm');
    const submitBtn = document.getElementById('submitBtn');

    // Expresión regular para validar cédula (formato V-12345678 o E-12345678)
    const cedulaRegex = /^[VEve]-?\d{5,8}$/;

    paymentForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Resetear errores
        resetErrors();

        // Validar campos
        const referenciaValid = validateField('referencia', 'El número de referencia es obligatorio');
        const montoValid = validateMonto();
        const tipoPagoValid = validateField('tipoPago', 'Seleccione un tipo de pago');
        const fechaValid = validateField('fecha', 'Seleccione una fecha válida');
        const nombreValid = validateNombre();
        const cedulaValid = validateCedula();
        const bancoValid = validateField('banco', 'Seleccione un banco');

        if (referenciaValid && montoValid && tipoPagoValid && fechaValid && nombreValid && cedulaValid && bancoValid) {
            // Mostrar confirmación con SweetAlert
            Swal.fire({
                title: '¿Confirmar pago?',
                html: `
                    <div style="text-align: left; margin-top: 1rem;">
                        <p><strong>Referencia:</strong> ${document.getElementById('referencia').value}</p>
                        <p><strong>Monto:</strong> Bs: ${parseFloat(document.getElementById('monto').value).toFixed(2)}</p>
                        <p><strong>Tipo de pago:</strong> ${document.getElementById('tipoPago').options[document.getElementById('tipoPago').selectedIndex].text}</p>
                        <p><strong>Banco:</strong> ${document.getElementById('banco').options[document.getElementById('banco').selectedIndex].text}</p>
                    </div>
                `,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#4361ee',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, registrar',
                cancelButtonText: 'Revisar datos',
                backdrop: `
                    rgba(0,0,0,0.5)
                    url("/images/nyan-cat.gif")
                    left top
                    no-repeat
                `,
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: '¡Pago registrado!',
                        text: 'El pago ha sido registrado exitosamente',
                        icon: 'success',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false
                    }).then(() => {
                        paymentForm.submit(); // Enviar después de mostrar éxito
                    });
                }
            });
        } else {
            // Mostrar error general si hay campos inválidos
            Swal.fire({
                title: 'Formulario incompleto',
                text: 'Por favor complete todos los campos requeridos correctamente',
                icon: 'error',
                confirmButtonColor: '#4361ee'
            });
        }
    });

    // Validar campo genérico
    function validateField(fieldId, errorMessage) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}Error`);

        if (!field.value.trim()) {
            field.classList.add('error');
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
            return false;
        }

        return true;
    }

    // Validar monto
    function validateMonto() {
        const monto = document.getElementById('monto');
        const errorElement = document.getElementById('montoError');
        const value = parseFloat(monto.value);

        if (isNaN(value) || value <= 0) {
            monto.classList.add('error');
            errorElement.textContent = 'Ingrese un monto válido mayor a 0';
            errorElement.classList.add('show');
            return false;
        }

        return true;
    }

    // Validar nombre
    function validateNombre() {
        const nombre = document.getElementById('nombre');
        const errorElement = document.getElementById('nombreError');

        if (!nombre.value.trim() || nombre.value.trim().length < 2) {
            nombre.classList.add('error');
            errorElement.textContent = 'El nombre es obligatorio (mínimo 2 caracteres)';
            errorElement.classList.add('show');
            return false;
        }

        return true;
    }

    // Validar cédula
    function validateCedula() {
        const cedula = document.getElementById('cedula');
        const errorElement = document.getElementById('cedulaError');

        if (!cedulaRegex.test(cedula.value.trim())) {
            cedula.classList.add('error');
            errorElement.textContent = 'Formato de cédula inválido (Ej: V-12345678)';
            errorElement.classList.add('show');
            return false;
        }

        return true;
    }

    // Resetear errores
    function resetErrors() {
        document.querySelectorAll('.form-group input, .form-group select').forEach(input => {
            input.classList.remove('error');
        });

        document.querySelectorAll('.error-message').forEach(error => {
            error.classList.remove('show');
            error.textContent = '';
        });
    }

    // Validación en tiempo real
    document.querySelectorAll('#paymentForm input, #paymentForm select').forEach(field => {
        field.addEventListener('input', function () {
            if (this.value.trim()) {
                this.classList.remove('error');
                const errorElement = document.getElementById(`${this.id}Error`);
                if (errorElement) errorElement.classList.remove('show');
            }
        });
    });

    // Validar solo números en referencia (máximo 6 dígitos)
    document.getElementById('referencia').addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);
    });

    // Validar cedula
    document.getElementById('cedula').addEventListener('input', function () {
    let valor = this.value.toUpperCase().replace(/[^VEJG0-9]/gi, '');

    if (valor.length > 1 && /^[VEJG]/.test(valor[0])) {
        const letra = valor[0];
        const numeros = valor.slice(1).replace(/[^0-9]/g, '').slice(0, 8);
        this.value = `${letra}-${numeros}`;
    } else {
        this.value = valor;
    }
});

});
