<?php

function analizza_GET($parametro)
{
	if(isset($_GET[$parametro]))
	{
		//SPLIT the in coming GET request in parameters example funzione=NUM:[Dati]
		$numFunzione = $_GET[$parametro];
		return explode(":", $numFunzione);
	}
	else
	{
		echo json_encode(
			array(	"status" => "error",
			"dettagli" => "parametro $parametro mancante") 
		);
		exit(1);
	}	
}

function esegui_query($sql, $campi)
{
	include('../api/config.php');
	$risultato = select($db,$sql);
	if($risultato != null){
		$return = array();
		//Esegue la query
		for($i = 0; $i < count($risultato); $i++)
		{
			foreach($campi as $chiave => $formato)
			{
				//Check reliability of the value and cast to the given format
				if(isset($risultato[$i][$chiave]))
					$risultato[$i][$chiave] = $formato($risultato[$i][$chiave]);
			}
			$return[] = $risultato[$i];
		}
		closeDB($db);
	}else{
		$return = null;
	}
	return json_encode($return);
}
?>
