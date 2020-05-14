let stanicaApp = angular.module("stanicaApp", ['ngRoute']);

stanicaApp.controller("homeCtrl", function($scope){
	$scope.message = "Hello MyApp!";
});


stanicaApp.controller("linijeCtrl", function($scope, $http, $location){
	
	$scope.linije = [];
	$scope.prevoznici = [];

	$scope.newLinija = {};
	$scope.newLinija.brojMesta = "";
	$scope.newLinija.cenaKarte = "";
	$scope.newLinija.vremePolaska = "";
	$scope.newLinija.destinacija = "";

	$scope.newLinija.prevoznikId = "";
	
	$scope.searchParams = {};
	$scope.searchParams.destinacija = "";
	$scope.searchParams.prevoznikId = "";
	$scope.searchParams.cenaKarte = "";
	
	$scope.pageNum = 0;
	$scope.totalPages = 1
	
	let linijeUrl = "/api/linije";
	let prevozniciUrl = "/api/prevoznici";
	
	let getLinije = function(){
		
		let config = { params: {} };		
		
		if($scope.searchParams.destinacija != ""){
			config.params.destinacija = $scope.searchParams.destinacija;
		}
		
		if($scope.searchParams.prevoznikId != ""){
			config.params.prevoznikId = $scope.searchParams.prevoznikId;
		}
		
		if($scope.searchParams.cenaKarte != ""){
			config.params.maksCena = $scope.searchParams.cenaKarte;
		}
		
		config.params.pageNum = $scope.pageNum;
		
		$http.get(linijeUrl, config).then(
			function success(res){
				$scope.linije = res.data;
				$scope.totalPages = res.headers("totalPages");
			},
			function error(){
				alert("Neupešno dobavljanje linija.");
			}
		);
	}
	
	getLinije();
	
	
	let getPrevoznici = function(){
		$http.get(prevozniciUrl).then(
			function success(res){
				$scope.prevoznici = res.data;
			},
			function error(){
				alert("Neuspešno dobavljanje prevoznika.");
			}
		);
	}
	
	getPrevoznici();
	
	
	$scope.doAdd = function(){
		
		$http.post(linijeUrl, $scope.newLinija).then(
			function success(){
				getLinije();
				
				$scope.newLinija = {};
				$scope.newLinija.brojMesta = "";
				$scope.newLinija.cenaKarte = "";
				$scope.newLinija.vremePolaska = "";
				$scope.newLinija.destinacija = "";

				$scope.prevoznikId = "";
			},
			function error(){
				alert("Neuspešno čuvanje linije!");
			}
		);
	}
	
	$scope.doDelete = function(id){
		var promise = $http.delete(linijeUrl + "/" + id);
		promise.then(
			function success(){
				getLinije();
			},
			function error(){
				alert("Neuspešno brisanje linije.");
			}
		);
	}
	
	$scope.goToEdit = function(id){
		$location.path("/linije/edit/" + id);
	}
	
	$scope.changePage = function(direction){
		$scope.pageNum = $scope.pageNum + direction;
		getLinije();
	}
	
	$scope.doSearch = function(){
		$scope.pageNum = 0;
		getLinije();
	}
	
	$scope.doReserve = function(id){
		var promise = $http.post(linijeUrl + "/" + id);
		promise.then(
			function success(){
				alert("Uspešno rezervisano mesto.")
				getLinije();
			},
			function error(){
				alert("Neuspešna rezervacija.");
				getLinije();
			}
		);
	}
	
});


stanicaApp.controller("editLinijaCtrl", function($scope, $http, $routeParams, $location){
	
	let linijaUrl = "/api/linije/" + $routeParams.id;
	let prevozniciUrl = "/api/prevoznici";

	$scope.prevoznici = [];
	
	$scope.linija = {};
	$scope.linija.brojMesta = "";
	$scope.linija.cenaKarte = "";
	$scope.linija.vremePolaska = "";
	$scope.linija.destinacija = "";

	$scope.prevoznikId = "";
	
	let getPrevoznici = function(){
		$http.get(prevozniciUrl).then(
			function success(res){
				$scope.prevoznici = res.data;
			},
			function error(){
				alert("Neuspešno dobavljanje prevoznika.");
			}
		);
	}
	
	getPrevoznici();
	
	
	let getLinija = function(){
		$http.get(linijaUrl).then(
			function success(res){
				$scope.linija = res.data;
			},
			function error(){
				alert("Neuspešno dobavljanje linije.");
			}
		);
	}
	
	getLinija();
	
	
	$scope.doEdit = function(){
		$http.put(linijaUrl, $scope.linija).then(
			function success(){
				$location.path("/linije");
			},
			function error(){
				alert("Neuspešno čuvanje linije.");
			}
		);
	}
});



stanicaApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl : '/app/html/home.html',
			controller: 'homeCtrl'
		})
		.when('/linije', {
			templateUrl : '/app/html/linije.html'
		})
		.when('/linije/edit/:id', {
			templateUrl : '/app/html/edit-linija.html'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);