<?php
include('../php/funzioni.php');
header("Content-type: application/json");

//$funForQry = analizza_GET("funzione");

/**Uno switch gestisce tutte le richieste GET ed effettua la query, la forma di una richiesta è funzione=NUM&nomeParametro=[DATO]
 *La funzione esegui_query che effettua la connessione con il database si trova in funzioni.php
 */
//echo json_encode(array("funzione"=>$_GET["funzione"],"mese"=>$_GET["mese"],"data"=>$_GET["data"]));
//exit(1);

switch($_GET["funzione"]){
	case '1':
		$data = $_GET["data"];
		$sql = "SELECT DISTINCT mese FROM spi WHERE data='".$data."';";
		$campi = array('mese' => 'intval');
	break;
	case '2':
	//Ritorna ID poligoni delle celle e valori SPI delle cellem per la data e il mese (in realtà il numero indica i mesi da prendere su cui viene fatta l'analisi) indicato
	$data = $_GET["data"];
	$mese = $_GET["mese"];
	$sql = "SELECT celle.Id AS ID, Poligono, Centroide, SPI FROM celle JOIN spi ON ID_Cella = celle.Id WHERE Mese=".$mese." AND Data='".$data."';";
	$campi = array('ID' => 'intval','Poligono'=>'utf8_encode','Centroide'=>'utf8_encode','SPI'=>'floatval');
	break;
	case '3':
	//Riporta le date disponibili per i mesi selezionati
	$sql = "SELECT DISTINCT data FROM spi ORDER BY data DESC";
	$campi = array('data' => 'utf8_encode');
	break;
	default:
	echo json_encode(array(	"status" => "error","dettagli" => "parametro mancante"));exit(1);
	break;
}
echo esegui_query($sql, $campi);
?>