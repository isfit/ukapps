
			var ukaapi_token = "adsd";
			
			
            FB.Event.subscribe('auth.login', function(response) {
                console.log('auth.login event');
                populateFriendsList();
            });
            
            FB.Event.subscribe('auth.logout', function(response) {
                console.log('auth.logout event');
            });
            
            FB.Event.subscribe('auth.sessionChange', function(response) {
                console.log('auth.sessionChange event');
            });
            
            FB.Event.subscribe('auth.statusChange', function(response) {
                console.log('auth.statusChange event');
            });
            
            function populateFriendsList() {
            	var friends = $('#facebook-friends');
            	friends.empty();
            	friends.append('<div>');
            	FB.api('/me/friends', function(response) {
            		var counter = 0;
            		var letter = 'a';
                    response.data.forEach(function(item) {
                    	if(counter == 0) {
                    		friends.append('</div>');
                        	friends.append('<div class="ui-grid-b>"');
                        	letter = 'a';
                    	}
                    	else if(counter == 1) {
                    		letter = 'b';
                    	}
                    	else {
                    		letter = 'c';
                    		counter = -1;
                    	}
                        friends.append('<div class="ui-block-'+letter+'">'+letter+'</div>');
                        
                        counter++;
                    });
                });
            	friends.append('</div>');
            }
            
            function getSession() {
                console.log(JSON.stringify(FB.getSession()));
            }
            
            function getLoginStatus() {
                FB.getLoginStatus(function(response) {
                    if (response.session) {
                        alert('logged in');
                    } else {
                        alert('not logged in');
                    }
                });
            }
            
            function isLoggedIn() {
                FB.getLoginStatus(function(response) {
                    if (response.session) {
                        return true;
                    } else {
                        return false;
                    }
                });
            }            
            
            function me() {
                FB.api('/me/friends', function(response) {
                    var data = document.getElementById('data');
                    response.data.forEach(function(item) {
                        var d = document.createElement('div');
                        d.innerHTML = item.name;
                        data.appendChild(d);
                    });
                });
            }
            
            function logout() {
                FB.logout(function(response) {
                    alert('logged out');
                });
            }
            
            
            function UkaApi(url, onReceive, parameters){
            	var url = 'http://findmyapp.net/findmyapp/'+url+'.json';
          		var accessor = {
               		consumerKey: '6b2d7fe03b4bb7ea775f63119e92ea468204aaf1',
               		consumerSecret: 'bab92e0c1945459dfea90772b36189d9e68dfdae'
               	};
               	var message = {
               		action: url,
               		method: "GET",
               		parameters: parameters
               	};
               	OAuth.completeRequest(message, accessor);
	           	OAuth.SignatureMethod.sign(message, accessor);
	           	url = url+'?'+OAuth.formEncode(message.parameters);
				console.log(url);           	
	           	$.ajax({url: url, success: onReceive, async: false });
            }
            
            function login() {
            	alert('login');
                FB.login(
                    function(e) {
                        console.log(e);
                       	session = FB.getSession();
                       	UkaApi('auth/login', function(data){console.log(data); ukaapi_token = data;}, {facebookToken: session.access_token});
                       	UkaApi('users/me/friends', function(data) { console.log(data); alert(JSON.stringify(data)); }, {token: ukaapi_token});                
                    },
                    { perms: "email" }
                );
            }
            
            document.addEventListener('deviceready', function() {
                  try {
                    FB.init({ appId: "144871272275360", nativeInterface: PG.FB });
                	login();
                  } catch (e) {
                    alert(e);
                  }
                }, false);

$(function() {

	
	
});
