angular.module('starter.controllers', [])

.controller('LeadsCtrl', function($scope, SyncService, Lead) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.leads = [];

  $scope.list = function() {
    Lead.all().then(function(leads){
      $scope.leads = leads;
      /*$scope.leads.reverse().push(leads);

      if ($scope.leads.length > 10) {
          $scope.leads = $scope.leads.slice($scope.leads.length - 10);
      }

      $scope.leads = $scope.leads.reverse();*/
      //$scope.$apply();
    });
  }

  $scope.list();

  $scope.add = function(lead) {
    Lead.add(lead);
    $scope.update();
  };

  $scope.remove = function(lead) {
    Lead.remove(lead);
    $scope.update();
  };
  
  $scope.update = function(orig, edit) {
    Lead.update(orig, edit);
    $scope.list();
  };  
})

.controller('LeadDetailCtrl', function($scope, $stateParams, Lead) {
  Lead.get($stateParams.id).then(function(lead) {
    $scope.lead = lead;
    $scope.companyShow = true;
    $scope.contactShow = false;
    $scope.locationShow = false;
  }, function(error) {
    alert('Erro ao carregar os dados: ' + error);
  });
})

.controller('AccountCtrl', function($rootScope, $scope, $state, $localstorage, $ionicUser, $cordovaNetwork, PushService) {

  // Identifies a user with the Ionic User service
  $scope.identifyUser = function(choice) {
    console.log('User identified ' + choice);

    $rootScope.settings.showSpin = true;

    var user = $localstorage.get('user');

    // Add some metadata to your user object.
    angular.extend(user, {
      //id = $ionicUser.generateGUID()
      //name: "John Doe", // not actually needed for this example
      //device: device.uuid
      email: choice
    });

    $localstorage.set('user', user);

    // check network connection
    var networkStatus = $cordovaNetwork.getNetwork();

    if (networkStatus != Connection.UNKNOWN && networkStatus != Connection.NONE) {
      PushService.register();
    } else {
      $rootScope.settings.showSpin = false;
      alert('Verifique a conexão com a internet, no primeiro acesso é necessário estar conectado.');
    }
  }; 

});
