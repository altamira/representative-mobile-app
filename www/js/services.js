angular.module('starter.services', [])

.factory('Leads', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var leads = [
    /*{"company":"","contact":{"person":{"name":"Vanessa Forestiero"},"email":{"address":"vanessa.forestiero@altamira.com.br"},"phone":{"internationalCode":55,"areaCode":11,"prefix":2095,"number":2855,"accessCode":0},"mobile": {"internationalCode":55,"areaCode":11,"prefix":99234,"number":4567},"department":"Vendas","role":"Assistente de Vendas"},"address":{"address":"Rua Ganges","number":"553","complement":"galpao 1","city":{"name":"São Paulo","state":{"name":"São Paulo","acronym":"SP","country":"Brasil"}},"zip":"07443-030"},"vendor":{"code":"001","name":"Administracao"},"id":"20e8df5e-0d9e-4e77-8cf2-d31f3d5895tf","version":1,"timestamp":1439173303878,"userId":"vanessa.forestiero@altamira.com.br"},
    {"company":"Tecnequip Tecnologia em Equipamentos Ltda","contact":{"person":{"name":"Vanessa Forestiero"},"email":{"address":"vanessa.forestiero@altamira.com.br"},"phone":{"internationalCode":55,"areaCode":11,"prefix":2095,"number":2855,"accessCode":0},"mobile": {"internationalCode":55,"areaCode":11,"prefix":99234,"number":4567},"department":"Vendas","role":"Assistente de Vendas"},"address":{"address":"Rua Ganges","number":"553","complement":"galpao 1","city":{"name":"São Paulo","state":{"name":"São Paulo","acronym":"SP","country":"Brasil"}},"zip":"07443-030"},"vendor":{"code":"001","name":"Administracao"},"id":"20e8df5e-0d9e-4e77-8cf2-d31f3d5895cb","version":1,"timestamp":1439173303878,"userId":"vanessa.forestiero@altamira.com.br"},
    {"company":null,"contact":{"person":{"name":"Vanessa Forestiero"},"email":{"address":"vanessa.forestiero@altamira.com.br"},"phone":{"internationalCode":55,"areaCode":11,"prefix":2095,"number":2855,"accessCode":0},"mobile": {"internationalCode":55,"areaCode":11,"prefix":99234,"number":4567},"department":"Vendas","role":"Assistente de Vendas"},"address":{"address":"Rua Ganges","number":"553","complement":"galpao 1","city":{"name":"São Paulo","state":{"name":"São Paulo","acronym":"SP","country":"Brasil"}},"zip":"07443-030"},"vendor":{"code":"001","name":"Administracao"},"id":"20e8df5e-0d9e-4e77-8cf2-d31f3c5895cf","version":1,"timestamp":1439173303878,"userId":"vanessa.forestiero@altamira.com.br"},
    {"company":"Tecnequip","contact":{"person":{"name":"Vanessa Forestiero"},"email":{"address":"vanessa.forestiero@altamira.com.br"},"phone":{"internationalCode":55,"areaCode":11,"prefix":2095,"number":2855,"accessCode":0},"mobile": {"internationalCode":55,"areaCode":11,"prefix":99234,"number":4567},"department":"Vendas","role":"Assistente de Vendas"},"address":{"address":"Rua Ganges","number":"553","complement":"galpao 1","city":{"name":"São Paulo","state":{"name":"São Paulo","acronym":"SP","country":"Brasil"}},"zip":"07443-030"},"vendor":{"code":"001","name":"Administracao"},"id":"20e8df5e-0d9e-4e77-8cf2-d31f3d5895df","version":1,"timestamp":1439173303878,"userId":"vanessa.forestiero@altamira.com.br"}*/
  ];

  return {
    set: function(records) {
      leads = records;
    },
    all: function() {
      return leads;
    },
    remove: function(lead) {
      leads.splice(leads.indexOf(lead), 1);
    },
    get: function(id) {
      for (var i = 0; i < leads.length; i++) {
        if (leads[i].id === id) {
          return leads[i];
        }
      }
      return null;
    },
    add: function(lead) {
      leads.push(lead);
    }    
  };

})

.factory('AuthService', ['$ionicUser', '$localstorage', function($ionicUser, $localstorage) {

  return {
    isAuthenticated: function() {
      var user = $localstorage.get('user');
      return user && user.id;
    }
  }
}])

