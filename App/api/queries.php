<?php
include('../php/funzioni.php');
header("Content-type: application/json");

/**A switch handle all GET request, a request example is funzione=NUM&nomeParametro=[DATO]
 *The function esegui_query is in funzioni.php
 */

switch($_GET["funzione"]){
	case '1':
		$data = $_GET["data"];
		$sql = "SELECT DISTINCT mese FROM spi WHERE data='".$data."';";
		$campi = array('mese' => 'intval');
		break;
	case '2':
	//Return polygons id of cells and SPI values for the selected date and months that to tell the truth is the months to be taken before that date
		$data = $_GET["data"];
		$mese = $_GET["mese"];
		$sql = "SELECT celle.Id AS ID, Poligono, Centroide, SPI FROM celle JOIN spi ON ID_Cella = celle.Id WHERE Mese=".$mese." AND Data='".$data."';";
		$campi = array('ID' => 'intval','Poligono'=>'utf8_encode','Centroide'=>'utf8_encode','SPI'=>'floatval');
		break;
	case '3':
		$sql = "SELECT DISTINCT data FROM spi ORDER BY data DESC;"; //Show available dates for the selected months
		$campi = array('data' => 'utf8_encode');
		break;
	case '4':
		$sql = "SELECT Latitudine, Longitudine, Nome, ID FROM stazione;"; //Return the position of the pluviometric station
		$campi = array('Latitudine' => 'floatval', 'Longitudine' => 'floatval', 'Nome' => 'utf8_encode', 'ID' => 'intval');
		break;
	case '5':
		$sql = "SELECT Nome, QuotaDTM, ID_Distretto FROM stazione WHERE ID=".$_GET["id"].";"; //Return other information about the pluvio station
		$campi = array('Nome' => 'utf8_encode', 'QuotaDTM' => 'intval', 'ID_Distretto' => 'intval');
		break;
	case '6':
		$sql = "SELECT Data, Valore FROM precipitazionegiornaliera WHERE ID_Stazione=".$_GET["id"]." AND Data BETWEEN '".$_GET["st"]."' AND '".$_GET["fi"]."' ORDER BY Data DESC;";
		$campi = array('Data' => 'utf8_encode', 'Valore' => 'floatval'); //Return dates and values for the selected station in the selected date range
		break;
	case '7':
		$sql = "SELECT Anno, Valore FROM precipitazionemensile WHERE ID_Stazione=".$_GET["id"]." AND Mese=".$_GET["slm"].";";
		$campi = array('Anno' => 'intval', 'Valore' => 'floatval'); //Return all values in each available year for the selected month
		break;
	case '8':
		$sql = "SELECT Mese FROM precipitazionemensile WHERE ID_Stazione=".$_GET["id"].";";
		$campi = array('Mese' => 'intval'); //Return available months for the selected stations
		break;
	case '9':
		$sql = "SELECT Data FROM precipitazionegiornaliera WHERE ID_Stazione=".$_GET["id"]." ORDER BY Data DESC LIMIT 1;";
		$campi = array('Data' => 'utf8_encode'); //Return the max data available in precipitazionegiornaliera
		break;
	default:
	echo json_encode(array(	"status" => "error","dettagli" => "parametro mancante"));exit(1);
	break;
}
echo esegui_query($sql, $campi);
?>