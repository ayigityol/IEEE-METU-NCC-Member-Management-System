require('cloud/app.js');
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("getOrg", function(request, response) {
	var col = ["TITLE","ORGANISATOR","DATE","LOCATION","TIME","URL","DETAILS"];
	var EVENTS = Parse.Object.extend("EVENTS");
	var query = new Parse.Query(EVENTS);
	query.greaterThan("DATE", new Date());
	query.limit(10);
	query.find({
	  success: function(results) {
		var arr = []
		alert("Successfully retrieved " + results.length + " scores.");
		// Do something with the returned Parse.Object values
		for (var i = 0; i < results.length; i++) { 
		  var object = results[i];
		  var o = {};
		  o["index"] = i;
		  for(j in col){
			o[col[j]] = object.get(col[j]);
		  }
		  arr.push(JSON.stringify(o));
		}
		result = {"results" : arr};
		response.success(JSON.stringify(result));
	  },
	  error: function(error) {
		response.error("Server Query Error!");
	  }
	});

});



Parse.Cloud.define("regUser", function(request, response) {
	var col = ["NAME","EMAIL","PHONE","DEPARTMENT","INTERESTS","STUDENTNO","CLASS","MEMBERNUMBER"];
	var MEMBERS = Parse.Object.extend("MEMBERS");
	var member = new MEMBERS();
	
	for(var i in  col){
		if( request.params[col[i]] != ""){
			member.set(col[i],request.params[col[i]]);
		}
		else{
			response.error("Please do not send empty parameter");
			return;
		}
	}
	member.save(null, {
	  success: function(gameScore) {
		// Execute any logic that should take place after the object is saved.
		response.success("Member has been saved.");
	  },
	  error: function(gameScore, error) {
		// Execute any logic that should take place if the save fails.
		// error is a Parse.Error with an error code and message.
		response.error(JSON.stringify(error));
	  }
	});
});



Parse.Cloud.define("fetchMembers", function(request, response) {
	if(request.params.U == "yigit" && request.params.P == "yigit123" && "MEMBERS" == request.params.CLASS){
		Parse.Cloud.useMasterKey();
		var MEMBERS = Parse.Object.extend("MEMBERS");
		var query = new Parse.Query(MEMBERS);
		query.select("NAME", "EMAIL", "PHONE", "DEPARTMENT", "STUDENTNO", "CLASS");
		query.find().then(function(results) {
			if(results.length != 0){
				response.success(JSON.stringify(results));
			}
			else{
				response.success(new Object());
			}
		});
	}
	else
		response.error("INVALID REQUEST");
	
	
});


Parse.Cloud.job("userRandClear", function(request, status) {
	var str = "";
	Parse.Cloud.useMasterKey();
	var USERRAND = Parse.Object.extend("USERRAND");
	var query = new Parse.Query("USERRAND");
	query.each(function(userrand) {
		   return userrand.destroy();
			}).then(function() {
			// Set the job's success status
			str += "USERRAND Cleared!";
			status.success(str);
		  }, function(error) {
			// Set the job's error status
			str += "USERRAND Cannot Cleared!";
			status.error(str);

	});	
});




