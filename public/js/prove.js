document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // Funcionalidad del Modal de Proveedores
    // =============================================
    const agregarBtn = document.getElementById('agregar-btn');
    const modal = document.getElementById('proveedorModal');
    const closeBtn = document.querySelector('.close-btn');
    const proveedorForm = document.getElementById('proveedorForm');

    if (agregarBtn) {
        agregarBtn.addEventListener('click', function() {
            modal.style.display = 'flex';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            resetForm();
        });
    }

    if (modal) {
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                resetForm();
            }
        });
    }

    const validations = [
        {
            input: 'nombre_apellido',
            error: 'nombreError',
            validate: (value) => value.trim().length >= 3,
            message: 'El nombre debe tener al menos 3 caracteres'
        },
        {
            input: 'cedula',
            error: 'cedulaError',
            validate: (value) => /^[VEJGvejg]-?\d{5,9}$/.test(value),
            message: 'Formato inválido. Use V-, E-, J- o G- seguido de 5-9 números'
        },
        {
            input: 'email',
            error: 'emailError',
            validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Ingrese un email válido'
        },
        {
            input: 'rif',
            error: 'rifError',
            validate: (value) => /^[VEJGvejg]-?\d{8}-\d$/.test(value),
            message: 'Formato inválido. Use V-, E-, J- o G- seguido de 8 números y dígito verificador'
        },
        {
            input: 'telefono',
            error: 'telefonoError',
            validate: (value) => /^\+584\d{9}$/.test(value),
            message: 'Formato inválido. Use +584 seguido de 9 dígitos'
        },
        {
            input: 'monto_pago',
            error: 'montoError',
            validate: (value) => !isNaN(value) && parseFloat(value) > 0,
            message: 'El monto debe ser mayor a 0'
        },
        {
            input: 'area_trabajo',
            error: 'areaError',
            validate: (value) => value.trim().length >= 3,
            message: 'El área debe tener al menos 3 caracteres'
        },
        {
            input: 'banco',
            error: 'bancoError',
            validate: (value) => value !== '',
            message: 'Seleccione un banco'
        },
        {
            input: 'cuenta_cedula',
            error: 'cuentaCedulaError',
            validate: (value) => /^[VEJGvejg]-?\d{5,9}$/.test(value),
            message: 'Formato inválido. Use V-, E-, J- o G- seguido de 5-9 números'
        },
        {
            input: 'cuenta_telefono',
            error: 'cuentaTelefonoError',
            validate: (value) => /^\+584\d{9}$/.test(value),
            message: 'Formato inválido. Use +584 seguido de 9 dígitos'
        }
    ];

    if (proveedorForm) {
        validations.forEach(({ input, error, validate }) => {
            const inputElement = document.getElementById(input);
            if (inputElement) {
                inputElement.addEventListener('input', function(e) {
                    const isValid = validate(e.target.value);
                    const errorElement = document.getElementById(error);
                    inputElement.classList.toggle('input-error', !isValid);
                    if (errorElement) {
                        errorElement.style.display = isValid ? 'none' : 'block';
                    }
                });
            }
        });

        proveedorForm.addEventListener('submit', function(event) {
            let isValid = true;
            let firstError = null;

            validations.forEach(({ input, error, validate, message }) => {
                const inputElement = document.getElementById(input);
                if (inputElement) {
                    const value = inputElement.value;
                    if (!validate(value)) {
                        isValid = false;
                        if (!firstError) firstError = message;
                        inputElement.classList.add('input-error');
                        const errorElement = document.getElementById(error);
                        if (errorElement) {
                            errorElement.style.display = 'block';
                        }
                    } else {
                        inputElement.classList.remove('input-error');
                        const errorElement = document.getElementById(error);
                        if (errorElement) {
                            errorElement.style.display = 'none';
                        }
                    }
                }
            });

            if (!isValid) {
                event.preventDefault();
                Swal.fire({
                    icon: 'error',
                    title: 'Error de validación',
                    text: firstError,
                    confirmButtonColor: '#d32f2f'
                });
                return;
            }else{
                Swal.fire({
                    icon: 'success',
                    title: 'Proveedor agregado correctamente',
                    text: 'El proveedor ha sido agregado correctamente',
                    timer: 3000,
                    timerProgressBar: true
                });
            }
        });
    }

    function resetForm() {
        if (proveedorForm) {
            proveedorForm.reset();
            validations.forEach(({ input, error }) => {
                const inputElement = document.getElementById(input);
                if (inputElement) {
                    inputElement.classList.remove('input-error');
                }
                const errorElement = document.getElementById(error);
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            });
        }
    }

    // =============================================
    // Funcionalidad de Búsqueda por Cédula
    // =============================================
    const searchInput = document.getElementById('search-input');
    const filtrarBtn = document.getElementById('filtrar-btn');
    const limpiarBtn = document.getElementById('limpiar-btn');
    const tableBody = document.querySelector('tbody');
    const allRows = tableBody ? Array.from(tableBody.querySelectorAll('tr')) : [];

    function normalizeCedula(cedula) {
        return cedula.replace(/[\s\-\.]/g, '').toUpperCase();
    }

    function isValidCedulaFormat(cedula) {
        const normalized = normalizeCedula(cedula);
        return /^[VJEP]\d{7,9}$/.test(normalized);
    }

    function formatCedula(cedula) {
        const normalized = normalizeCedula(cedula);
        if (normalized.length >= 8) {
            const letter = normalized.charAt(0);
            const numbers = normalized.slice(1);
            if (numbers.length === 8) {
                return `${letter}-${numbers}`;
            } else if (numbers.length === 9) {
                return `${letter}-${numbers.slice(0, 8)}-${numbers.slice(8)}`;
            }
        }
        return cedula;
    }

    function searchByCedula(searchTerm) {
        const normalizedSearch = normalizeCedula(searchTerm);
        let visibleRows = 0;

        allRows.forEach(row => {
            if (row.cells.length === 1 && row.cells[0].getAttribute('colspan')) return;

            const cedulaCell = row.cells[1];
            if (cedulaCell) {
                const cedulaText = normalizeCedula(cedulaCell.textContent);
                if (normalizedSearch === '' || cedulaText.includes(normalizedSearch)) {
                    row.style.display = '';
                    visibleRows++;
                    row.style.opacity = '0';
                    row.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        row.style.transition = 'all 0.3s ease';
                        row.style.opacity = '1';
                        row.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    row.style.display = 'none';
                }
            }
        });

        showNoResultsMessage(visibleRows === 0 && searchTerm !== '');
    }

    function showNoResultsMessage(show) {
        let noResultsRow = document.getElementById('no-results-row');
        if (show && !noResultsRow) {
            noResultsRow = document.createElement('tr');
            noResultsRow.id = 'no-results-row';
            noResultsRow.innerHTML = `
                <td colspan="9" class="no-results">
                    <i class="fas fa-search"></i>
                    No se encontraron proveedores con esa cédula
                </td>
            `;
            if (tableBody) {
                tableBody.appendChild(noResultsRow);
            }
        } else if (!show && noResultsRow) {
            noResultsRow.remove();
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const value = e.target.value.trim();
            if (value.length > 0 && !value.includes('-')) {
                const formatted = formatCedula(value);
                if (formatted !== value) {
                    e.target.value = formatted;
                }
            }
        });

        searchInput.addEventListener('blur', function(e) {
            const value = e.target.value.trim();
            if (value && !isValidCedulaFormat(value)) {
                e.target.style.borderColor = '#f56565';
                e.target.style.boxShadow = '0 0 0 3px rgba(245, 101, 101, 0.1)';
                showErrorTooltip(e.target, 'Formato de cédula inválido. Use: V-12345678 o J-12345678-9');
            } else {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = '';
                hideErrorTooltip();
            }
        });
    }

    function showErrorTooltip(element, message) {
        hideErrorTooltip();
        const tooltip = document.createElement('div');
        tooltip.id = 'error-tooltip';
        tooltip.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            ${message}
        `;
        tooltip.style.cssText = `
            position: absolute;
            background: #f56565;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-size: 0.8rem;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(245, 101, 101, 0.3);
            margin-top: 0.5rem;
            max-width: 250px;
        `;
        if (element && element.parentNode) {
            element.parentNode.style.position = 'relative';
            element.parentNode.appendChild(tooltip);
            setTimeout(hideErrorTooltip, 3000);
        }
    }

    function hideErrorTooltip() {
        const tooltip = document.getElementById('error-tooltip');
        if (tooltip) tooltip.remove();
    }

    if (filtrarBtn) {
        filtrarBtn.addEventListener('click', function() {
            const searchTerm = searchInput ? searchInput.value.trim() : '';
            if (searchTerm && !isValidCedulaFormat(searchTerm)) {
                if (searchInput) {
                    searchInput.focus();
                    showErrorTooltip(searchInput, 'Por favor, ingrese una cédula válida');
                }
                return;
            }
            filtrarBtn.classList.add('loading');
            filtrarBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
            setTimeout(() => {
                searchByCedula(searchTerm);
                filtrarBtn.classList.remove('loading');
                filtrarBtn.innerHTML = '<i class="fas fa-search"></i> Filtrar';
            }, 500);
        });
    }

    if (limpiarBtn) {
        limpiarBtn.addEventListener('click', function() {
            if (searchInput) {
                searchInput.value = '';
                searchInput.style.borderColor = '#e2e8f0';
                searchInput.style.boxShadow = '';
            }
            hideErrorTooltip();
            allRows.forEach(row => {
                row.style.display = '';
                row.style.opacity = '1';
                row.style.transform = 'translateY(0)';
            });
            showNoResultsMessage(false);
            if (searchInput) searchInput.focus();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && filtrarBtn) {
                filtrarBtn.click();
            }
        });

        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && limpiarBtn) {
                limpiarBtn.click();
            }
        });
    }
});
