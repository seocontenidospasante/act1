document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    // --- REGISTRO DE USUARIO ---
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('regNombre').value.trim();
            const email = document.getElementById('regEmail').value.trim().toLowerCase();
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            const messageBox = document.getElementById('registerMessage');

            if (password !== confirmPassword) {
                showMessage(messageBox, 'Las contraseñas no coinciden.', 'error');
                return;
            }

            // Obtener usuarios existentes
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Verificar si el usuario ya existe
            const userExists = users.some(u => u.email === email);
            if (userExists) {
                showMessage(messageBox, 'El correo electrónico ya está registrado.', 'error');
                return;
            }

            // Registrar nuevo usuario
            const newUser = { nombre, email, password };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            showMessage(messageBox, '¡Usuario registrado con éxito! Redirigiendo...', 'success');

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        });
    }

    // --- INICIO DE SESIÓN ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value.trim().toLowerCase();
            const password = document.getElementById('loginPassword').value;
            const messageBox = document.getElementById('loginMessage');

            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Buscar usuario
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                showMessage(messageBox, `¡Bienvenido/a, ${user.nombre}! Redirigiendo...`, 'success');

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showMessage(messageBox, 'Correo o contraseña incorrectos.', 'error');
            }
        });
    }

    function showMessage(element, text, type) {
        element.textContent = text;
        element.className = `form-message ${type}`;
    }
});