.factory('PushService', ['$rootScope', '$state', '$localstorage',  '$cordovaPush', 'DeviceRegistrationService', 'SyncService', 'Lead', 
  function($rootScope, $state, $localstorage, $cordovaPush, DeviceRegistrationService, SyncService, Lead) {

  var androidConfig = {
    "senderID": "420419347783"
  };

  // Handler notification received message
  $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
    switch(notification.event) {
      case 'registered':
        if (notification.regid.length > 0 ) {
          console.log('registration ID = ' + notification.regid);
          
          var user = $localstorage.get('user')

          angular.extend(user, {
            token: notification.regid
          });

          DeviceRegistrationService.register(user);

        }
        break;

      case 'message':
        // this is the actual push notification. its format depends on the data model from the push server
        //alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
        // Handle new push notifications here
        console.log('New notification message: ' + JSON.stringify(notification));

        var lead = notification.payload.payload;

        Lead.add(lead)
        .then(function(result) {
          $state.reload('lead');
          SyncService.sync();

          if (!notification.foreground) {
            $state.transitionTo('lead', /*$stateParams*/{}, { reload: true, inherit: false, notify: true });
          } else {
            alert('Chegou uma nova oportunidade de negócio.');
            //$state.transitionTo('tab.leads', /*$stateParams*/{}, { reload: true, inherit: false, notify: true });
            $state.transitionTo($state.current, $state.$current.params, { reload: true, inherit: true, notify: true });//reload
          }
        })
        
        break;

      case 'error':
        alert('GCM error = ' + notification.msg);
        break;

      default:
        alert('An unknown GCM event has occurred');
        break;
    }
  });

  return {
    // Push notification registration
    // Registers a device for push notifications and stores its token
    register: function() {
      // Push notification using Cordova
      $cordovaPush.register(androidConfig).then(function(result) {
        console.log('Push notification send registration successfull');
      }, function(error) {
        console.log('Push notification Error:', JSON.stringify(error));
        $rootScope.settings.showSpin = false;
      });

    } 
  }
}])

.factory('DeviceRegistrationService', ['$rootScope', '$http', '$state', '$localstorage', 'SyncService', function($rootScope, $http, $state, $localstorage, SyncService) {

  "use strict";

  //var endpoint = "http://gcm-services.elasticbeanstalk.com/api/0.0.3-SNAPSHOT";
  var endpoint = "http://gcm.altamira.com.br/api/0.0.3-SNAPSHOT";

  return {
    register: function(user) {
      $http.defaults.headers.common['Content-Type'] = 'application/json';
      $http.defaults.headers.common['Authorization'] = 'Basic ' + 'dXNlcjpLeHNAM2Ft'; /*Base64.encode('user' + ':' + 'password');*/
      if (user.id) {
        $http.put(endpoint + "/register", user)
        .then(function(response) {

          $localstorage.set('user', response.data);

          console.log('Registration info updated: ' + JSON.stringify(response.data));

          SyncService.sync(response.data.token);

          $rootScope.settings.showSpin = false;

        }, function(error) {
          $rootScope.settings.showSpin = false;
          console.log('Registration info update error: ' + JSON.stringify(error))
          return false;
        }); 
      } else {
        $http.post(endpoint + "/register", user)
        .then(function(response) {

          var user = response.data;

          $localstorage.set('user', user);

          console.log($state);

          console.log('User registered: ' + JSON.stringify(user));

          SyncService.syncAll(user.token);

          $rootScope.settings.showSpin = false;

          alert('Um email foi enviado para ' + user.email + ' com instruções para ativar o aplicativo. Enquanto este procedimento não for realizado o aplicativo não estará habilitado para receber informações do Sistema de Vendas da Altamira.')

          $state.transitionTo('lead', /*$stateParams*/{}, { reload: true, inherit: false, notify: true });

        }, function(error) {
          console.log('User registration error: ' + JSON.stringify(error))
          $rootScope.settings.showSpin = false;
          alert('Não foi possível registrar a conta, verifique a conexão com a internet. Se o problema persistir entre em contato com suporte técnico.');
        }); 
      }  
    }
  } 

}])

