// js/admin-barberos.js - Administración de Barberos

// Configuración de la API (ajusta según tu backend)
const API_BASE = '/api'; // Cambia esto por tu URL base

// Variables globales
let barberos = [];
let editingBarberoId = null;

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
  cargarBarberos();
  initEventListeners();
});

// Configurar event listeners
function initEventListeners() {
  // Formulario de barbero
  document.getElementById('barberoForm').addEventListener('submit', handleBarberoSubmit);
  
  // Modal events
  document.getElementById('barberoModal').addEventListener('hidden.bs.modal', resetForm);
  
  // Confirmación de eliminación
  document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
}

// Cargar barberos desde la base de datos
async function cargarBarberos() {
  try {
    showLoading(true);
    
    // Hacer petición a tu backend
    const response = await fetch(`${API_BASE}/barberos`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    barberos = await response.json();
    renderBarberosTable();
    
  } catch (error) {
    console.error('Error cargando barberos:', error);
    showAlert('error', 'Error al cargar los barberos: ' + error.message);
    // Mostrar tabla vacía en caso de error
    renderBarberosTable([]);
  } finally {
    showLoading(false);
  }
}

// Renderizar tabla de barberos
function renderBarberosTable(data = barberos) {
  const tbody = document.getElementById('barberosTableBody');
  
  if (data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted py-4">
          <i class="fas fa-users fa-2x mb-2 d-block"></i>
          No hay barberos registrados
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = data.map(barbero => `
    <tr>
      <td><strong>#${barbero.id}</strong></td>
      <td>
        <i class="fas fa-user me-2 text-primary"></i>
        ${barbero.nombre}
      </td>
      <td>
        ${barbero.especialidad ? 
          `<span class="badge bg-secondary">${barbero.especialidad}</span>` : 
          '<span class="text-muted">Sin especialidad</span>'
        }
      </td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1" onclick="editBarbero(${barbero.id})" title="Editar">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteBarbero(${barbero.id}, '${barbero.nombre}')" title="Eliminar">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// Manejar envío del formulario
async function handleBarberoSubmit(e) {
  e.preventDefault();
  
  const formData = {
    nombre: document.getElementById('barberoNombre').value.trim(),
    especialidad: document.getElementById('barberoEspecialidad').value || null
  };
  
  // Validaciones
  if (!formData.nombre) {
    showAlert('warning', 'El nombre es obligatorio');
    return;
  }
  
  if (formData.nombre.length > 100) {
    showAlert('warning', 'El nombre no puede tener más de 100 caracteres');
    return;
  }
  
  try {
    showSubmitLoading(true);
    
    let response;
    
    if (editingBarberoId) {
      // Actualizar barbero existente
      response = await fetch(`${API_BASE}/barberos/${editingBarberoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
    } else {
      // Crear nuevo barbero
      response = await fetch(`${API_BASE}/barberos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}`);
    }
    
    const result = await response.json();
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('barberoModal'));
    modal.hide();
    
    // Mostrar mensaje de éxito
    showAlert('success', editingBarberoId ? 'Barbero actualizado correctamente' : 'Barbero creado correctamente');
    
    // Recargar tabla
    await cargarBarberos();
    
  } catch (error) {
    console.error('Error guardando barbero:', error);
    showAlert('error', 'Error al guardar: ' + error.message);
  } finally {
    showSubmitLoading(false);
  }
}

// Editar barbero
function editBarbero(id) {
  const barbero = barberos.find(b => b.id === id);
  if (!barbero) {
    showAlert('error', 'Barbero no encontrado');
    return;
  }
  
  editingBarberoId = id;
  
  // Llenar formulario
  document.getElementById('barberoId').value = barbero.id;
  document.getElementById('barberoNombre').value = barbero.nombre;
  document.getElementById('barberoEspecialidad').value = barbero.especialidad || '';
  
  // Cambiar título del modal
  document.getElementById('barberoModalTitle').innerHTML = `
    <i class="fas fa-user-edit me-2"></i>
    Editar Barbero
  `;
  document.getElementById('barberoSubmitText').textContent = 'Actualizar';
  
  // Mostrar modal
  const modal = new bootstrap.Modal(document.getElementById('barberoModal'));
  modal.show();
}

// Eliminar barbero
function deleteBarbero(id, nombre) {
  editingBarberoId = id;
  document.getElementById('deleteBarberoName').textContent = nombre;
  
  const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
  modal.show();
}

// Confirmar eliminación
async function confirmDelete() {
  if (!editingBarberoId) return;
  
  try {
    const response = await fetch(`${API_BASE}/barberos/${editingBarberoId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}`);
    }
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
    modal.hide();
    
    // Mostrar mensaje de éxito
    showAlert('success', 'Barbero eliminado correctamente');
    
    // Recargar tabla
    await cargarBarberos();
    
  } catch (error) {
    console.error('Error eliminando barbero:', error);
    showAlert('error', 'Error al eliminar: ' + error.message);
  }
  
  editingBarberoId = null;
}

