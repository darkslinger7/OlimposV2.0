document.getElementById('buscar_cedula')?.addEventListener('input', function() {
    let valor = this.value.toUpperCase().replace(/[^VEJG0-9]/gi, '');

    if (valor.length > 1 && /^[VEJG]/.test(valor[0])) {
        const letra = valor[0];
        const numeros = valor.slice(1).replace(/[^0-9]/g, '').slice(0, 8);
        this.value = `${letra}-${numeros}`;
    } else {
        this.value = valor;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const buscarInput = document.getElementById('buscar_cedula');
    const btnBuscar = document.getElementById('btnBuscarCedula');
    const btnLimpiar = document.getElementById('btnLimpiarCedula');
    const tabla = document.querySelector('.crud table tbody');

    if (!tabla) return;

    let mensajeNoEncontrado = tabla.querySelector('.mensaje-no-encontrado');
    
    if (!mensajeNoEncontrado) {
        mensajeNoEncontrado = document.createElement('tr');
        const colCount = tabla.parentElement.querySelectorAll('thead th').length;
        mensajeNoEncontrado.innerHTML = `<td colspan="${colCount}" style="text-align:center; color:red; font-size: 1.5em;">Cédula no encontrada</td>`;
        mensajeNoEncontrado.classList.add('mensaje-no-encontrado');
        mensajeNoEncontrado.style.display = 'none';
        tabla.appendChild(mensajeNoEncontrado);
    }

    btnBuscar?.addEventListener('click', function() {
        const cedula = buscarInput?.value.trim();
        let encontrado = false;

        if (!cedula) {
            Array.from(tabla.rows).forEach(row => {
                if (!row.classList.contains('mensaje-no-encontrado')) {
                    row.style.display = '';
                }
            });
            mensajeNoEncontrado.style.display = 'none';
            return;
        }

        Array.from(tabla.rows).forEach(row => {
            if (row.classList.contains('mensaje-no-encontrado')) return;
            
            const celdaCedula = row.cells[5];
            if (celdaCedula && celdaCedula.textContent.includes(cedula)) {
                row.style.display = '';
                encontrado = true;
            } else {
                row.style.display = 'none';
            }
        });

        mensajeNoEncontrado.style.display = encontrado ? 'none' : '';
    });

    btnLimpiar?.addEventListener('click', function() {
        if (buscarInput) buscarInput.value = '';
        Array.from(tabla.rows).forEach(row => {
            if (!row.classList.contains('mensaje-no-encontrado')) {
                row.style.display = '';
            }
        });
        mensajeNoEncontrado.style.display = 'none';
    });
});

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

document.getElementById('telefono')?.addEventListener('input', function() {
    
    this.value = this.value.replace(/[^0-9+]/g, '');
    
    
    if (this.value.startsWith('58') && !this.value.startsWith('+58')) {
        this.value = '+' + this.value;
    }

    this.value = this.value.slice(0, 13);
});

 
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


document.getElementById('name')?.addEventListener('input', function() {
    this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '').slice(0, 50);
});

document.getElementById('user')?.addEventListener('input', function() {
    this.value = this.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
});

document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    const name = document.getElementById('name')?.value.trim();
    const user = document.getElementById('user')?.value.trim();
    const pass = document.getElementById('pass')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const telefono = document.getElementById('telefono')?.value.trim();
    const cedula = document.getElementById('cedula')?.value.trim();

    let error = '';
    
    if (!name) error = 'El nombre es obligatorio';
    else if (!user) error = 'El usuario es obligatorio';
    else if (!pass) error = 'La contraseña es obligatoria';
    else if (!email) error = 'El email es obligatorio';
    else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)) error = 'El email no es válido';
    else if (!telefono) error = 'El teléfono es obligatorio';
    else if (!cedula) error = 'La cédula es obligatoria';
    else if (!/^[VEJG]-?\d{1,8}$/i.test(cedula)) error = 'La cédula no es válida';

    if (error) {
        e.preventDefault();
        Swal.fire({
            icon: 'warning',
            title: 'Error en el formulario',
            text: error,
            confirmButtonText: 'Aceptar'
        });
    }
});

function eliminarUsuario(id) {
    Swal.fire({
        title: '¿Estas seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '/eliminarUsuario/' + id;
        }
    });
}