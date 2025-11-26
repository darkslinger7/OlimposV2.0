const logoUrl = "../img/LOGO.png";

// Function to get current date in DD/MM/YYYY format
function getFormattedDate() {
    const today = new Date();
    return `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
}

// Function to generate clean table HTML
function getCleanTableHTML() {
    const table = document.querySelector('.payments-table');
    if (!table) {
        console.error('No se encontró la tabla de pagos');
        return '';
    }

    const clone = table.cloneNode(true);

    // Remove "Actions" column
    clone.querySelectorAll('thead tr, tbody tr').forEach(tr => {
        if (tr.cells && tr.cells.length > 0) tr.deleteCell(-1);
    });

    // Apply inline styles for table
    clone.style.borderCollapse = "collapse";
    clone.style.width = "100%";
    clone.querySelectorAll('th, td').forEach(cell => {
        cell.style.border = "1px solid #ccc";
        cell.style.padding = "10px";
        cell.style.textAlign = "center";
        cell.style.fontSize = "14px";
    });
    clone.querySelectorAll('th').forEach(th => {
        th.style.backgroundColor = "#f2f2f2";
        th.style.fontWeight = "bold";
    });
    return clone.outerHTML;
}

// Export to Excel
function setupExcelExport() {
    const excelBtn = document.getElementById('export-excel');
    if (!excelBtn) return;

    excelBtn.addEventListener('click', function() {
        const tableHTML = getCleanTableHTML();
        if (!tableHTML) {
            alert('No hay datos para exportar');
            return;
        }

        const html = `
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    .logo-header { text-align:center; margin-bottom:20px; }
                    .logo-header img { height:80px; width:auto; max-width:200px; }
                    .title { text-align:center; font-size:20px; font-weight:bold; margin-bottom:10px; }
                    .date { text-align:center; font-size:16px; margin-bottom:20px; }
                    table { border-collapse:collapse; width:100%; margin:0 auto; }
                    th, td { border:1px solid #ccc; padding:10px; text-align:center; font-size:14px; }
                    th { background:#f2f2f2; font-weight:bold; }
                </style>
            </head>
            <body>
                <div class="logo-header">
                    <img src="${logoUrl}" alt="Logo">
                </div>
                <div class="title">Historial de Pagos</div>
                <div class="date">Fecha de emisión: ${getFormattedDate()}</div>
                ${tableHTML}
            </body>
            </html>
        `;
        
        const blob = new Blob([html], {type: 'application/vnd.ms-excel'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `Registro_de_pagos_${getFormattedDate().replace(/\//g, '-')}.xls`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
}

// Export to PDF
function setupPDFExport() {
    const pdfBtn = document.getElementById('export-pdf');
    if (!pdfBtn) return;

    pdfBtn.addEventListener('click', function() {
        const tableHTML = getCleanTableHTML();
        if (!tableHTML) {
            alert('No hay datos para exportar');
            return;
        }

        const printContents = `
            <div class="logo-header" style="text-align:center; margin-bottom:20px;">
                <img src="${logoUrl}" alt="Logo" style="height:100px; width:auto; max-width:250px;">
            </div>
            <div class="title" style="text-align:center; font-size:24px; font-weight:bold; margin-bottom:10px;">
                Historial de Pagos
            </div>
            <div class="date" style="text-align:center; font-size:16px; margin-bottom:20px;">
                Fecha de emisión: ${getFormattedDate()}
            </div>
            ${tableHTML}
        `;
        
        const win = window.open('', '', 'height=700,width=900');
        win.document.write('<html><head><title>Pagos PDF</title>');
        win.document.write('<style>');
        win.document.write('table { border-collapse:collapse; width:100%; margin:0 auto; }');
        win.document.write('th, td { border:1px solid #ccc; padding:10px; text-align:center; font-size:14px; }');
        win.document.write('th { background:#f2f2f2; font-weight:bold; }');
        win.document.write('@media print { body { margin: 20mm; } }');
        win.document.write('</style>');
        win.document.write('</head><body>');
        win.document.write(printContents);
        win.document.write('</body></html>');
        win.document.close();
        setTimeout(() => {
            win.print();
            win.close();
        }, 500);
    });
}

// Filter functionality (simplified without tower search)
function setupFilters() {
    const searchInput = document.getElementById('search-input');
    const metodoSelect = document.getElementById('metodo-select');
    const desdeInput = document.getElementById('desde-input');
    const hastaInput = document.getElementById('hasta-input');
    const filtrarBtn = document.getElementById('filtrar-btn');
    const limpiarBtn = document.getElementById('limpiar-btn');
    const table = document.querySelector('.payments-table tbody');

    if (!table || !filtrarBtn) return;

    // Set max date for hastaInput to today
    const today = new Date().toISOString().split('T')[0];
    if (hastaInput) hastaInput.setAttribute('max', today);

    function filterTable() {
        const search = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const metodo = metodoSelect ? metodoSelect.value : '';
        const desde = desdeInput ? desdeInput.value : '';
        const hasta = hastaInput ? hastaInput.value : '';
        const currentDate = new Date();

        // Validate date range
        if (hasta && new Date(hasta) > currentDate) {
            alert('La fecha "Hasta" no puede ser mayor a la fecha actual');
            if (hastaInput) hastaInput.value = today;
            return;
        }

        let hasVisibleRows = false;

        Array.from(table.rows).forEach(row => {
            // Skip "No records" row or rows with insufficient cells
            if (row.cells.length < 6) {
                row.style.display = 'none';
                return;
            }

            const referencia = row.cells[0]?.textContent?.toLowerCase() || '';
            const monto = row.cells[1]?.textContent?.toLowerCase() || '';
            const cedula = row.cells[2]?.textContent?.toLowerCase() || '';
            const fecha = row.cells[3]?.textContent || '';
            const metodoPago = row.cells[5]?.textContent?.toLowerCase() || '';

            let matchesSearch = !search;
            let matchesMetodo = !metodo;
            let matchesFecha = !desde && !hasta;

            // Search filter (reference, ID, amount)
            if (search) {
                matchesSearch = referencia.includes(search) || 
                              cedula.includes(search) || 
                              monto.includes(search);
            }

            // Payment method filter
            if (metodo) {
                matchesMetodo = metodoPago === metodo.toLowerCase();
            }

            // Date range filter
            if (desde || hasta) {
                if (desde && hasta) {
                    const desdeDate = new Date(desde);
                    const hastaDate = new Date(hasta);
                    if (desdeDate >= hastaDate) {
                        if (typeof Swal !== 'undefined') {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error en fechas',
                                text: 'La fecha de inicio no puede ser mayor o igual a la fecha de final',
                                confirmButtonText: 'Entendido'
                            });
                        } else {
                            alert('La fecha de inicio no puede ser mayor o igual a la fecha de final');
                        }
                        return;
                    }
                }

                const rowDateParts = fecha.split('/');
                if (rowDateParts.length === 3) {
                    const rowDate = new Date(`${rowDateParts[2]}-${rowDateParts[1]}-${rowDateParts[0]}`);
                    
                    if (desde) {
                        const desdeDate = new Date(desde);
                        matchesFecha = rowDate >= desdeDate;
                    }
                    
                    if (hasta && matchesFecha) {
                        const hastaDate = new Date(hasta);
                        matchesFecha = rowDate <= hastaDate;
                    }
                }
            }

            // Show row only if all active filters match
            const shouldShow = matchesSearch && matchesMetodo && matchesFecha;
            row.style.display = shouldShow ? '' : 'none';
            
            if (shouldShow) hasVisibleRows = true;
        });

        // Check if all rows are hidden
        const noResultsRow = document.getElementById('no-results-row');
        if (!hasVisibleRows) {
            if (!noResultsRow) {
                const newRow = document.createElement('tr');
                newRow.id = 'no-results-row';
                newRow.innerHTML = '<td colspan="6" style="text-align:center;"><h1>No se encontraron resultados</h1></td>';
                table.appendChild(newRow);
            }
        } else if (noResultsRow) {
            noResultsRow.remove();
        }
    }

    if (filtrarBtn) filtrarBtn.addEventListener('click', filterTable);
    if (limpiarBtn) limpiarBtn.addEventListener('click', function() {
        if (searchInput) searchInput.value = '';
        if (metodoSelect) metodoSelect.value = '';
        if (desdeInput) desdeInput.value = '';
        if (hastaInput) hastaInput.value = '';
        filterTable();
    });
}

// Delete payment functionality
function setupDeletePayment() {
    window.eliminarPago = function(id_pago) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "¡No podrás revertir esto!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/eliminarPago/' + id_pago;
                }
            });
        } else {
            if (confirm('¿Estás seguro que deseas eliminar este pago?')) {
                window.location.href = '/eliminarPago/' + id_pago;
            }
        }
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupExcelExport();
    setupPDFExport();
    setupFilters();
    setupDeletePayment();
});