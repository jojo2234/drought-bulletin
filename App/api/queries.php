<?php
include('../php/funzioni.php');
header("Content-type: application/json");

$funForQry = analizza_GET("funzione");

/**Uno switch gestisce tutte le richieste GET ed effettua la query, la forma di una richiesta è funzione=NUM:[DATO] cioè 
 * un numero corrisponende alla query richiesta e un possibile campo opzionale di dati come anni valori o id.
 * Lo split viene effettuato in analizza_GET che si trova in funzioni.php così come la funzione esegui_query che effettua la connessione con il database*/
switch($funForQry[0]){
	case '1':
	break;
	case '2':
	//Ritorna ID poligoni delle celle e valori SPI delle cellem per la data e il mese (in realtà il numero indica i mesi da prendere su cui viene fatta l'analisi) indicato
	$sql = "SELECT celle.Id AS ID, Poligono, SPI FROM celle JOIN spi ON ID_Cella = celle.Id WHERE Mese=".$funForQry[1]." AND Data='".$funForQry[2]."';";
	$campi = array('ID' => 'intval','Poligono'=>'utf8_encode','SPI'=>'floatval');
	break;
	case '3':
	//Riporta le date disponibili per i mesi selezionati
	$sql = "SELECT DISTINCT data FROM spi WHERE mese=".$funForQry[1];//".$funForQry['mse'];
	$campi = array('data' => 'utf8_encode');
	break;
	default: 
	break;
}

echo esegui_query($sql, $campi);
?>