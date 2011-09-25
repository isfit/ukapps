



			var ukaapi_token = "adsd";
			var locations;
			
            FB.Event.subscribe('auth.login', function(response) {
                console.log('auth.login event');
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
               		method: "POST",
               		parameters: parameters
               	};
               	OAuth.completeRequest(message, accessor);
	           	OAuth.SignatureMethod.sign(message, accessor);
	           	url = url+'?'+OAuth.formEncode(message.parameters);
				console.log(url);
				console.log(data);
				alert(dataType+" "+data);           	
	           	$.ajax({url: url, success: onReceive, error: function(a, b) {console.log(JSON.stringify(a) + "---" + b); }, async: true, type: "POST", data: data, dataType: dataType });
	      	}
	      	function UkaApiPut(url, onReceive, parameters, dataType){
                var url = 'http://findmyapp.net/findmyapp/'+url;
          		var accessor = {
               		consumerKey: '6b2d7fe03b4bb7ea775f63119e92ea468204aaf1',
               		consumerSecret: 'bab92e0c1945459dfea90772b36189d9e68dfdae'
               	};
               	var message = {
               		action: url,
               		method: "PUT",
               		parameters: parameters
               	};
               	OAuth.completeRequest(message, accessor);
	           	OAuth.SignatureMethod.sign(message, accessor);
	           	url = url+'?'+OAuth.formEncode(message.parameters);
	           	$.ajax({url: url, success: onReceive, error: function(a, b) {console.log(url+" ------- "+JSON.stringify(a) + "---" + b); }, async: true, type: "PUT", dataType: dataType });
	      	}
	      	function SyncedUkaApi(url, onReceive, parameters){
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
	           	$.ajax({url: url, success: onReceive, error: function(a, b) {console.log(url+" ------- "+JSON.stringify(a) + "---" + b); },  async: false, dataType: "json" });
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
	           	$.ajax({url: url, success: onReceive, error: function(a, b) {url+" ------- "+console.log(JSON.stringify(a) + "---" + b); },  async: true, dataType: "json" });
            }
            function updateBSSID(){
            	window.plugins.wifiBssid.list("", function(r) {
            		console.log(JSON.stringify(r.wifiList)); 
            		var datating = JSON.stringify(r.wifiList);
            		console.log(datating);
            		$.ajax({	url: "http://findmyapp.net/findmyapp/locations", 
            					success: function(data){
            						UkaApiPut('users/me/location/'+data.locationId, function(data1){console.log("Ny lokasjon registrert");}, {token: ukaapi_token}, "");
            						alert(JSON.stringify("Her er du: "+data.locationName));
            					}, 
            					async: true, 
            					type: "POST",
     							contentType: 'application/json',
            					data: datating,
            					statusCode: {
    								404: function() {
    									console.log("404 NOT FOUND");
    								}
    							}	 
            		});
            	}, function(e) {alert(e);console.log(e);});
            }
			function lastSeen(fuid){
				var tida = null;
				locations.forEach(function(l) {
					if(parseInt(l.userId) === parseInt(fuid)){
						tida = l.timestamp;
					}
				});
				return tida;
			}
            function populateFriendsList() {
            	SyncedUkaApi('users/me/friends/all/location', function(data){locations = data;}, {token: ukaapi_token});
            	UkaApi('users/me/friends', function(response) { 
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
	                    	var at_samf = false;
	                    	locations.forEach(function(l) {
	                    		if(l.userId === item.localUserId && l.timestamp > ((new Date().getTime())-21600000)){
	                    			at_samf = true;
	                    		}
	                    	});
	                        friendslist += ('<div class="ui-block-'+letter+'"><a href="#friend" class="friend" data-id="'+item.facebookUserId+"-"+item.localUserId+'"><img width="80" height="80" src="http://graph.facebook.com/'+item.facebookUserId+'/picture"><br>'+((at_samf)?"* ":"")+item.fullName+'</a></div>');
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
            	var ids = id.split('-'); 
            	$('#friend-name').empty();
            	$('#friend-content').html('<p>Loading...</p>')
            	FB.api(ids[0]+'', function(response){
            		$('#friend-name').html(response.name);
            		UkaApi('users/'+ids[1]+'/location', function(resp){
            			$('#friend-content').empty();
            			$('#friend-content').append('<p>'+((resp==null)?"Ikke sett på Samfundet i det siste":"Sist sett på "+resp.locationName+" "+ukaDate(new Date(lastSeen(ids[1]))))+'</p>');
            			$('#friend-content').append('<a class="friend-button" href="'+response.link+'" data-role="button">Go to Facebook</a>');
            			
            			findContact(response.name);
	
            			// Update UI
            			$('#friend').page();
            			$('.friend-button').button();
            		}, {token: ukaapi_token});
            	})
            	
            }
            function refresh(){
            	populateFriendsList();
				updateBSSID();              
            }
            function ukaDate(date) {
            	return date.getDate()+"/"+(date.getMonth()+1)+" kl. "+date.getHours()+":"+((date.getMinutes() < 10) ? "0" : "" )+ date.getMinutes();
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
                       	SyncedUkaApi('auth/login', function(data){console.log(data); ukaapi_token = data;}, {facebookToken: FB.getSession().access_token});
	                    refresh();
                    },
                    { perms: "email" }
                );
            }

            document.addEventListener('deviceready', 
            	function(){
	            	try {
	                	FB.init({
	                    	appId: "292141370803181",
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
	$('.friend').click(function() {
		populateFriend($(this).data("id"));
	})
});
