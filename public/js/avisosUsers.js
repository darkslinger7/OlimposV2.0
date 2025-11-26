// Función para generar avisos
async function generarAviso(nombre, telefono) {
    const { value: motivo } = await Swal.fire({
        title: '🚨 Generar Aviso',
        html: `
            <select id="motivo" class="swal2-select">
                <option value="">-- Seleccione el motivo --</option>
                <option value="Falta de mantenimiento">Falta de mantenimiento</option>
                <option value="Problemas con ascensores">Problemas con ascensores</option>
                <option value="Ruido excesivo">Ruido excesivo</option>
                <option value="Falta de seguridad">Falta de seguridad</option>
                <option value="Problemas con el agua">Problemas con el agua</option>
                <option value="Falta de iluminación">Falta de iluminación</option>
                <option value="Problemas con la basura">Problemas con la basura</option>
                <option value="Falta de limpieza en áreas comunes">Falta de limpieza en áreas comunes</option>
                <option value="Problemas con el gas">Problemas con el gas</option>
            </select>
        `,
        focusConfirm: false,
        preConfirm: () => {
            return document.getElementById('motivo').value;
        }
    });

    if (!motivo) return;

    // Detalles según el motivo seleccionado
    const detallesOptions = {
        'Falta de mantenimiento': ['Reparaciones pendientes', 'Equipos en mal estado'],
        'Problemas con ascensores': ['Ascensor fuera de servicio', 'Ascensor lento'],
        'Ruido excesivo': ['Ruido en horas nocturnas', 'Fiestas frecuentes'],
        'Falta de seguridad': ['Cámaras de seguridad inoperantes', 'Falta de vigilancia'],
        'Problemas con el agua': ['Falta de presión', 'Agua turbia'],
        'Falta de iluminación': ['Lámparas fundidas', 'Zonas oscuras'],
        'Problemas con la basura': ['Basura desbordada', 'Recolección tardía'],
        'Falta de limpieza en áreas comunes': ['Áreas sucias', 'Falta de desinfección'],
        'Problemas con el gas': ['Fuga de gas', 'Falta de suministro']
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
    const mensaje = `Hola Sr(a) ${nombre}, soy Residente de ConVivir.\n\n` +
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