/*
Parse.Cloud.define("hhjklhj", function(request, response) {
	var str = "";
	var jo = {};
	var x = 0;
	Parse.Cloud.useMasterKey();	
	var USERRAND = Parse.Object.extend("Xamarin");
	var query = new Parse.Query("Xamarin");
	query.equalTo("KONT", 1);
	query.find({
	  success: function(results) {
		// Do something with the returned Parse.Object values
		for (var i = 0; i < results.length; i++) {
		  var object = results[i];
		  
		  str += object.get('EMAIL') + " , ";
		}
		x = results.length;
		jo["len"] = x;
		jo["inf"] = str;
		
		response.success(JSON.stringify(jo));
	  },
	  error: function(error) {
		response.error("Error");
	  }
	});
	

});



Parse.Cloud.define("hhjklhj2", function(request, response) {
	var str = "";
	var jo = {};
	var x = 0;
	Parse.Cloud.useMasterKey();	
	var XAMARIN = Parse.Object.extend("Xamarin");
	var query = new Parse.Query("Xamarin");
	query.equalTo("KONT", 2);
	query.find({
	  success: function(results) {
		// Do something with the returned Parse.Object values
		for (var i = 0; i < results.length; i++) {
		  var object = results[i];
		  
		  str += object.get('EMAIL') + " , ";
		}
		x = results.length;
		jo["len"] = x;
		jo["inf"] = str;
		
		response.success(JSON.stringify(jo));
	  },
	  error: function(error) {
		response.error("Error");
	  }
	});
	

});




Parse.Cloud.define("asdf123", function(request, response) {
	var str = "";
	var str2 = "";
	var jo = {};
	var x = 0;
	Parse.Cloud.useMasterKey();	
	var query = new Parse.Query("MEMBERS");
	query.find({
	  success: function(results) {
		// Do something with the returned Parse.Object values
		for (var i = 0; i < results.length; i++) {
		  var object = results[i];
		  str += (i + 1) + " , " + object.get('NAME') + " , ";
		  str += object.get("STUDENTNO") + " , ";
		  str += object.get('EMAIL') + " , ";
		  str += object.get("DEPARTMENT") + " , ";
		  str += object.get("CLASS") + " \n";
		  
		  
		}
		
		
		response.success(str);
	  },
	  error: function(error) {
		response.error("Error");
	  }
	});
	

});



Parse.Cloud.define("asdf1234", function(request, response) {
	var str = "";
	var str2 = "";
	var jo = {};
	var x = 0;
	Parse.Cloud.useMasterKey();	
	var query = new Parse.Query("Xamarin");
	query.find({
	  success: function(results) {
		// Do something with the returned Parse.Object values
		for (var i = 0; i < results.length; i++) {
		  var object = results[i];
		  str += (i + 1) + " , " + object.get('NAME') + " , ";
		  str += object.get("STUDENTNO") + " , ";
		  str += object.get('EMAIL') + " , ";
		  str += object.get("DEPARTMENT") + " , ";
		  str += object.get("CLASS") + " \n";
		  
		  
		}
		
		
		response.success(str);
	  },
	  error: function(error) {
		response.error("Error");
	  }
	});
	

});


Parse.Cloud.define("asdf12345", function(request, response) {
	var str = "";
	var str2 = "";
	var jo = {};
	var x = 0;
	Parse.Cloud.useMasterKey();	
	var query = new Parse.Query("JAVA");
	query.find({
	  success: function(results) {
		// Do something with the returned Parse.Object values
		for (var i = 0; i < results.length; i++) {
		  var object = results[i];
		  str += (i + 1) + " , " + object.get('NAME') + " , ";
		  str += object.get("STUDENTNO") + " , ";
		  str += object.get('EMAIL') + " , ";
		  str += object.get("DEPARTMENT") + " , ";
		  str += object.get("CLASS") + " \n";
		  
		  
		}
		
		
		response.success(str);
	  },
	  error: function(error) {
		response.error("Error");
	  }
	});
	

});



Parse.Cloud.define("asdf123456", function(request, response) {
	var str = "";
	var str2 = "";
	var jo = {};
	var x = 0;
	Parse.Cloud.useMasterKey();	
	var query = new Parse.Query("ESHARP");
	query.find({
	  success: function(results) {
		// Do something with the returned Parse.Object values
		for (var i = 0; i < results.length; i++) {
		  var object = results[i];
		  str += (i + 1) + " , " + object.get('NAME') + " , ";
		  str += object.get("STUDENTNO") + " , ";
		  str += object.get('EMAIL') + " , ";
		  str += object.get("DEPARTMENT") + " , ";
		  str += object.get("CLASS") + " \n";
		  
		  
		}
		
		
		response.success(str);
	  },
	  error: function(error) {
		response.error("Error");
	  }
	});
	

});

*/
