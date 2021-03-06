/*-------------------------------------------------
	searchByName(display, service)	
	Gets the JSON about the cities corresponding to the 'cityName' field and puts it in the 'cities' array of 'display'
-------------------------------------------------*/
function searchByName(display, service, store){
	display.error = false;
	service.get("http://api.openweathermap.org/data/2.5/find?q="
		+ encodeURIComponent(display.cityName)
		+ "&type=like"
		+ "&lang=" + encodeURIComponent(lang)
		+ "&units=" + encodeURIComponent(un))
		.success(function (response) {
			if(response.count > 1){
				display.slctdCity = false;
				display.cities = response.list;
				}
			else{
				if(response.count == 1){
					citySelection(display, service, response.list[0].id, store);
					iconId = response.list[0].weather[0].id;
				}
				else{
					errorOccurred(display, 2);
				}
			}
		})
		.error(function(){
		errorOccurred(display, 1);
		})
}

/*-------------------------------------------------	
	searchByCoord(display, service)
	Gets the JSON about the city corresponding to the 'lat' and 'lon' fields and puts it in 'city' of 'display'
-------------------------------------------------*/
function searchByCoord(display, service, store){
	display.error = false;
	service.get("http://api.openweathermap.org/data/2.5/weather?lat="
		+ encodeURIComponent(display.lat)
		+ "&lon=" + encodeURIComponent(display.lon)
		+ "&lang=" + encodeURIComponent(lang)
		+ "&units=" + encodeURIComponent(un))
	.success(function(response){
		display.slctdCity = true;
		display.city = response;
		save(store, response)
	})
	.error(function(){
		errorOccurred(display, 1);
	})
}

/*-------------------------------------------------	
	searchByZip(display, service)
	Gets the JSON about the city corresponding to 'zip' and 'country' fields and puts it in 'city' of 'display'
-------------------------------------------------*/
function searchByZip(display, service, store){
	display.error=false;
	service.get("http://api.openweathermap.org/data/2.5/weather?zip="
	+ encodeURIComponent(display.zip)
	+ "," + encodeURIComponent(display.country)
	+ "&lang=" + encodeURIComponent(lang)
	+ "&units=" + encodeURIComponent(un))
	.success(function(response){
		if(response.cod == '404'){
			errorOccurred(display,3);
		}
		else{
			display.slctdCity = true;
			display.city = response;	
			save(store, response)
		}
	})
	.error(function(){
		errorOccurred(display,1);
	})
}

/*-------------------------------------------------
	citySelection(display, service, id)	
	Performs the displaying of the weather information of the city described by 'id'
-------------------------------------------------*/
function citySelection(display, service, id, store){
	display.error = false;
	service.get("http://api.openweathermap.org/data/2.5/weather?id=" 
	+ id
	+ "&lang=" + encodeURIComponent(lang)
	+ "&units=" + encodeURIComponent(un))
	.success(function(response){
		display.slctdCity = true;
		display.city = response;
		display.icon = response.weather[0].icon;
		getForecast(display, service);
		save(store, response)
	})
	.error(function(){
		errorOccurred(display, 1);
	})
}

/*-------------------------------------------------
	getForecast(display, service)
	Gets the JSON for the X days coming, X defined by 'frcstDay'
-------------------------------------------------*/
function getForecast(display, service){
	if(display.frcstDay == '')	display.frcst = false;
	else{
		service.get("http://api.openweathermap.org/data/2.5/forecast/daily?id="
		+ encodeURIComponent(display.city.id)
		+ "&mode=json"
		+ "&lang=" + encodeURIComponent(lang)
		+ "&units=" + encodeURIComponent(un)
		+ "&cnt=" + encodeURIComponent(display.frcstDay))
		.success(function(response){
			display.frcst = true;
			display.forecast = response.list;
		})
		.error(function(){
			errorOccured(display, 1);
		})
	}
}


/*-------------------------------------------------
	reloadJSONDisplay(display, service)
	Reloads the JSON data from the weather API in the newly selected parameters (temperature system, language)
-------------------------------------------------*/
function reloadJSONDisplay(display,service, store){
	if(display.slctdCity){
		citySelection(display,service,display.city.id, store);
	}
	else{
		searchByName(display, service);
	}
}

/*-------------------------------------------------
	save(store, city)
	Stores the data concerning the last selected city in browser's local storage
-------------------------------------------------*/
function save(store, city){
	store.id = city.id;
	store.name = city.name;
}

/*-------------------------------------------------
	errorOccurred(display, code)
	Performs the displaying of the error encountered. The error is identified by its 'code'
-------------------------------------------------*/
function errorOccurred(display, code){
	switch(code){
		case 1:{
			display.err_info = "ERRCASE1";
			$("#errorModal").modal();
		}
		
		case 2:{
			display.err_info = "ERRCASE2";
			$("#errorModal").modal();
		}
		
		case 3:{
			display.err_info = "ERRCASE3";
			$("#errorModal").modal();
		}
	}
}