// Resetear formulario
function resetForm() {
  editingBarberoId = null;
  document.getElementById('barberoForm').reset();
  document.getElementById('barberoModalTitle').innerHTML = `
    <i class="fas fa-user-plus me-2"></i>
    Nuevo Barbero
  `;
  document.getElementById('barberoSubmitText').textContent = 'Guardar';
  
  // Limpiar errores de validación
  const inputs = document.querySelectorAll('#barberoModal .is-invalid');
  inputs.forEach(input => input.classList.remove('is-invalid'));
}

// Mostrar/ocultar loading en tabla
function showLoading(show) {
  const tbody = document.getElementById('barberosTableBody');
  if (show) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center py-4">
          <div class="spinner-border spinner-border-sm me-2" role="status"></div>
          Cargando barberos...
        </td>
      </tr>
    `;
  }
}

// Mostrar/ocultar loading en botón submit
function showSubmitLoading(show) {
  const submitBtn = document.querySelector('#barberoForm button[type="submit"]');
  const submitText = document.getElementById('barberoSubmitText');
  
  if (show) {
    submitBtn.disabled = true;
    submitText.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Guardando...';
  } else {
    submitBtn.disabled = false;
    submitText.textContent = editingBarberoId ? 'Actualizar' : 'Guardar';
  }
}

// Mostrar alertas
function showAlert(type, message) {
  const alertContainer = document.getElementById('alertContainer');
  const alertId = 'alert-' + Date.now();
  
  const alertClass = {
    'success': 'alert-success',
    'error': 'alert-danger',
    'warning': 'alert-warning',
    'info': 'alert-info'
  }[type] || 'alert-info';
  
  const icon = {
    'success': 'fas fa-check-circle',
    'error': 'fas fa-exclamation-circle',
    'warning': 'fas fa-exclamation-triangle',
    'info': 'fas fa-info-circle'
  }[type] || 'fas fa-info-circle';
  
  const alertHTML = `
    <div class="alert ${alertClass} alert-dismissible fade show" role="alert" id="${alertId}">
      <i class="${icon} me-2"></i>
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
  
  alertContainer.insertAdjacentHTML('beforeend', alertHTML);
  
  // Auto-eliminar después de 5 segundos
  setTimeout(() => {
    const alertElement = document.getElementById(alertId);
    if (alertElement) {
      const alert = bootstrap.Alert.getOrCreateInstance(alertElement);
      alert.close();
    }
  }, 5000);
}

// Funciones para conectar con el backend
/* 
ENDPOINTS QUE NECESITAS CREAR EN TU BACKEND:

GET /api/barberos
- Devuelve: Array de objetos { id, nombre, especialidad }

POST /api/barberos
- Recibe: { nombre, especialidad }
- Devuelve: { id, nombre, especialidad, message }

PUT /api/barberos/:id
- Recibe: { nombre, especialidad }
- Devuelve: { id, nombre, especialidad, message }

DELETE /api/barberos/:id
- Devuelve: { message }

Ejemplo de respuesta exitosa:
{
  "id": 1,
  "nombre": "Carlos Mendez",
  "especialidad": "Corte clásico",
  "message": "Barbero creado correctamente"
}

Ejemplo de respuesta de error:
{
  "error": true,
  "message": "El nombre es obligatorio"
}
*/