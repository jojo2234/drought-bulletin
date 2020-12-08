<?php
include('../php/funzioni.php');
header("Content-type: application/json");

$funForQry = analizza_GET("funzione");

/**Uno switch gestisce tutte le richieste GET ed effettua la query, la forma di una richiesta è funzione=NUM:[DATO] cioè 
 * un numero corrisponende alla query richiesta e un possibile campo opzionale di dati come anni valori o id.
 * Lo split viene effettuato in analizza_GET che si trova in funzioni.php così come la funzione esegui_query che effettua la connessione con il database*/
switch($funForQry[0]){
	case '1':
	//Richiesta per anno della % di popolazione con accesso ad acqua potabile, il dato viene inserito nel mappa mondo e le nazioni vengono colorate di conseguenza
	$sql = "SELECT ID, NomeNazione, Sigla, PPConAcquaPotabile FROM nazioni JOIN pp_acqua_potabile WHERE nazioni.ID = pp_acqua_potabile.ID_Nazione AND anno = " . $funForQry[1];
	$campi = array('ID' => 'intval', 'NomeNazione' => 'utf8_encode', 'Sigla' => 'utf8_encode', 'PPConAcquaPotabile' => 'floatval');
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
	case '4':
	//Riporta le provincie in base alla regione per riempire le select
	$sql = 'SELECT DISTINCT NomeProvincia FROM provincie JOIN regioni WHERE ID_Regione = (SELECT ID FROM regioni WHERE NomeRegione = "' . $funForQry[1] . '")';
	$campi = array('NomeProvincia' => 'utf8_encode');
	break;
	case '5':
	//Riporta il comune in base alla provincia più l'id per poter velocizzare le query successive
	$sql = 'SELECT DISTINCT NomeComune, comuni.ID FROM comuni JOIN provincie WHERE ID_Provincia = (SELECT ID FROM provincie WHERE NomeProvincia = "' . $funForQry[1] . '")';
	$campi = array('NomeComune' => 'utf8_encode', 'ID' => 'intval');
	break;
	case '6':
	//Riporta l'anno, l'entrata e il consumo di acqua per regioni, in base al nome regione passato tramite GET come per le precedenti query
	$sql = 'SELECT entrate_acque_regioni.Anno, EntrataAcqua, ConsumoAcqua FROM entrate_acque_regioni JOIN uscite_acque_regioni ON entrate_acque_regioni.ID_Regione = uscite_acque_regioni.ID_Regione AND entrate_acque_regioni.Anno = uscite_acque_regioni.Anno WHERE entrate_acque_regioni.ID_Regione = ANY(SELECT ID FROM regioni WHERE NomeRegione = "' . $funForQry[1] . '")';
	$campi = array('Anno' => 'intval','EntrataAcqua' => 'intval','ConsumoAcqua' => 'intval');
	break;
	case '7':
	//Riporta la quantità di acqua potabile e la fonte da cui viene prelevata per le varie regioni in un dato anno
	$sql = 'SELECT DISTINCT ID_Regione, TipoFonte, SUM(Potabile) AS Potabile FROM acqua_potabile_regioni JOIN tipo_fonti ON (Fonte = tipo_fonti.ID) WHERE Anno = ' . $funForQry[1] . ' GROUP BY ID_Regione, acqua_potabile_regioni.Fonte';
	$campi = array('ID_Regione' => 'intval','TipoFonte' => 'utf8_encode','Potabile' => 'intval');
	break;
	case '8':
	//Riporta il consumo e le entrate di acqua in un comune scelto per l'anno 2015
	$sql = 'SELECT DISTINCT EntrataAcqua, ConsumoAcqua FROM entrate_acque_comuni JOIN comuni ON entrate_acque_comuni.ID_Comune = ' . $funForQry[1] . ' AND entrate_acque_comuni.Anno = 2015 JOIN uscite_acque_comuni ON uscite_acque_comuni.ID_Comune = entrate_acque_comuni.ID_Comune';
	$campi = array('EntrataAcqua' => 'intval','ConsumoAcqua' => 'intval');
	break;
	case '9':
	//Media dei valori query 1 durante gli anni, vengono mostrati nel secondo grafico
	$sql = 'SELECT Anno, AVG(PPConAcquaPotabile) AS Media FROM pp_acqua_potabile GROUP BY Anno';
	$campi = array('Anno' => 'intval','Media' => 'floatval');
	break;
	case '10':
	//Media dei consumi per l'italia
	$sql = 'SELECT Anno, AVG(ConsumoAcqua) AS Media FROM uscite_acque_regioni WHERE ConsumoAcqua <> 0 GROUP BY Anno';
	$campi = array('Anno' => 'intval','Media' => 'floatval');
	break;
	case '11':
	//Media dei consumi per l'italia
	$sql = 'SELECT Anno, AVG(EntrataAcqua) AS Media FROM entrate_acque_regioni WHERE EntrataAcqua <> 0 GROUP BY Anno';
	$campi = array('Anno' => 'intval','Media' => 'floatval');
	break;
	case '12':
	//Il comune col numero maggiore di consumi d'acqua potabile
	$sql = 'SELECT NomeComune, ConsumoAcqua FROM comuni JOIN uscite_acque_comuni ON ID = ID_Comune WHERE ID = (SELECT ID_Comune FROM uscite_acque_comuni WHERE ConsumoAcqua = (SELECT MAX(ConsumoAcqua) FROM uscite_acque_comuni));';
	$campi = array('NomeComune' => 'utf8_encode','ConsumoAcqua' => 'intval');
	break;
	default: 
	$sql = "SELECT * FROM Regioni";
	$campi = array('Id' => 'intval', 'NomeRegione' => 'utf8_encode', 'ID_Nazione' => 'intval');
	break;
}

echo esegui_query($sql, $campi);
?>