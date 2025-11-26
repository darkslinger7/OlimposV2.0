//solo que resiva numeros
document.getElementById('buscar_cedula').addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '').slice(0, 8);
});
//Busqueda por cedula
document.getElementById('btnBuscarCedula').addEventListener('click', function() {
    const cedula = document.getElementById('buscar_cedula').value.trim();
    if (!cedula) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor ingresa una cédula'
        });
        return;
    }
    // Filtrar filas de la tabla por cédula
    const filas = document.querySelectorAll('tbody tr');
    let encontrado = false;
    filas.forEach(fila => {
        const celdaCedula = fila.children[1];
        if (celdaCedula && celdaCedula.textContent.includes(cedula)) {
            fila.style.display = '';
            encontrado = true;
        } else if (fila.children.length > 1) {
            fila.style.display = 'none';
        }
    });
    if (!encontrado) {
        Swal.fire({
            icon: 'error',
            title: 'No encontrado',
            text: 'No se encontró ningún residente con esa cédula'
        });
    }
});

// Función para buscar usuarios (simulada)
function buscarUsuarios() {
    const input = document.getElementById('buscarUsuario');
    const filter = input.value.toUpperCase();
    const table = document.getElementById('tablaUsuarios');
    const rows = table.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const nombre = rows[i].getElementsByTagName('td')[0];
        if (nombre) {
            const txtValue = nombre.textContent || nombre.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}

    
async function generarAviso(nombre, telefono) {
    const { value: motivo } = await Swal.fire({
        title: 'Generar Aviso',
        html: `
            <select id="motivo" class="swal2-select">
                <option value="">-- Seleccione el motivo --</option>
                <option value="Pago de mensualidad">Pago de mensualidad</option>
                <option value="Heces de su mascota">Heces de su mascota</option>
                <option value="Ruido en apartamento">Ruido en apartamento</option>
                <option value="Mal estacionado">Mal estacionado</option>
                <option value="Llave desactivada">Llave desactivada</option>
                <option value="Control del portón">Control del portón</option>
                <option value="Desorden en áreas verdes">Desorden en áreas verdes</option>
                <option value="Desorden en la piscina">Desorden en la piscina</option>
                <option value="Desorden en salón de fiestas">Desorden en salón de fiestas</option>
                <option value="Desorden en la zona de parrilla">Desorden en la zona de parrilla</option>
            </select>
        `,
        focusConfirm: false,
        preConfirm: () => {
            return document.getElementById('motivo').value;
        }
    });

    if (!motivo) return;

    const detallesOptions = {
        'Pago de mensualidad': ['Pagos atrasados', 'Es importante que actualices tu pago'],
        'Heces de su mascota': ['Multa por no recoger heces'],
        'Ruido en apartamento': ['Ruidos en horas no adecuadas'],
        'Mal estacionado': ['Estacionado en puesto equivocado'],
        'Llave desactivada': ['Es importante que actualices tu pago'],
        'Control del portón': ['Es importante que actualices tu pago'],
        'Desorden en áreas verdes': ['No esta limpia el área utilizada'],
        'Desorden en la piscina': ['No se cumplieron con las normas de aseo en la piscina'],
        'Desorden en salón de fiestas': ['No esta limpia el área utilizada'],
        'Desorden en la zona de parrilla': ['No esta limpia el área utilizada']
    };

    const { value: detalle } = await Swal.fire({
        title: '📝 Detalle del Aviso',
        html: `
            <select id="detalle" class="swal2-select">
                ${detallesOptions[motivo].map(option => `<option value="${option}">${option}</option>`).join('')}
            </select>
        `,
        focusConfirm: false,
        preConfirm: () => {
            return document.getElementById('detalle').value;
        }
    });

    if (!detalle) return;

    // Previsualización del mensaje
    const mensaje = `Hola Sr(a) ${nombre}, soy Administrador de ConVivir.\n\n` +
        `*Motivo:* ${motivo}\n` +
        `*Detalle:* ${detalle}\n\n` +
        `Amable recordatorio, por favor, regularice esta situación a la brevedad para así evitar inconvenientes.\n\n` +
        `Saludos cordiales,\nAdministración ConVivir`;

    const { isConfirmed } = await Swal.fire({
        title: '✉️ Mensaje a Enviar',
        html: `<div style="text-align: left; padding: 10px; border: 1px solid #eee; border-radius: 5px; background: #f9f9f9; white-space: pre-line;">${mensaje}</div>`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Enviar por WhatsApp',
        cancelButtonText: 'Cancelar',
        footer: `<small>Se enviará a: ${telefono}</small>`
    });

    if (isConfirmed) {
        // Abrir WhatsApp con el mensaje
        const mensajeCodificado = encodeURIComponent(mensaje);
        window.open(`https://wa.me/${telefono}?text=${mensajeCodificado}`, '_blank');

        Swal.fire({
            icon: 'success',
            title: '¡Aviso enviado!',
            text: 'El mensaje se ha generado correctamente.',
            timer: 2000
        });
    }
}

// Asignar eventos a los botones
document.addEventListener('DOMContentLoaded', function() {
    const botones = document.querySelectorAll('.generar-aviso');
    botones.forEach(boton => {
        boton.addEventListener('click', function() {
            const nombre = this.getAttribute('data-nombre');
            const telefono = this.getAttribute('data-telefono');
            generarAviso(nombre, telefono);
        });
    });
});