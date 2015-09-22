app.controller('mapsController', ["$scope","$ionicLoading","$firebaseArray",function($scope,$ionicLoading,$firebaseArray) {

	var map;

	var idCiudadActual;
	var usuariosConectados;
	var marcadores=[];
	var zonasPrueba=[
		{
			idCiudad:'Madrid',
			zonas:[
				{	
					id:0,
					nombre:'Atocha',
					pos:{
						lat:40.4111049,
						lng:-3.6929537
					},
					tam:220,
					personasTotales:0,
					popularity:80
				},				
				{	
					id:1,
					nombre:'La Latina',
					pos:{
						lat:40.411192,
						lng:-3.708374
					},
					tam:150,
					personasTotales:0,
					popularity:10
				},				
				{	
					id:2,
					nombre:'Huertas',
					pos:{
						lat:40.416178,
						lng:-3.703232
					},
					tam:150,
					personasTotales:0,
					popularity:30
				},				
				{	
					id:3,
					nombre:'Sevilla',
					pos:{
						lat:40.415896,
						lng:-3.700367
					},
					tam:100,
					personasTotales:0,
					popularity:80
				},				
				{	
					id:4,
					nombre:'Tribunal',
					pos:{
						lat:40.426299,
						lng:-3.701231
					},
					tam:140,
					personasTotales:0,
					popularity:0
				}
,				
				{	
					id:5,
					nombre:'Serrano',
					pos:{
						lat:40.428799,
						lng:-3.687209
					},
					tam:100,
					personasTotales:0,
					popularity:0
				}

			]
			
		}
	];

	var posicionUsuariosConectados=[
		{
			idCiudad:'Madrid',
			usuarios:[
				{	
					info:{
						nombre:'Lucas',
						edad:24,
						estado:0,
						buscando:1	
					},
					pos:{
						lat:40.4111049,
						lng:-3.6929537
					},
					zona:0
				},{	
					info:{
						nombre:'Lucas',
						edad:24,
						estado:0,
						buscando:1	
					},
					pos:{
						lat:40.412537,
						lng:-3.693417
					},
					zona:-1
				},{	
					info:{
						nombre:'Lucas',
						edad:24,
						estado:0,
						buscando:1	
					},
					pos:{
						lat:40.414567,
						lng:-3.6945237
					},
					zona:2
				},{	
					info:{
						nombre:'Lucas',
						edad:24,
						estado:0,
						buscando:1	
					},
					pos:{
						lat:40.4185932,
						lng:-3.6902301
					},
					zona:1
				},{	
					info:{
						nombre:'Lucas',
						edad:24,
						estado:0,
						buscando:1	
					},
					pos:{
						lat:40.4192215,
						lng:-3.6929537
					},
					zona:2
				},{	
					info:{
						nombre:'Lucas',
						edad:24,
						estado:0,
						buscando:1	
					},
					pos:{
						lat:40.4100924,
						lng:-3.6929537
					},
					zona:3
				}


			]
			
		}
	]


	$scope.init=function(){

		$scope.genteEnZonasDeFiesta=0;
		/* Mostramos el cargador de ionic */
		$scope.loading = $ionicLoading.show({
      		content: 'Getting current location...',
	  		showBackdrop: true
	    });

  		/* Inicializamos el mapa */
  		google.maps.event.addDomListener(window, 'load', initMap);

  		/* Obtenemos la posicion actual */


	};


	function initMap(){
        var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
        
        var mapOptions = {
          center: myLatlng,
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

  		obtenerPosicion();
	}

	/* Creamos una funcion para simular usuarios aleatorios por toda la ciudad de Madrid en este ejemplo */
	function generarUsuariosAleatorios(){
		var latitudRandom,longitudRandom,usuario;
		$scope.numUsuariosConectados=getRandomIntArbitrary(5000,10000);
		debugger;
		for (var i = 0; i < $scope.numUsuariosConectados; i++) {
			latitudRandom=getRandomArbitrary(40.3967,40.460904);
			longitudRandom=getRandomArbitrary(-3.713547,-3.651459);

			usuario={
				info:{
						nombre:'XXXX',
						edad:getRandomIntArbitrary(18,30),
						estado:getRandomIntArbitrary(0,3),
						buscando:getRandomIntArbitrary(0,1)	
					},
				pos:{
						lat:latitudRandom,
						lng:longitudRandom
					},
				zona: obtenerZonaDelUsuario(latitudRandom,longitudRandom)
			};
			posicionUsuariosConectados[0].usuarios.push(usuario);

		};

	}
	function obtenerDistancia(lat1,lat2,lon1,lon2) {
		var R = 6371*1000; // Radius of the earth in m
		var dLat = deg2rad(lat2-lat1);  // deg2rad below
		var dLon = deg2rad(lon2-lon1); 
		var a = 
		Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c; // Distance in m
		return d;
		}

	function deg2rad(deg) {
		return deg * (Math.PI/180)
	}
	function obtenerZonaDelUsuario(latUsuario,lngUsuario){
		var latZona,lngZona,tamZona,distancia;
		for (var i = 0; i < $scope.zonasDeLaCiudad.length; i++) {
			latZona=$scope.zonasDeLaCiudad[i].pos.lat;
			lngZona=$scope.zonasDeLaCiudad[i].pos.lng;
			tamZona=$scope.zonasDeLaCiudad[i].tam;


			distancia=obtenerDistancia(latZona,latUsuario,lngZona,lngUsuario);	
			/*Quiere decir que esta dentro de la zona*/
			if(tamZona>distancia){
				$scope.genteEnZonasDeFiesta++;
				$scope.zonasDeLaCiudad[i].personasTotales++;
				$scope.zonasDeLaCiudad[i].popularity=$scope.zonasDeLaCiudad[i].personasTotales/$scope.genteEnZonasDeFiesta;
				return $scope.zonasDeLaCiudad[i].id;
			}

		};
		return -1;

	}

	function getRandomArbitrary(min, max) {
    	return Math.random() * (max - min) + min;
	}

	function getRandomIntArbitrary(min, max) {
    	return Math.floor(Math.random() * (max - min) + min);
	}

	function obtenerPosicion(){
		navigator.geolocation.getCurrentPosition(posicionCorrecta,posicionIncorrecta);
	}
  
	
	function posicionCorrecta(pos){
		var posLatLng=new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

		/*Centramos el mapa*/
		map.setCenter(posLatLng);
		/*Annadimos el marcador al mapa*/
		addMarcador(posLatLng,'yo');
		/*Obtenemos la ciudad actual en la que estamos*/
		getCiudadActual(posLatLng);
		/*Comprobamos si estamos en alguna zona definida*/
		/*asignarZonaAUsuario(posLatLng);*/
		/*Ocultamos el loading*/  		
	}

	function posicionIncorrecta(error){
		console.log("Imposible obtener la posicion: "+error);

	}

	/*
		Posicion: contiene las coordenadas del punto a pintar
		Tipo : 'zona', 'usuario' o 'yo'
	*/
	function addMarcador(posicion,tipo,obj){
		

		if(tipo=='zona'){

			var color=devolverColor(obj.popularity);
			console.log("El color es: "+color);
			var circulo = new google.maps.Circle({
		      strokeColor: color,
		      strokeOpacity: 0.3,
		      strokeWeight: 2,
		      label:obj.nombre,
		      fillColor: color,
		      fillOpacity: 0.3,
		      map: map,
		      center: posicion,
		      radius: obj.tam
		    });
		}
		else if(tipo=='usuario'){
			debugger;
			var circulo = new google.maps.Circle({
		      strokeColor: (obj.zona==-1)?'#4285f4':'green',
		      strokeOpacity: 0.5,
		      strokeWeight: 2,
		      fillColor: '#4285f4',
		      fillOpacity: 0.35,
		      map: map,
		      center: posicion,
		      radius: 3
		    });

		}
		else if(tipo=='yo'){
			

		}
	    
	}
	function devolverColor(num){
		var numZonas=10/$scope.zonasDeLaCiudad.length;
		if(num<0.2){
			return "red";
		}
		else if( num>=0.2 && num<0.4){
			return "yellow";
		}
		else{
			return "green";
		}

	}

	function pintarMarcadores(lista,tipo){

		for (var i = 0; i < lista.length; i++) {
	        var pos = new google.maps.LatLng(lista[i].pos.lat,lista[i].pos.lng);

	        addMarcador(pos,tipo,lista[i]);

		};

	}

	function getUsuarios(){

		for (var i = 0; i < posicionUsuariosConectados.length; i++) {
			if(posicionUsuariosConectados[i].idCiudad==idCiudadActual){
				usuariosConectados=posicionUsuariosConectados[i].usuarios;
				break;
			}
		};
		

	}



	function getZonas(){
		if(idCiudadActual){
			for (var i = 0; i < zonasPrueba.length; i++) {
				if(zonasPrueba[i].idCiudad==idCiudadActual){
					$scope.zonasDeLaCiudad=zonasPrueba[i].zonas;
					break;
				}
			};
		}
		else{
			/*	Mensaje de error */

		}
	}


	function getCiudadActual(pos){
		var geocoder=new google.maps.Geocoder();
		geocoder.geocode({'latLng': pos}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				idCiudadActual=results[7].address_components[0].long_name;


				if(idCiudadActual){
					getZonas();
					getUsuarios();
					console.log("Generando usuarios aleatorios...");

					/*Generamos usuarios aleatorios de prueba*/
					generarUsuariosAleatorios();
					console.log("Pintando marcadores usuario...");
					pintarMarcadores(usuariosConectados,'usuario');
					
					console.log("Pintando marcadores de zona...");
					pintarMarcadores($scope.zonasDeLaCiudad,'zona');

			  		$ionicLoading.hide();
				}
		   	}
		   	else{
		   		console.error("Geocoder ERROR")
		   	}
		});



	}

}]);