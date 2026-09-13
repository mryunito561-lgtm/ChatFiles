# ChatFiles v2 — chats por tipo y acceso obligatorio

Esta versión cambia el concepto del chat para que **no existan bots ni personas ficticias en la interfaz**.

## Tipos de chat
- 🌐 Global: todos los usuarios que tengan una sesión iniciada.
- 👥 Amigos: solo amigos aceptados.
- 🔒 Privados: conversaciones 1 a 1.
- 👨‍👩‍👧 Grupos: conversaciones con varios usuarios.

## Acceso
La aplicación muestra primero el inicio de sesión. El prototipo simula el código de verificación por email: **123456**.

## Importante
Es un prototipo frontend. Para que sea una plataforma real hay que conectar autenticación, base de datos, sesiones, usuarios online, amigos, grupos, permisos y almacenamiento de archivos en un backend. Los usuarios del chat global no deben venir de datos falsos: deben proceder de cuentas autenticadas en la base de datos.
