<?php
declare(strict_types=1);

/**
 * Devuelve una única instancia de PDO configurada de forma segura.
 * - ERRMODE_EXCEPTION: los errores lanzan excepciones, no warnings silenciosos.
 * - FETCH_ASSOC: devuelve arrays asociativos.
 * - EMULATE_PREPARES = false: obliga a usar prepares nativos del motor,
 *   lo que refuerza la separación entre SQL y datos.
 */
function getPDO(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $host    = '127.0.0.1';
        $db      = 'tienda';
        $user    = 'root';
        $pass    = '';
        $charset = 'utf8mb4';

        $dsn = "mysql:host=$host;dbname=$db;charset=$charset";

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $pdo = new PDO($dsn, $user, $pass, $options);
        } catch (PDOException $e) {
            // No exponer detalles internos al cliente.
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Error interno de conexión']);
            exit;
        }
    }

    return $pdo;
}