document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const navLinks = document.querySelectorAll('.sidebar nav a');
    
    // Función para alternar sidebar
    function toggleSidebar() {
        sidebar.classList.toggle('show');
        document.body.classList.toggle('sidebar-open');
    }
    
    // Alternar sidebar desde los botones
    menuToggle?.addEventListener('click', toggleSidebar);
    sidebarToggle?.addEventListener('click', toggleSidebar);
    
    // Cerrar sidebar al hacer clic fuera en móviles
    document.addEventListener('click', function(e) {
        if(window.innerWidth <= 992 && 
            sidebar.classList.contains('show') && 
            !e.target.closest('.sidebar') && 
            !e.target.closest('.menu-toggle')) {
            toggleSidebar();
        }
    });
    
    // Manejar redimensionamiento de ventana
    window.addEventListener('resize', function() {
        if(window.innerWidth > 992) {
            sidebar.classList.remove('show');
            document.body.classList.remove('sidebar-open');
        }
    });
    
    // ===== NUEVA FUNCIONALIDAD: NAVEGACIÓN ACTIVA =====
    
    // Función para establecer elemento activo
    function setActiveNavItem(clickedLink) {
        // Remover clase active de todos los enlaces
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Agregar clase active al enlace clickeado
        clickedLink.classList.add('active');
        
        // Guardar en localStorage para persistir entre recargas
        const href = clickedLink.getAttribute('href');
        if (href) {
            localStorage.setItem('activeNavItem', href);
        }
    }
    
    // Agregar event listeners a todos los enlaces de navegación
    navLinks.forEach(link => {
        // Excluir el botón de salir
        if (!link.closest('.salir')) {
            link.addEventListener('click', function(e) {
                setActiveNavItem(this);
                
                // Cerrar sidebar en móviles después de hacer clic
                if (window.innerWidth <= 992) {
                    setTimeout(() => {
                        toggleSidebar();
                    }, 150); // Pequeño delay para mejor UX
                }
            });
        }
    });
    
    // Restaurar elemento activo al cargar la página
    function restoreActiveNavItem() {
        const savedActiveItem = localStorage.getItem('activeNavItem');
        
        if (savedActiveItem) {
            const activeLink = document.querySelector(`.sidebar nav a[href="${savedActiveItem}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        } else {
            // Si no hay elemento guardado, activar el primero (Dashboard)
            const firstLink = document.querySelector('.sidebar nav a:not(.salir a)');
            if (firstLink) {
                firstLink.classList.add('active');
            }
        }
    }
    
    // Detectar página actual basada en URL (opcional)
    function setActiveBasedOnURL() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Comparar con hash o pathname
            if ((currentHash && href === currentHash) || 
                (currentPath && href && currentPath.includes(href.replace('#', '')))) {
                link.classList.add('active');
            }
        });
    }
    
    // Inicializar navegación activa
    restoreActiveNavItem();
    
    // Opcional: También detectar basado en URL
    // setActiveBasedOnURL();
    
    // ===== FUNCIONALIDAD ADICIONAL: SMOOTH SCROLLING =====
    
    // Agregar smooth scrolling para enlaces internos
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            link.addEventListener('click', function(e) {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    });
    
    // ===== FUNCIONALIDAD ADICIONAL: INDICADOR DE CARGA =====
    
    // Mostrar indicador de carga al cambiar de sección
    function showLoadingIndicator() {
        const existingLoader = document.querySelector('.nav-loader');
        if (!existingLoader) {
            const loader = document.createElement('div');
            loader.className = 'nav-loader';
            loader.innerHTML = '<div class="nav-spinner"></div>';
            document.body.appendChild(loader);
            
            // Remover después de un tiempo
            setTimeout(() => {
                loader.remove();
            }, 500);
        }
    }
    
    // Agregar indicador de carga a los clics de navegación
    navLinks.forEach(link => {
        if (!link.closest('.salir')) {
            link.addEventListener('click', function() {
                showLoadingIndicator();
            });
        }
    });
});

// Mostrar/ocultar sidebar en móviles
document.querySelector('.menu-toggle')?.addEventListener('click', () => {
  document.querySelector('.sidebar')?.classList.toggle('show');
});

// Alternar sidebar en escritorio (si usas .sidebar-toggle)
document.querySelector('.sidebar-toggle')?.addEventListener('click', () => {
  document.querySelector('.sidebar')?.classList.toggle('collapsed');
});

document.addEventListener("DOMContentLoaded", function() {
    const toggleBtn = document.getElementById("menu-toggle");
    const sidebarToggleBtn = document.querySelector(".sidebar-toggle"); // El botón que está dentro del sidebar
    
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");
    const navbar = document.querySelector(".navbar");

    // Función para alternar el menú
    function toggleMenu() {
        sidebar.classList.toggle("collapsed");
        mainContent.classList.toggle("collapsed");
        navbar.classList.toggle("collapsed");
    }

    // Evento para el botón del Navbar
    if (toggleBtn) {
        toggleBtn.addEventListener("click", toggleMenu);
    }

    // Evento para el botón del Sidebar (móvil o interno)
    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener("click", toggleMenu);
    }
});