



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
     	
     		function UkaApiPost(url, onReceive, parameters, data, dataType){
                var url = 'http://findmyapp.net/findmyapp/'+url;
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
				console.log(data);
				alert(dataType+" "+data);           	
	           	$.ajax({url: url, success: onReceive, error: function(a, b) {console.log(JSON.stringify(a) + "---" + b); }, async: false, type: "POST", data: data, dataType: dataType });
	      	}
           	function UkaApi(url, onReceive, parameters){
            	var url = 'http://findmyapp.net/findmyapp/'+url;
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
	           	$.ajax({url: url, success: onReceive, async: false, dataType: "json" });
            }
            function updateBSSID(){
            	window.plugins.wifiBssid.list("", function(r) {
            		console.log(JSON.stringify(r.wifiList)); 
            		alert(JSON.stringify(r.wifiList));
            		UkaApiPost('locations', function(response) {
            			alert(response);
            			console.log(response);
            		}, {token: ukaapi_token} , JSON.stringify(r.wifiList), "json"); 
            	}, function(e) {alert(e);console.log(e);});
            }
            
            function populateFriendsList() {
            	UkaApi('users/me/friends', function(response) { 
            		alert(response);
            		var friends = $('#friends-content');
            		friends.empty();
            		var friendslist = "<div>";
            		var counter = 0;
            		var limit = 0;
            		var letter = 'a';
                    response.forEach(function(item) {
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
	                        friendslist += ('<div class="ui-block-'+letter+'"><a href="#friend" class="friend" data-id="'+item.facebookUserId+'"><img width="80" height="80" src="http://graph.facebook.com/'+item.facebookUserId+'/picture"><br>test</a></div>');
	                        counter++;
	                        limit++;
                    	}
                    });
            		friendslist += "</div>";
            		friends.append(friendslist);
            		onUpdate();
               	}, {token: ukaapi_token});
            }
            
            function populateFriend(id) {
            	$('#friend-name').empty();
            	$('#friend-content').html('<p>Loading...</p>')
            	FB.api(id+'', function(response){
            		$('#friend-name').html(response.name);
            		$('#friend-content').empty();
            		$('#friend-content').append('<p>Last seen 17 minutes ago at Klubben</p>');
            		UkaApi('users/'+id+'/location/', function(resp){$('#friend-content').append('<p>'+JSON.stringify(resp)+'</p>');}, {token: ukaapi_token});
            		$('#friend-content').append('<a class="friend-button" href="'+response.link+'" data-role="button">Go to Facebook</a>');
            		findContact(response.name);
            		
            		// Update UI
            		$('#friend').page();
            		$('.friend-button').button();
            		
            	})
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
            
            

            function login() {
            	console.log('login');
                FB.login(
                    function(e) {
                        console.log(e);
                       	UkaApi('auth/login', function(data){console.log(data); ukaapi_token = data;}, {facebookToken: FB.getSession().access_token});
                       	updateBSSID();                
                       	
                    },
                    { perms: "email" }
                );
            }

            document.addEventListener('deviceready', 
            	function(){
	            	try {
	                	FB.init({
	                    	appId: "111446192243028",
	                    	nativeInterface: PG.FB,
	                    	cookie: true,
	                    	xfbml: true
	                    });
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
            
            function contactFound(contacts) {
            	$.each(contacts[0].phoneNumbers, function(index, value){
            		var phoneNumber = value.value;
            		$('#friend-content').append('<a class="friend-button" href="tel:'+phoneNumber+ '" data-role="button">Call '+phoneNumber+'</a>');            		
            		$('.friend-button').button();
            	});
            }
            
            function contactNotFound() {
            }
            
            function findContact(name) {
            	var options = new ContactFindOptions();
            	options.filter=name; 
            	var fields = ["displayName", "name", "phoneNumbers"];
            	navigator.contacts.find(fields, contactFound, contactNotFound, options);
            }

$(document).ready(function() {
	
//	$('#nattbuss-form').submit(function(e){
//		e.preventDefault();
//	});
	$('#nattbuss-submit').click(function() {
		var dataToPost = ({
	          quest: 'når går nattbussen fra samfundet til '+ $('#nattbuss-query').val(),
	          lang: 'sms'
	        });
		$('#nattbuss-result').empty();
		$('#nattbuss-result').append("Henter svar fra bussorakelet");
	        $.post('http://www.idi.ntnu.no/~tagore/cgi-bin/busstuc/busq.cgi', dataToPost, function(data) {
	        			var sakligData = data.replace('+','');
	        			$('#nattbuss-result').empty();
	        			$('#nattbuss-result').append("<h4>Nattbuss</h4>");
	        			$('#nattbuss-result').append("<p>"+sakligData+"</p>");
	        		});
	});
	$('#buss-submit').click(function() {
		var dataToAlsoPost = ({
          quest: 'når går bussen fra samfundet til '+ $('#nattbuss-query').val(),
          lang: 'sms'
        });
		$('#nattbuss-result').empty();
		$('#nattbuss-result').append("Henter svar fra bussorakelet");
        $.post('http://www.idi.ntnu.no/~tagore/cgi-bin/busstuc/busq.cgi', dataToAlsoPost, function(data) {
        			var sakligData = data.replace('+','');
        			$('#nattbuss-result').empty();
        			$('#nattbuss-result').append("<h4>Vanlig buss</h4>");
        			$('#nattbuss-result').append("<p>"+sakligData+"</p>");
        		});
     });
});
