document.addEventListener('DOMContentLoaded', () => {
    // 1. Crear un Administrador por defecto si no existen usuarios
    initAdmin();

    const loginForm = document.getElementById('loginForm');
    const userForm = document.getElementById('userForm');

    // --- INICIO DE SESIÓN ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value.trim().toLowerCase();
            const password = document.getElementById('loginPassword').value;
            const messageBox = document.getElementById('loginMessage');

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                showMessage(messageBox, `¡Bienvenido, ${user.nombre}! Redirigiendo...`, 'success');

                setTimeout(() => {
                    if (user.role === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 1200);
            } else {
                showMessage(messageBox, 'Correo o contraseña incorrectos.', 'error');
            }
        });
    }

    // --- PANEL DE ADMINISTRACIÓN (CRUD) ---
    if (window.location.pathname.includes('admin.html')) {
        checkAdminSession();
        renderUserList();

        // Crear o Editar usuario desde el Admin
        if (userForm) {
            userForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const userId = document.getElementById('userId').value;
                const nombre = document.getElementById('userNombre').value.trim();
                const email = document.getElementById('userEmail').value.trim().toLowerCase();
                const password = document.getElementById('userPassword').value;
                const role = document.getElementById('userRole').value;
                const messageBox = document.getElementById('adminMessage');

                let users = JSON.parse(localStorage.getItem('users')) || [];

                if (userId) {
                    // MODO EDITAR
                    const index = users.findIndex(u => u.id === userId);
                    if (index !== -1) {
                        users[index].nombre = nombre;
                        users[index].email = email;
                        if (password) users[index].password = password; // Solo actualiza si se escribe algo
                        users[index].role = role;

                        localStorage.setItem('users', JSON.stringify(users));
                        showMessage(messageBox, 'Usuario actualizado correctamente.', 'success');
                    }
                } else {
                    // MODO CREAR
                    const exists = users.some(u => u.email === email);
                    if (exists) {
                        showMessage(messageBox, 'El correo ya está en uso.', 'error');
                        return;
                    }

                    const newUser = {
                        id: Date.now().toString(),
                        nombre,
                        email,
                        password,
                        role
                    };

                    users.push(newUser);
                    localStorage.setItem('users', JSON.stringify(users));
                    showMessage(messageBox, 'Usuario creado con éxito.', 'success');
                }

                resetAdminForm();
                renderUserList();
            });
        }
    }
});

// Inicializar Administrador Por Defecto
function initAdmin() {
    let users = JSON.parse(localStorage.getItem('users'));
    if (!users || users.length === 0) {
        const defaultAdmin = [{
            id: '1',
            nombre: 'Administrador Principal',
            email: 'admin@admin.com',
            password: 'admin123',
            role: 'admin'
        }];
        localStorage.setItem('users', JSON.stringify(defaultAdmin));
    }
}

// Verificar que solo un Admin acceda a admin.html
function checkAdminSession() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
    }
}

// Cargar la lista de usuarios en la tabla (READ)
function renderUserList() {
    const tableBody = document.getElementById('usersTableBody');
    if (!tableBody) return;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    tableBody.innerHTML = '';

    users.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${u.nombre}</td>
            <td>${u.email}</td>
            <td><span class="badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}">${u.role}</span></td>
            <td>
                <button onclick="editUser('${u.id}')" class="btn-action btn-edit">Editar</button>
                <button onclick="deleteUser('${u.id}')" class="btn-action btn-danger">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// Cargar datos en el formulario para modificar (UPDATE)
window.editUser = function(id) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === id);

    if (user) {
        document.getElementById('userId').value = user.id;
        document.getElementById('userNombre').value = user.nombre;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userPassword').value = ''; // Opcional cambiar
        document.getElementById('userPassword').placeholder = 'Dejar en blanco para mantener la actual';
        document.getElementById('userRole').value = user.role;

        document.getElementById('formTitle').textContent = 'Editar Usuario';
        document.getElementById('btnSubmitForm').textContent = 'Guardar Cambios';
        document.getElementById('btnCancelEdit').style.display = 'inline-block';
    }
};

// Cancelar modo edición
window.cancelEdit = function() {
    resetAdminForm();
};

function resetAdminForm() {
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('formTitle').textContent = 'Crear Nuevo Usuario';
    document.getElementById('btnSubmitForm').textContent = 'Crear Usuario';
    document.getElementById('userPassword').placeholder = '••••••••';
    document.getElementById('btnCancelEdit').style.display = 'none';
}

// Eliminar usuario (DELETE)
window.deleteUser = function(id) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.id === id) {
        alert('No puedes eliminar tu propia cuenta mientras estás logueado.');
        return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(u => u.id !== id);
        localStorage.setItem('users', JSON.stringify(users));
        renderUserList();
    }
};

// Cerrar sesión
window.logout = function() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
};

function showMessage(element, text, type) {
    if (!element) return;
    element.textContent = text;
    element.className = `form-message ${type}`;
}