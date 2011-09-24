
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
            	FB.api('/me/friends', function(response) {
            		var friends = $('#friends-content');
            		friends.empty();
            		var friendslist = "<div>";
            		var counter = 0;
            		var limit = 0;
            		var letter = 'a';
                    response.data.forEach(function(item) {
                    	if(limit < 6) {
	                    	if(counter == 0) {
	                    		friendslist += ('</div>');
	                        	friendslist += ('<div class="ui-grid-b">');
	                        	letter = 'a';
	                    	}
	                    	else if(counter == 1) {
	                    		letter = 'b';
	                    	}
	                    	else {
	                    		letter = 'c';
	                    		counter = -1;
	                    	}
	                        friendslist += ('<div class="ui-block-'+letter+'"><a href="#friend" class="friend" data-id="'+item.id+'"><img width="80" height="80" src="http://graph.facebook.com/'+item.id+'/picture"><br>test</a></div>');
	                        counter++;
	                        limit++;
                    	}
                    });
            		friendslist += "</div>";
            		friends.append(friendslist);
            		onUpdate();
                });
            }
            
            function populateFriend(id) {
            	$('#friend-name').empty();
            	$('#friend-content').html('<p>Loading...</p>')
            	FB.api(id+'', function(response){
            		$('#friend-name').html(response.name);
            		$('#friend-content').empty();
            		$('#friend-content').append('<p>Last seen 17 minutes ago at Klubben</p>');
            		$('#friend-content').append('<a class="friend-button" href="'+response.link+'" data-role="button">Go to Facebook</a>');
            		
            		findContact(response.name);
            		
            		// Update UI
            		$('#friend').page();
            		$('.friend-button').button();
            		
            	})
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
                        //alert(e);
                    },
                    { perms: "user_mobile_phone" }
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
            
            function onUpdate() {
            	$('.friend').click(function() {
            		populateFriend($(this).data("id"));
            	});
            }
            
            function contactFound(contact) {
            	alert('Contact found ' + JSON.stringify(contact));
            	$.each(contact.phoneNumbers, function(index, value){
            		alert(value.value);
            		var phoneNumber = value.value;
            		$('#friend-content').append('<a href="tel:'+phoneNumber+ '" data-role="button">Call '+phoneNumber+'</a>');            		
            		
            	});
//            	contact.phoneNumbers.forEach(function(phoneNumber) {
//            	});
            }
            
            function contactNotFound(contact) {
            	alert('Contact not found ' + JSON.stringify(contact));
            }
            
            function findContact(name) {
            	var options = new ContactFindOptions();
            	options.filter=name; 
            	var fields = ["displayName", "name", "phoneNumbers"];
            	navigator.contacts.find(fields, contactFound, contactNotFound, options);
            }

$(document).ready(function() {
	$('.friend').click(function() {
		populateFriend($(this).data("id"));
	})
});
