// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var db = null;

angular.module('starter', [
    'ionic',
    'ngCordova',
    'ngResource',
    'ngLocale',
    'ngRoute',
    'ui.router',
    'ionic.service.core',
    'ionic.service.push',
    'starter.controllers', 
    'starter.services',
    'starter.directives'
  ])

.run(function(
  $rootScope, $location, $ionicPlatform, $cordovaPush, 
  $cordovaSQLite, $cordovaDevice, $cordovaNetwork, 
  $localstorage, AuthService, PushService) {

  $rootScope.settings = {
    account: undefined,
    showSpin: false
  };

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    console.log('ionic.Platform.ready');

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

    if(window.cordova) {
      // App syntax
      db = $cordovaSQLite.openDB("sales.db");
    } else {
      // Ionic serve syntax
      db = window.openDatabase("sales.db", "1.0", "Sales Vendor", -1);
    } 

    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS lead (id TEXT PRIMARY KEY, cname TEXT, pname TEXT, payload TEXT)");

    var user = $localstorage.get('user');

    if (!user) {
      user = {};
    }

    user.device = $cordovaDevice.getDevice();

    $localstorage.set('user', user);

    var networkStatus = $cordovaNetwork.getNetwork();

    if (networkStatus != Connection.UNKNOWN && networkStatus != Connection.NONE && AuthService.isAuthenticated()) {
      PushService.register();
    }

  });
})

/*.run(['$rootScope', '$state', 'AuthService', function ($rootScope, $state, AuthService) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
      if (toState.authenticate && !AuthService.isAuthenticated()){
        // User isn’t authenticated
        console.log('State transition to Account because requires authentication');
        $state.transitionTo("account");
        event.preventDefault(); 
      }
    });
  }])*/

.config([
  '$stateProvider', '$urlRouterProvider', '$resourceProvider', 
  '$locationProvider', '$routeProvider', '$httpProvider', 
  function(
    $stateProvider, $urlRouterProvider, $resourceProvider, 
    $locationProvider, $routeProvider, $httpProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  //$stateProvider

  // setup an abstract state for the tabs directive
  /*.state('lead', {
    url: '/lead',
    abstract: true,
    templateUrl: 'templates/lead/menu.html'
  })*/

  /*.state('lead', {
    url: '/lead',
    cache: false, //required
    templateUrl: 'templates/lead/list.html',
    controller: 'LeadListCtrl',
    authenticate: true
  })

  .state('lead-edit', {
    url: '/lead/:id',
    templateUrl: 'templates/lead/edit.html',
    controller: 'LeadEditCtrl',
    authenticate: true
  })

  .state('account', {
    url: '/account',
    templateUrl: 'templates/account.html',
    controller: 'AccountCtrl',
    authenticate: false
  });*/

  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/lead');

  $routeProvider
  .when('/lead', {
    templateUrl: 'templates/lead/list.html',
    controller: 'LeadListCtrl'
  })
  .when('/lead/:id', {
    templateUrl: 'templates/lead/edit.html',
    controller: 'LeadEditCtrl'
  })
  .when('/account', {
    templateUrl: 'templates/account.html',
    controller: 'AccountCtrl'
  })
  .otherwise({
    redirectTo: '/lead'
  });

}]);