.factory('SyncService', ['$rootScope', '$http', '$state', '$localstorage', 'Lead', function($rootScope, $http, $state, $localstorage, Lead) {

  "use strict";

  var endpoint = 'http://vendas.altamira.com.br/api/0.0.1-SNAPSHOT';

  return {
    syncAll: function(token) {
      var user = $localstorage.get('user')
      $http.defaults.headers.common['Content-Type'] = 'application/json';
      $http.defaults.headers.common['Authorization'] = 'Basic ' + 'dXNlcjpibTg3QDNh';
      $http.get(endpoint + '/sync?email=' + user.email)
      .then(function(response) {

        console.log('Start Sync all for token ' + token);
        for (var i = 0; i < response.data.length; i++) {
          console.log('Sync new lead: ' + JSON.stringify(response.data[i]));

          Lead.add(response.data[i])
          .then(function(result) {
            $state.transitionTo('lead', {}, { reload: true, inherit: false, notify: true });
          });

        }

        console.log('Sync all completed for ' + token);
        $rootScope.settings.showSpin = false;

      }, function(error) {
        $rootScope.settings.showSpin = false;
        console.log('Sync All error: ' + JSON.stringify(error))
        return false;
      });
    },
    sync: function(token) {
      $http.defaults.headers.common['Content-Type'] = 'application/json';
      $http.defaults.headers.common['Authorization'] = 'Basic ' + 'dXNlcjpibTg3QDNh'; /*Base64.encode('user' + ':' + 'password');*/
      $http.get(endpoint + '/sync/token/' + token)
      .then(function(response) {

        for (var i = 0; i < response.data.length; i++) {
          console.log('Sync new lead: ' + JSON.stringify(response.data[i]));

          Lead.add(response.data[i])
          .then(function(result) {
            Lead.rowId(result.insertId)
            .then(function(result) {
              if (result) {
                var user = $localstorage.get('user')
                $http.delete(endpoint + '/sync?token=' + user.token + '&id=' + result.id)
                .then(function(response) {
                  console.log('Receive Sync remove ACK.');
                }, function(error) {
                  console.log('Lead in Sync error: ' + JSON.stringify(error));
                });
              }
            });
          });

        }

        $rootScope.settings.showSpin = false;

      }, function(error) {
        $rootScope.settings.showSpin = false;
        console.log('Sync error: ' + JSON.stringify(error))
        return false;
      }); 
    }
  } 

}])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      if (typeof value == 'object') { 
        $window.localStorage[key] = JSON.stringify(value);
      } else {
        $window.localStorage[key] = value;
      }
    },
    get: function(key) {
      var value = $window.localStorage[key];
      if (value == undefined) {
        return undefined;
      }
      var obj = JSON.parse(value || {});
      if (obj === undefined) {
        return $window.localStorage[key] || undefined;
      } else {
        return obj;
      }
    },
  }
}])

.factory('DBA', function($cordovaSQLite, $q, $ionicPlatform) {
  var self = this;

  // Handle query's and potential errors
  self.query = function (query, parameters) {
    parameters = parameters || [];
    var q = $q.defer();

    $ionicPlatform.ready(function () {
      $cordovaSQLite.execute(db, query, parameters)
        .then(function (result) {
          q.resolve(result);
        }, function (error) {
          console.warn('I found an error');
          console.warn(error);
          q.reject(error);
        });
    });
    return q.promise;
  }

  // Process a result set
  self.getAll = function(result) {
    var output = [];

    for (var i = 0; i < result.rows.length; i++) {
      output.push(JSON.parse(result.rows.item(i).payload));
    }
    return output;
  }

  // Process a single result
  self.getById = function(result) {
    var output = null;
    if (result.rows.item(0)) {
      output = angular.copy(JSON.parse(result.rows.item(0).payload));
    }
    return output;
  }

  return self;
})

.factory('Lead', function($cordovaSQLite, DBA) {
  var self = this;

  self.all = function() {
    return DBA.query("SELECT payload FROM lead ORDER BY ROWID DESC")
      .then(function(result){
        return DBA.getAll(result);
      });
  }

  self.rowId = function(rowId) {
    var parameters = [rowId];
    return DBA.query("SELECT payload FROM lead WHERE ROWID = (?)", parameters)
      .then(function(result) {
        return DBA.getById(result);
      });
  }

  self.get = function(id) {
    var parameters = [id];
    return DBA.query("SELECT payload FROM lead WHERE id = (?)", parameters)
      .then(function(result) {
        return DBA.getById(result);
      });
  }

  self.add = function(member) {
    var company = !member.company ? '' : member.company;
    var parameters = [member.id, company, member.contact.person.name, JSON.stringify(member)];
    return DBA.query("INSERT OR REPLACE INTO lead (id, cname, pname, payload) VALUES (?,?,?,?)", parameters);
  }

  self.remove = function(member) {
    var parameters = [member.id];
    return DBA.query("DELETE FROM lead WHERE id = (?)", parameters);
  }

  self.update = function(member) {
    var company = !member.company ? '' : member.company;
    var parameters = [member.id, company, member.contact.person.name, JSON.stringify(member), member.id];
    return DBA.query("UPDATE lead SET id = (?), cname = (?), pname = (?), payload = (?) WHERE id = (?)", parameters);
  }

  return self;
})

.factory('Base64', function() {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
            'QRSTUVWXYZabcdef' +
            'ghijklmnopqrstuv' +
            'wxyz0123456789+/' +
            '=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                alert("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
});


