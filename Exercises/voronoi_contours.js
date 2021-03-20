function generaPoligono(listaPunti,vetAdiacenti){
    function ragr(vsp){
        var a = 7;
         switch(vsp){
                 case vsp>3:
                 a=0;
                 break;
                 case vsp>2:
                 a=1;
                 break;
                 case vsp>1.5:
                 a=2;
                 break;
                 case vsp>-1.5:
                 a=3;
                 break;
                 case vsp>-2:
                 a=4;
                 break;
                 case vsp>-3:
                 a=5;
                 break;
                 case vsp>-4:
                 a=6;
                 break;
                 default:
                 a=7;
                 break;
             }
         return a;
    }
    function voroDist(a, b) {
        var dx = b[0] - a[0];
        var dy = b[1] - a[1];
        return Math.sqrt(dx * dx + dy * dy); //Euclideo
    }
    
    var poligonoPR = '{"type":"FeatureCollection", "features":[';
    var distVet = new Array();
    var adiacenti = new Array();
    var confini = new Array();
    var PoligonoVet;
    for(i=0;i<listaPunti.length;i++){
        lng = listaPunti[i]["properties"]["lngCentroid"];
        lat = listaPunti[i]["properties"]["latCentroid"];
        grp = ragr(listaPunti[i]["properties"]["spi"]);
        distVet = new Array();
        for(j=0;j<listaPunti.length;j++){
            x=listaPunti[j]["properties"]["lngCentroid"];
            y=listaPunti[j]["properties"]["latCentroid"];
            g=ragr(listaPunti[j]["properties"]["spi"]);
            distVet[j] = [voroDist([lng,lat],[x,y]),x,y,g]; //Distanza,lng,lat,gruppoColore
        }
        distVet.sort(function(a, b){return a[0]-b[0]}); //Ordinamento crescente per distanze
        for(j=0;j<distVet.length;j++){
            if(j+1<distVet.length){
                if(distVet[j][0]==distVet[j+1][0]){
                    if(grp==distVet[j][3]){
                        //Adiacente ha lo stesso colore
                        adiacenti[j] = distVet[j];
                    }else{
                        //Adiacente è sul confine
                        confini[j] = distVet[j];
                    }
                }
            }
        }
        poligonoPR += '{"type":"Feature","geometry":{"type":"Polygon","coordinates":['+PoligonoVet+']},"properties":{"col":'+coloreGruppo+'}}';
    }
    poligonoPR += ']}';
}