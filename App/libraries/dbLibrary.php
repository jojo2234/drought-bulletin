<?php

function openDB($database, $password, $username, $servername){
    //Apre una connesione con il database mysql
    $conn = mysqli_connect($servername, $username, $password, $database); 
    if (!$conn) die("Connection failed: ".mysqli_connect_error());
       return $conn;
}

function select($conn,$sql){
    //Interroga il database
    $resultSet = mysqli_query($conn, $sql);
    if(!$resultSet) print("Errore esecuzione $sql:" . mysqli_error());
    while($rec=mysqli_fetch_assoc($resultSet)) $records[]=$rec;
    mysqli_free_result($resultSet);
    return $records;
}

function closeDB ($conn){
    //Chiudo connessione con il DB
    mysqli_close($conn);
 }

?>