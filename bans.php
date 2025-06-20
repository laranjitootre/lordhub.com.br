<?php
// Configuração do banco de dados
$host = "localhost";
$user = "seu_usuario";
$password = "sua_senha";
$database = "seu_banco";

// Conectar ao MySQL
$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}

// Consulta para obter os banimentos
$sql = "SELECT player, banned_by, reason, ban_date, unban_date FROM bans ORDER BY ban_date DESC";
$result = $conn->query($sql);

// HTML para exibir a lista
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Lista de Banimentos</title>
    <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
    </style>
</head>
<body>
    <h2>Lista de Jogadores Banidos</h2>
    <table>
        <tr>
            <th>Jogador</th>
            <th>Banido Por</th>
            <th>Motivo</th>
            <th>Data do Ban</th>
            <th>Data de Desban</th>
        </tr>
        <?php
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . htmlspecialchars($row["player"]) . "</td>";
                echo "<td>" . htmlspecialchars($row["banned_by"]) . "</td>";
                echo "<td>" . htmlspecialchars($row["reason"]) . "</td>";
                echo "<td>" . $row["ban_date"] . "</td>";
                echo "<td>" . ($row["unban_date"] ? $row["unban_date"] : "Permanente") . "</td>";
                echo "</tr>";
            }
        } else {
            echo "<tr><td colspan='5'>Nenhum banimento registrado.</td></tr>";
        }
        $conn->close();
        ?>
    </table>
</body>
</html>