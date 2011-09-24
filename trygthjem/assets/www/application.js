
            FB.Event.subscribe('auth.login', function(response) {
                alert('auth.login event');
                populateFriendsList();
            });
            
            FB.Event.subscribe('auth.logout', function(response) {
                alert('auth.logout event');
            });
            
            FB.Event.subscribe('auth.sessionChange', function(response) {
                alert('auth.sessionChange event');
            });
            
            FB.Event.subscribe('auth.statusChange', function(response) {
                alert('auth.statusChange event');
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
                alert(JSON.stringify(FB.getSession()));
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
            
            function login() {
            	alert('login');
                FB.login(
                    function(e) {
                        alert(e);
                    },
                    { perms: "email" }
                );
            }
            
            document.addEventListener('deviceready', function() {
                  try {
                    FB.init({ appId: "127486214017846", nativeInterface: PG.FB });
                	login();
                  } catch (e) {
                    alert(e);
                  }
                }, false);

$(function() {

	
	
});
