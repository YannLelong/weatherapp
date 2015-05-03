/*-------------------------------------------------
	searchByName(display, service)	
	Gets the JSON about the cities corresponding to the 'cityName' field and puts it in the 'cities' array of 'display'
	
	IN : display ($scope) and service ($http)
	OUT : n/a
-------------------------------------------------*/
function searchByName(display, service){
	display.error = false;
	service.get("http://api.openweathermap.org/data/2.5/find?q=" + encodeURIComponent(display.cityName) + "&type=like")
		.success(function (response) {
			if(response.count > 1){
				display.slctdCity = false;
				display.cities = response.list;
				}
			else{
				if(response.count == 1){
					citySelection(display, service, response.list[0].id);
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
	citySelection(display, service, id)	
	Performs the displaying of the weather information of the city described by 'id'
	
	IN : display ($scope), service ($http) and city id (id)	
	OUT : n/a
-------------------------------------------------*/
function citySelection(display, service, id){
	display.error = false;
	service.get("http://api.openweathermap.org/data/2.5/weather?id=" + id)
	.success(function(response){
		display.slctdCity = true;
		display.city = response;
	})
	.error(function(){
		errorOccurred(display, 1);
	})
}
/*-------------------------------------------------	
	searchByCoord(display, service)
	Gets the JSON about the city corresponding to the 'lat' and 'lon' fields and puts it in the 'cities' array of 'display'
	
	IN : display ($scope) and service ($http)
	OUT : n/a
-------------------------------------------------*/
function searchByCoord(display, service){
	display.error = false;
	service.get("http://api.openweathermap.org/data/2.5/weather?lat="+ encodeURIComponent(display.lat) + "&lon=" + encodeURIComponent(display.lon))
	.success(function(response){
		display.slctdCity = true;
		display.city = response;
	})
	.error(function(){
		errorOccurred(display, 1);
	})
}
/*-------------------------------------------------
	errorOccurred(display, code)
	Performs the displaying of the error encountered. The error is identified by its 'code'
	
	IN : display ($scope) and error code (code)
	OUT : n/a
-------------------------------------------------*/
function errorOccurred(display, code){
	switch(code){
		case 1:{
			display.err_info = "Connection problem with database";
			display.error = true;
			display.slctdCity = true;
		}
		
		case 2:{
			display.err_info = "No city was found";
			display.error = true;
			display.slctdCity = true;
		}
	}
}