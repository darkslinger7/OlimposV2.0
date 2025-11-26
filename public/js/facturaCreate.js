// Seleccionar todos los botones con la clase 'generar_factura'
document.querySelectorAll('.generar_factura').forEach(button => {
    button.addEventListener('click', function() {
        // Cargar la biblioteca jsPDF desde CDN
        const { jsPDF } = window.jspdf;
        
        // Crear una nueva instancia de jsPDF
        const doc = new jsPDF();
        
        // Obtener los datos de la fila actual
        const row = this.closest('tr');
        const numReferencia = row.cells[0].textContent;
        const residente = row.cells[1].textContent;
        const cedula = row.cells[2].textContent;
        const fecha = row.cells[3].textContent;
        const monto = row.cells[4].textContent;
        const metodo = row.cells[5].textContent;
        const bancoEmisor = row.cells[6].textContent;
        const torre = row.cells[7].textContent;
        const apart = row.cells[8].textContent;
        
        // Configurar el título principal
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text('Recibo de Pago', 105, 20, { align: 'center' });
        
        // Línea divisoria
        doc.setDrawColor(0, 100, 0); // Color verde
        doc.setLineWidth(0.8);
        doc.line(20, 25, 190, 25);
        
        // Configurar el sello de "Pago revisado" con icono ✓
        doc.setFontSize(16);
        doc.setTextColor(0, 128, 0); // Color verde
        doc.setFont('helvetica', 'bold');
        doc.text('✓ Pago revisado', 105, 35, { align: 'center' });
        
        // Resetear estilo para el contenido
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        
        // Agregar los datos de la factura de forma ordenada
        let y = 50;
        const lineHeight = 10;
        const leftMargin = 20;
        const rightMargin = 60;
        
        // Función para agregar campo con formato
        const addField = (label, value) => {
            doc.setFont('helvetica', 'bold');
            doc.text(label, leftMargin, y);
            doc.setFont('helvetica', 'normal');
            doc.text(value, rightMargin, y);
            y += lineHeight;
        };
        
        addField('N° Referencia:', numReferencia);
        addField('Residente:', residente);
        addField('Cédula:', cedula);
        addField('Fecha de Pago:', fecha);
        addField('Monto:', monto);
        addField('Método de Pago:', metodo);
        addField('Banco Emisor:', bancoEmisor);
        addField('Torre:', torre);
        addField('Apartamento:', apart);
        
        // Línea divisoria al final
        y += 5;
        doc.setDrawColor(0, 100, 0);
        doc.setLineWidth(0.5);
        doc.line(20, y, 190, y);
        
        // Agregar un pie de página
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Factura generada el: ' + new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }), leftMargin, 280);
        
        // Limpiar el nombre del residente para usarlo en el nombre del archivo
        const cleanResidente = residente.replace(/[^a-zA-Z0-9]/g, '_');
        
        // Guardar el PDF con el nombre del residente
        doc.save(`Recibo_Pago_${cleanResidente}.pdf`);
    });
});