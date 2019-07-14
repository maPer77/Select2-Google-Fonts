<?
session_start();
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header('Access-Control-Allow-Origin: *'); 

$targetDir = "./fonts/";
// Create target dir
if (!file_exists($targetDir)) @mkdir($targetDir);

$fonteNome = $_POST['fonteNome'];
$fonteVariante = $_POST['fonteVariante'];
//$arquivoDestino = $targetDir . "/fonteTMP.ttf";
$arquivoDestino = $targetDir . "/" . $fonteNome . "-" . $fonteVariante . ".ttf";
$fonteFile = $_POST['fonteFile'];
$download =  file_get_contents($fonteFile);
$arquivoDestino = fopen($arquivoDestino, 'w');
fwrite($arquivoDestino, $download);
fclose($arquivoDestino);
?>