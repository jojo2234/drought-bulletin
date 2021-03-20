var datiexcsv = new Array();
        /*for(i=0;i<tmpJSON["features"].length;i++){
            grp = setGrp(tmpJSON["features"][i]["properties"]["spi"]); //.toFixed(2)
            datiexcsv[i] = ([{'x':tmpJSON["features"][i]["properties"]["lngCentroid"].toFixed(2),'y':tmpJSON["features"][i]["properties"]["latCentroid"].toFixed(2),'group':grp}]);
        }*/
        //document.getElementsByTagName("svg")[0]; //svg della mappa
        //document.getElementsByTagName("svg")[0].childNodes[0].childElementCount; //All'interno di g ci sono tutti i path delle celle
        var poCen = '{"type":"FeatureCollection", "features":[';
        poCen += '{"type":"Feature","geometry":{"type":"Point","coordinates":['+tmpJSON["features"][0]["properties"]["lngCentroid"]+','+tmpJSON["features"][0]["properties"]["latCentroid"]+']},"properties":{"spi":'+tmpJSON["features"][0]["properties"]["spi"]+'}}';
        for (i = 1; i < tmpJSON["features"].length; i++) {
            poCen += ',{"type":"Feature","geometry":{"type":"Point","coordinates":['+tmpJSON["features"][i]["properties"]["lngCentroid"]+','+tmpJSON["features"][i]["properties"]["latCentroid"]+']},"properties":{"spi":'+tmpJSON["features"][i]["properties"]["spi"]+'}}';
        }
        poCen += ']}';
        /**
         * 1)Interpolare i punti (le coordinate vanno trattate come x e y in un grafico) trovare una funzione buona opterei per quella razionale
         * 2)Interpolazione deve avvenire solo per i punti adiacenti tra loro con il valore SPI nello stesso range
         * 3)Generare dei punti intermedi per tracciare il confine del poligono che viene trattato come una cella da leaflet
         * 4)I punti del poligono vanno inseriti in un array [[[valoriX,varoriY],[valoriX,valoriY]]]
         * 5) Quindi a leaflet va passato il poligono che sarebbe l'array
        */
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
       var minX=0,maxX=100;//Min e max vanno cambiati in base ai valori in questo caso non ci sono coordinate a 0 o a 100
       var minY=0,maxY=100;
       var q,w,s,grp,lng,lat;
       var clrVet = [[],[],[],[],[],[],[],[]];
       var vetP = tmpJSON["features"];
       var regions = new Array();
       var x = new Array();
       var adia = new Array();
     //  var poligonoPR = '{"type":"FeatureCollection", "features":[';
    //poligonoPR += '{"type":"Feature","geometry":{"type":"Polygon","coordinates":['+tmpJSON["features"][0]["properties"]["lngCentroid"]+','+tmpJSON["features"][0]["properties"]["latCentroid"]+']},"properties":{"col":'+tmpJSON["features"][0]["properties"]["spi"]+'}}';
       for(i=0;i<tmpJSON["features"].length;i++){
            lng = tmpJSON["features"][i]["properties"]["lngCentroid"];
            lat = tmpJSON["features"][i]["properties"]["latCentroid"];
            x = new Array();
            for(j=0;j<vetP.length;j++){
                q=vetP[j]["properties"]["lngCentroid"];
                w=vetP[i]["properties"]["latCentroid"];
                s=vetP[i]["properties"]["spi"];
                x[j]=[voroDist([lng,lat],[q,w]),q,w,s];//Vettore di distanza,latitudine,longitudine,spiVal
            }
            x.sort(function(a, b){return a[0]-b[0]});//Ordino le distanze in modo crescente da 1 a N
            grp = ragr(s); 
            for(j=1;j<=x.length;j++){ //Prendo le minime tutte uguali e le salvo in vettore chiamato adia
                if(x[j][0]==x[j-1][0] || j==x.length){
                    if(grp == ragr(x[j-1][3])){
                        //I punti sono adiacenti allora inizia generare un poligono
                        adia[j-1]=x[j-1];
                    }else{
                        //Il punto adiacente è di un altro colore
                        //Quindi rappresenta il confine
                    }
                }
            }
            vetP.splice(i,1);//Rimuove l'elemento in posizione i
            //regions[i].push([lng,lat]);

            //clrVet[ragr(vetP[i]["properties"]["spi"])].push(regions[i]);
       } 
       /*for(i=0;i<tmpJSON["features"].length;i++){
            lng=tmpJSON["features"][i]["properties"]["lngCentroid"];
            lat=tmpJSON["features"][i]["properties"]["latCentroid"];
            clrVet[ragr(tmpJSON["features"][i]["properties"]["spi"])].push([lng,lat]);
            for(j=0;j<tmpJSON["features"].length;j++){
                
            }
       }*/

       /*
       if(tmpJSON["features"][j]["properties"]["lngCentroid"]<lng){
                    if(tmpJSON["features"][j]["properties"]["lngCentroid"]>minX){
                        //La x deve essere la minore tra le maggiori e la maggiore tra le minori rispetto al punto
                        minX=tmpJSON["features"][j]["properties"]["lngCentroid"];//Non va bene devo poter individure il punto più vicino x e y
                        //non x e y separate sono una tupla unita la tupla più vicina.
                    }
                }
                if(tmpJSON["features"][j]["properties"]["lngCentroid"]>lng){
                    if(tmpJSON["features"][j]["properties"]["lngCentroid"]<maxX){
                        maxX=tmpJSON["features"][j]["properties"]["lngCentroid"];
                    }
                }
                if(tmpJSON["features"][j]["properties"]["latCentroid"]<lng){
                    if(tmpJSON["features"][j]["properties"]["latCentroid"]>minY){
                        minY=tmpJSON["features"][j]["properties"]["latCentroid"];
                    }
                }
                if(tmpJSON["features"][j]["properties"]["latCentroid"]>lng){
                    if(tmpJSON["features"][j]["properties"]["latCentroid"]<maxY){
                        maxY=tmpJSON["features"][j]["properties"]["latCentroid"];
                    }
                }
       */
       /*var clrVet = [[],[],[],[],[],[],[],[]];
       var a=0, b=0, c=0, d=0, e=0, f=0, g=0, h=0;
        for(i=0;i<tmpJSON["features"].length;i++){
            switch(sVl = tmpJSON["features"][i]["properties"]["spi"]){
                case sVl>3:
                clrVet[0][a]=[tmpJSON["features"][i]["properties"]["lngCentroid"],tmpJSON["features"][i]["properties"]["latCentroid"]];
                a++;
                break;
                case sVl>2:
                clrVet[1][b]=[tmpJSON["features"][i]["properties"]["lngCentroid"],tmpJSON["features"][i]["properties"]["latCentroid"]];
                b++;
                break;
                case sVl>1.5:
                clrVet[2][c]=[tmpJSON["features"][i]["properties"]["lngCentroid"],tmpJSON["features"][i]["properties"]["latCentroid"]];
                c++;
                break;
                case sVl>-1.5:
                clrVet[3][d]=[tmpJSON["features"][i]["properties"]["lngCentroid"],tmpJSON["features"][i]["properties"]["latCentroid"]];
                d++;
                break;
                case sVl>-2:
                clrVet[4][e]=[tmpJSON["features"][i]["properties"]["lngCentroid"],tmpJSON["features"][i]["properties"]["latCentroid"]];
                e++;
                break;
                case sVl>-3:
                clrVet[5][f]=[tmpJSON["features"][i]["properties"]["lngCentroid"],tmpJSON["features"][i]["properties"]["latCentroid"]];
                f++;
                break;
                case sVl>-4:
                clrVet[6][g]=[tmpJSON["features"][i]["properties"]["lngCentroid"],tmpJSON["features"][i]["properties"]["latCentroid"]];
                g++;
                break;
                default:
                clrVet[7][h]=[tmpJSON["features"][i]["properties"]["lngCentroid"],tmpJSON["features"][i]["properties"]["latCentroid"]];
                h++;
                break;
            }
            //datiexcsv[i] = ([{'x':tmpJSON["features"][i]["properties"]["lngCentroid"].toFixed(2),'y':tmpJSON["features"][i]["properties"]["latCentroid"].toFixed(2),'group':grp}]);
        }*/
        function getColor(d) {
            return d > 3 ? SPIcol[0] : //nero
                d > 2 ? SPIcol[1] : //blu
                    d > 1.5 ? SPIcol[2] : //verde
                        d > -1.5 ? SPIcol[3] : //Grigio chiaro
                            d > -2 ? SPIcol[4] ://arancione
                                d > -3 ? SPIcol[5] : //rosso
                                    d > -4 ? SPIcol[6] : //rosso scuro o marrone
                                        SPIcol[7];//Anomalo
        }
        /**
         *With this function colors are shown.
            **/
        function style(feature) {
            return {
                fillColor: getColor(feature.properties.spi),
                weight: 1,
                opacity: opacLay,
                color: getColor(feature.properties.spi),
                dashArray: '1',
                fillOpacity: opacLay
            };
        }
        function edgesOfTriangle(t) { return [3 * t, 3 * t + 1, 3 * t + 2]; }
            function triangleOfEdge(e)  { return Math.floor(e / 3); }
            function nextHalfedge(e) { return (e % 3 === 2) ? e - 2 : e + 1; }
            function prevHalfedge(e) { return (e % 3 === 0) ? e + 2 : e - 1; }
            function pointsOfTriangle(delaunay, t) {
                return edgesOfTriangle(t)
                    .map(e => delaunay.triangles[e]);
            }

            function forEachTriangle(points, delaunay, callback) {
                for (let t = 0; t < delaunay.triangles.length / 3; t++) {
                    callback(t, pointsOfTriangle(delaunay, t).map(p => points[p]));
                }
            }
            function triangleOfEdge(e)  { return Math.floor(e / 3); }

            function trianglesAdjacentToTriangle(delaunay, t) {
                const adjacentTriangles = [];
                for (const e of edgesOfTriangle(t)) {
                    const opposite = delaunay.halfedges[e];
                    if (opposite >= 0) {
                        adjacentTriangles.push(triangleOfEdge(opposite));
                    }
                }
                return adjacentTriangles;
            }
            function forEachTriangleEdge(points, delaunay, callback) {
                for (let e = 0; e < delaunay.triangles.length; e++) {
                    if (e > delaunay.halfedges[e]) {
                        const p = points[delaunay.triangles[e]];
                        const q = points[delaunay.triangles[nextHalfedge(e)]];
                        callback(e, p, q);
                    }
                }
            }
            function circumcenter(a, b, c) {
                const ad = a[0] * a[0] + a[1] * a[1];
                const bd = b[0] * b[0] + b[1] * b[1];
                const cd = c[0] * c[0] + c[1] * c[1];
                const D = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]));
                return [
                    1 / D * (ad * (b[1] - c[1]) + bd * (c[1] - a[1]) + cd * (a[1] - b[1])),
                    1 / D * (ad * (c[0] - b[0]) + bd * (a[0] - c[0]) + cd * (b[0] - a[0])),
                ];
            }
            function triangleCenter(points, delaunay, t) {
                const vertices = pointsOfTriangle(delaunay, t).map(p => points[p]);
                return circumcenter(vertices[0], vertices[1], vertices[2]);
            }
            function forEachVoronoiEdge(points, delaunay, callback) {
                for (let e = 0; e < delaunay.triangles.length; e++) {
                    if (e < delaunay.halfedges[e]) {
                        const p = triangleCenter(points, delaunay, triangleOfEdge(e));
                        const q = triangleCenter(points, delaunay, triangleOfEdge(delaunay.halfedges[e]));
                        callback(e, p, q);
                    }
                }
            }
            function edgesAroundPoint(delaunay, start) {
                const result = [];
                let incoming = start;
                do {
                    result.push(incoming);
                    const outgoing = nextHalfedge(incoming);
                    incoming = delaunay.halfedges[outgoing];
                } while (incoming !== -1 && incoming !== start);
                return result;
            }
            function forEachVoronoiCell(points, delaunay, callback) {
                const index = new Map(); // point id to half-edge id
                for (let e = 0; e < delaunay.triangles.length; e++) {
                    const endpoint = delaunay.triangles[nextHalfedge(e)];
                    if (!index.has(endpoint) || delaunay.halfedges[e] === -1) {
                        index.set(endpoint, e);
                    }
                }
                for (let p = 0; p < points.length; p++) {
                    const incoming = index.get(p);
                    const edges = edgesAroundPoint(delaunay, incoming);
                    const triangles = edges.map(triangleOfEdge);
                    const vertices = triangles.map(t => triangleCenter(points, delaunay, t));
                    callback(p, vertices);
                }
            }
            function voronoiSvg(points, delaunay) {
                //const results = ['<g class="edges">'];
                var coords = new Array();
                for (let e = 0; e < delaunay.halfedges.length; e++) {
                    if (e < delaunay.halfedges[e]) {
                        const a = triangleCenter(points, delaunay, Math.floor(e / 3));
                        const b = triangleCenter(points, delaunay, Math.floor(delaunay.halfedges[e] / 3));
                        coords.push([a[0],a[1]],[b[0],b[1]]);
                        //coords.push([b[0],b[1]]);
                        //results.push(`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`);
                    }
                }
                return coords;
                //results.push('</g>');
                //return results.join('');
            }
            //var poCen = '{"type":"FeatureCollection", "features":[';
            //poCen += '{"type":"Feature","geometry":{"type":"Polygon","coordinates":[['+coordinates[0][0]+'],['+coordinates[0][1]+']]}}';
            /*for (i = 1; i < coordinates.length; i++) {
                poCen += ',{"type":"Feature","geometry":{"type":"Polygon","coordinates":['+coordinates+']}}';
            }*/
            //poCen += ']}';
            /*let triangle = [];
            for (var i = 0; i < 3; i++) {
                let edge_id = 3*t + i;
                let point_id = delaunator.triangles[edge_id];
                triangle.push(points[point_id]);
            }*/
            function getColor(d) {
                return d > 3 ? SPIcol[0] : //nero
                d > 2 ? SPIcol[1] : //blu
                d > 1.5 ? SPIcol[2] : //verde
                d > -1.5 ? SPIcol[3] : //Grigio chiaro
                d > -2 ? SPIcol[4] ://arancione
                d > -3 ? SPIcol[5] : //rosso
                d > -4 ? SPIcol[6] : //rosso scuro o marrone
                SPIcol[7];//Anomalo
            }
            /**
             *With this function colors are shown.
            **/
            function style(feature) {
                return {
                fillColor: getColor(feature.properties.spi),
                weight: 1,
                opacity: opacLay,
                color: getColor(feature.properties.spi),
                dashArray: '1',
                fillOpacity: opacLay
                };
            }
            const points = new Array();//[[168, 180], [168, 178], [168, 179], [168, 181], [168, 183]];
            for(i=0;i<tmpJSON["features"].length;i++){
                lng = tmpJSON["features"][i]["properties"]["lngCentroid"];
                lat = tmpJSON["features"][i]["properties"]["latCentroid"];
                points[i]=[lat,lng];//[lng,lat];
            }
            //console.log("points: " + points);
            //forEachTriangleEdge(points, delaunay, callback);
            const delaunay = Delaunator.from(points);
            //var coordinates = voronoiSvg(points,delaunay);
            var triangles = delaunay.triangles;
            var coordinates = new Array();
            for (let i = 0; i < triangles.length; i += 3) {
                coordinates.push([
                    points[triangles[i]],
                    points[triangles[i + 1]],
                    points[triangles[i + 2]]
                ]);
            }
            console.log(coordinates);
            
            /*var lC = new Array();
            for(j=0;j<coordinates.length;j++){
                lC.push([[coordinates[i][0]],[coordinates[i][1]],[coordinates[i][2]]]);
            }*/
            vorCount = L.polygon(coordinates, {color: 'red'}).addTo(mymap);
            //mymap.fitBounds(vorCount.getBounds());
            
            //console.log(delaunay.triangles);
            //console.log(poCen);
            //vorCount = L.geoJSON(JSON.parse(poCen)).addTo(mymap);