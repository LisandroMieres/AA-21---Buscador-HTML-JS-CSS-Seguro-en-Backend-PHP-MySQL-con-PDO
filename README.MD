# 🛒 Módulo de Gestión de Productos — PHP + PDO + JavaScript Vanilla

Módulo backend seguro desarrollado en **PHP** con **PDO y Consultas Preparadas**, integrado con un frontend dinámico en **JavaScript Vanilla** usando `fetch` para consumir una API REST.

Este proyecto fue desarrollado como entregable académico para la materia **Paradigmas de Programación**, con foco en:

- Seguridad en el acceso a datos (prevención de **SQL Injection**).
- Separación de responsabilidades entre frontend y backend.
- Modelo **petición/respuesta HTTP** con API REST en JSON.
- Validación y sanitización de datos en el servidor.

---

## 📁 Estructura del proyecto

proyecto/
├── config/
│ └── database.php # Conexión PDO segura (singleton)
├── api/
│ └── productos.php # API REST: GET, POST, PUT, DELETE
├── js/
│ └── app.js # Lógica frontend con fetch
├── sql/
│ └── schema.sql # Creación de base de datos y datos de ejemplo
├── index.html # Interfaz de usuario
└── README.md


---

## 🚀 Tecnologías utilizadas

| Capa         | Tecnología                              |
|--------------|------------------------------------------|
| Backend      | PHP 8+ con PDO                           |
| Base de datos| MySQL / MariaDB (InnoDB, utf8mb4)        |
| Frontend     | HTML5, CSS3, JavaScript Vanilla (ES2020) |
| Comunicación | API REST en JSON sobre HTTP              |

---

## ⚙️ Requisitos previos

- PHP **8.0** o superior con extensiones `pdo` y `pdo_mysql` habilitadas.
- MySQL **5.7+** o MariaDB **10.4+**.
- Un servidor web (Apache, Nginx) o el servidor embebido de PHP.
- Navegador moderno con soporte para `fetch`.

Verificar extensiones de PHP:

```bash
php -m | grep -i pdo
