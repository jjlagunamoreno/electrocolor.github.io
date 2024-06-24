<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $asunto = $_POST['asunto'];
    $email = $_POST['email'];
    $mensaje = $_POST['mensaje'];
    
    $to = "info@electrocolor.net";// Dirección del correo destino
    $cc = "soporteweb@electrocolor.net"; // Dirección en copia
    $subject = "Nuevo Mensaje Landing: " . $asunto;
    $body = "Email: " . $email . "\n\nMensaje:\n" . $mensaje;
    $headers = "From: " . $email . "\r\n";
    $headers .= "CC: " . $cc;

    if (mail($to, $subject, $body, $headers)) {
        $status = "success";
    } else {
        $status = "error";
    }

    header("Location: contacto.html?status=" . $status);
    exit();
}
?>
