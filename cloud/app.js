// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var app = express();
var Mandrill = require('mandrill');
Mandrill.initialize('NOTSHARED');
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body
 
 
//////////////////////////////////////////////////////////////////////////////////////////////
// login interface
//////////////////////////////////////////////////////////////////////////////////////////////
 
app.get('/login', function(req, res) { 
    res.render('login2', {});
});
 
 
//////////////////////////////////////////////////////////////////////////////////////////////
// 
//////////////////////////////////////////////////////////////////////////////////////////////
app.post("/app", function(req,res){
	Parse.Cloud.useMasterKey();
	Parse.Cloud.httpRequest({
		method: 'POST',
		url: 'NOTSHARED' +req.param("g-recaptcha-response") ,
		success: function(httpResponse) {
		  if(httpResponse.data.success){//recap testi.
			var MEMBERS = Parse.Object.extend("MEMBERS2");
			var q = new Parse.Query(MEMBERS);
			q.equalTo("EMAIL", req.body["email"]);
			q.limit(1);
			q.find({
				success: function(results) {
					if(results.length == 0){//email kayitli degil
						console.log("Email Kayitli degil");
						res.redirect("/");
					}
					else{//email ok
						console.log("email ok");
						if(results[0].get("PASS") == req.body.password){
							console.log("sifre ok");
							if(results[0].get("LEVEL") == "A")
							{	
								var ev = ["","","","","",""];
								var mem = ["","","","","",""];
								var evT = ["TITLE", "DATE", "TIME", "LOCATION" ]; //db coloumn event
								var memT = ["NAME", "EMAIL", "PHONE", "STUDENTNO", "DEPARTMENT", "CLASS" ]; //db coloumn member
								//RENDER W/ ADMIN
								var EVENTS = Parse.Object.extend("EVENTS");
								var q2 = new Parse.Query(EVENTS);
								q2.limit(10);
								q2.find({
								  success: function(results2) {
									for (var i in results2){
										for(var k=0; k<4; k++){
											if(k == 1){
												x = results2[i].get(evT[k]);
												d = x.getDate() + "/" + (x.getMonth()+1)  + "/" + x.getYear();
												ev[k] += '<div class="cell w-100"><p class="normal">' + d + '</p></div>\n';
							
											}
												
											else
												ev[k] += '<div class="cell w-100"><p class="normal">' + results2[i].get(evT[k]) + '</p></div>\n';
										}
										ev[4] +='<div class="cell w-100"><p class="normal"> - </p></div>\n'; // to do status
										ev[5] +='<div class="cell w-100"><p class="normal"> - </p></div>\n'; // to do button
									}
								}
								});
									
								var MEMBERS = Parse.Object.extend("MEMBERS");
								var q3 = new Parse.Query(MEMBERS);
								q3.find({
								  success: function(results2) {
									for (var i in results2){
											for(var k=0; k<6; k++){
												if(k == 0){
													if (results2[i].get(memT[k]).split(" ").length > 2){
														names= results2[i].get(memT[k]).split(" ").filter(Boolean);
														mem[k] += '<div class="cell w-100"><p class="normal">' + names[1] + " " + names[names.length-1] + '</p></div>\n';
													}
													else
														mem[k] += '<div class="cell w-100"><p class="normal">' + results2[i].get(memT[k]) + '</p></div>\n';
													
												}
												else 
													mem[k] += '<div class="cell w-100"><p class="normal">' + results2[i].get(memT[k]) + '</p></div>\n';
											}
										}
									res.render('admin', {title : ev[0], datee : ev[1], time: ev[2], location:ev[3], status:ev[4], buttons:ev[5], name:mem[0], email: mem[1],
									phone: mem[2], studentno:mem[3], department:mem[4] , id:results[0].get("objectId")});
							
								  }
								});
								
							}
							else if(results[0].get("LEVEL") == "YK"){
								res.send("YK");
								//RENDER W/ ADMIN	
							}
							else if(results[0].get("LEVEL") == "IK"){
								res.send("IK");
								//RENDER W/ ADMIN
							}
							else if(results[0].get("LEVEL") == "O"){
								res.send("O");
								//RENDER W/ ADMIN
							}
							else if(results[0].get("LEVEL") == "M"){
								res.send("M");
								//RENDER W/ ADMIN
							}
							else{
								res.redirect("/");
								//user has no permision LEVEL
							}
						}
						else{
							console.error("Sifre yanlis");
							res.redirect("/");
						}
						
					}
				},
				error: function(newlog, error) { //database hatasi
						console.error("Database hatasi loginde!");
                        res.redirect("/");

                      }
				});
		  }
		  else{
			res.redirect("/");	//LOGIN WITHOUT RECAP REQ.
		  }
		},
		error: function(httpResponse) { //SERVERSIDE RECAP ERROR
		  res.redirect('/');
		}
	});
});
 
 
 //////////////////////////////////////////////////////////////////////////////////////////////
// auth-member-check function. (after login)
//////////////////////////////////////////////////////////////////////////////////////////////
app.post("/register2", function(req,res){
	Parse.Cloud.useMasterKey();
	Parse.Cloud.httpRequest({
		method: 'POST',
		url: 'NOTSHARED' +req.param("g-recaptcha-response") ,
		success: function(httpResponse) {
		  if(httpResponse.data.success){//recap testi.
		    
			tags=["NAME","EMAIL","PHONE","STUDENTNO","DEPARTMENT", "CLASS"];
			var MEMBERS = Parse.Object.extend("MEMBERS2");
			var q = new Parse.Query(MEMBERS);
			q.equalTo("EMAIL", req.body["email"]);
			q.limit(1);
			q.find({
				success: function(results) {//new user test
					if(results.length != 1){//new user.
						var pass = Math.random().toString(36).slice(-8);
						var newmember = new MEMBERS();
						var acl = new Parse.ACL();
						acl.setPublicReadAccess(false);
						acl.setPublicWriteAccess(false);
						newmember.set(tags[0], req.body.name.toUpperCase());
						newmember.set(tags[1], req.body.email);
						newmember.set(tags[2], req.body.phone);
						newmember.set(tags[3], parseInt(req.body.studentno));
						newmember.set(tags[4], req.body.dep);
						newmember.set(tags[5], parseInt(req.body.clas));
						newmember.set("PASS",pass)
						newmember.set("LEVEL","M");
						Mandrill.sendEmail({
							message: {
								text: "Hi " + req.body.name.split(' ')[0] + ",\n\tYou are welcome to IEEE METU NCC Student Branch. Your detailed login information is below,\n\t* Email : " + req.body.email + "\n\t* Password : " + pass + "\nIEEE METU NCC SB.",
								subject: "Welcome to IEEE METU NCC Student Branch",
								from_email: "no-reply@ieee.ncc.metu.edu.tr",
								from_name: "IEEE METU NCC",
								to: [
								  {
									email: req.body.email,
									name: req.body.name
								  }
								]
							},
							async: true
							},{
							success: function(httpResponse) {
								console.log(httpResponse);
								//response.success("Email sent!");
							},
							  error: function(httpResponse) { //error info dialog gosterilecek.
								console.error(httpResponse);
								//response.error("Uh oh, something went wrong");
							}
						});
						newmember.set("ACL",acl);
						newmember.save(null, {
											success: function(eventObj) {
												res.render('infobox', {title : "You have been registered.", title2 : "Welcome to IEEE METU NCC Student Branch", title3: ""});
												
											},
											error: function(eventObj, error) {
												res.render('infobox', {title : "Registration have been failed!", title2 : "Please try again!", title3: ""});

											}
										});
					}
					else{ //already registered.
						res.render('infobox', {title : "Registration have been failed!", title2 : "You've been registered before.", title3: ""});
					}
				},
				error: function(newlog, error) { //database hatasi
						console.error("Database hatasi loginde!");
                        res.redirect("/");

                }});
		  }
		  else{
			res.redirect("/");	//LOGIN WITHOUT RECAP REQ.
		  }
		},
		error: function(httpResponse) { //SERVERSIDE RECAP ERROR
		  res.redirect('/');
		}
	});
});
 
 
 
 
app.get('/check', function(req, res) { 
    var OPERATORS = Parse.Object.extend("OPERATORS");
    var q = new Parse.Query(OPERATORS);
    q.equalTo("USERNAME", req.query["user"]);
    q.find({
        success: function(results) {
             
            for (var i = 0; i < results.length; i++) { 
                var sess = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                                                                                                            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                                                                                                            return v.toString(16);
                                                                                                            });
                var object = results[i];
                if( req.query["password"] == object.get('PASSWORD')){
                    var LOG = Parse.Object.extend("LOG");
                    var newlog = new LOG();
                    newlog.set("USERNAME", req.query["user"]);
                    newlog.set("KEY", sess);                                                                                                                        
                    newlog.save(null, {
                      success: function(newlog) {
                        res.redirect("/app?user="+encodeURIComponent(req.query["user"])+"&no="+encodeURIComponent(sess));
                      },
                      error: function(newlog, error) {
                        res.redirect("/login");
                      }
                    });
                    return;
                }
            }
            res.redirect("/login");
        },
        error: function(error) {
            res.redirect("/login");
        }
    });
});
 */
 
//////////////////////////////////////////////////////////////////////////////////////////////
// organisation register interface.
//////////////////////////////////////////////////////////////////////////////////////////////
app.get('/app', function(req, res) { 
     
    var LOG = Parse.Object.extend("LOG");
    var q = new Parse.Query(LOG);
    q.equalTo("USERNAME",req.query.user);
    q.find({
      success: function(results) {
        if(results.length == 0){
            res.redirect("/login");
        }
        for (var i = 0; i < results.length; i++) { 
          var object = results[i];
          if(object.get("KEY") == req.query.no){
              object.destroy({
                  success: function(object) {
                  var sess = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                                                                                                            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                                                                                                            return v.toString(16);
                                                                                                            });
                  
                 var LOG = Parse.Object.extend("LOG");
                 var newlog = new LOG();
                 newlog.set("USERNAME", req.query["user"]);
                 newlog.set("KEY", sess);                                                                                                                       
                 newlog.save(null, {
                   success: function(newlog) {
                     res.render('form', {value : encodeURIComponent(sess), value2 : encodeURIComponent(req.query.user)});
                   },
                   error: function(newlog, error) {
                     res.redirect("/login");
                   }
                 });
                     
                  },
                  error: function(object, error) {
                     
                    res.redirect("/login");
                  }
               });
          }
        }
      },
      error: function(error) {
        res.redirect("/login");
      }
    });
});
 
 
//////////////////////////////////////////////////////////////////////////////////////////////
//user register interface
//////////////////////////////////////////////////////////////////////////////////////////////
 
app.get('/register', function(req, res) { 
    var sess = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                                                                                                                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                                                                                                                return v.toString(16);
                                                                                                                });
    res.render('form2', {value:sess});
    var USERRAND = Parse.Object.extend("USERRAND");
    var rand = new USERRAND();
    rand.set("KEY", sess);
    rand.save(null, {
                          success: function(eventObj) {
                            res.redirect("/userregister");
                            return;
                          },
                          error: function(eventObj, error) {
                            res.redirect("/");
                            return;
                        }
                        });
     
             
     
});
 
 
//////////////////////////////////////////////////////////////////////////////////////////////
//user register database connection and redirect to infobox
//////////////////////////////////////////////////////////////////////////////////////////////
 
app.get('/userregister', function(req, res) { 
 
    tags=["NAME","EMAIL","PHONE","STUDENTNO","DEPARTMENT", "CLASS","MEMBERNUMBER"];
    var USERRAND = Parse.Object.extend("USERRAND");
    var q = new Parse.Query(USERRAND);
    q.equalTo("KEY", req.query.k);
 
    q.find({
        success: function(results) {
            if(results.length == 0){
                res.render('infobox', {title : "Registration have been failed!", title2 : "Please try again!", title3: ""});
                return;
            }
         
            for (var i = 0; i < results.length; i++) { 
                var object = results[i];
                if(object.get("KEY") == req.query.k){
                    object.destroy({
                        success: function(object) {
                            var MEMBERS = Parse.Object.extend("MEMBERS");
                            var newmember = new MEMBERS();
                            var acl = new Parse.ACL();
                            acl.setPublicReadAccess(false);
                            acl.setPublicWriteAccess(false);
                            newmember.set(tags[0], req.query.NAME);
                            newmember.set(tags[1], req.query.EMAIL);
                            newmember.set(tags[2], req.query.PHONE);
                            newmember.set(tags[3], parseInt(req.query.STUDENTNO));
                            newmember.set(tags[4], req.query.DEPARTMENT);
                            newmember.set(tags[5], parseInt(req.query.CLASS));
                            newmember.set(tags[6], parseInt(req.query.MEMBERNO));
                            newmember.set("ACL",acl);
                             
                            newmember.save(null, {
                                success: function(eventObj) {
                                    res.render('infobox', {title : "You have been registered.", title2 : "Welcome to IEEE METU NCC Student Branch", title3: ""});
                                    return;
                                },
                                error: function(eventObj, error) {
                                    res.render('infobox', {title : "Registration have been failed!", title2 : "Please try again!", title3: ""});
                                    return;
                                }
                            });
                        }, 
                        error: function(object, error) {
                            res.render('infobox', {title : "Registration have been failed!", title2 : "Please try again!", title3: ""});
                            return;
                        }
                    });
                }
            }
         
        },
        error: function(eventObj, error) {
            res.redirect("/");
            return;
        }
    });
});
 
 
//////////////////////////////////////////////////////////////////////////////////////////////
// organisation register database connection redirect to infobox.
//////////////////////////////////////////////////////////////////////////////////////////////
 
app.get('/sent', function(req, res) { 
    var LOG = Parse.Object.extend("LOG");
    var q = new Parse.Query(LOG);
    q.equalTo("USERNAME", req.query.u);
    q.find({
      success: function(results) {
        if(results.length == 0){
            res.redirect("/");
        }
        else{
            for (var i = 0; i < results.length; i++) { 
              var object = results[i];
              if(object.get("KEY") == req.query.k){
                  object.destroy({
                  success: function(object) {
                   
                      var EVENTS = Parse.Object.extend("EVENTS");
                      var eventObj = new EVENTS();
                      eventObj.set("TITLE", req.query.title);
                      eventObj.set("LOCATION", req.query.Location);
                      eventObj.set("DATE", new Date(req.query.Date));
                      eventObj.set("TIME", req.query.Time);
                      eventObj.set("PICURL", req.query.picUrl);
                      eventObj.set("DETAILS", req.query.organisator);
                      eventObj.set("ADDEDBY","a");
                      eventObj.set("ORGANISATOR","s");
                      eventObj.save(null, {
                          success: function(eventObj) {
                            // Execute any logic that should take place after the object is saved.
                            res.render('infobox', {title : "Organisation Created!", title2 : "Organisation information", title3: "Title : " + req.query.title + "\nLocation : " + req.query.Location + "\nDate : " + req.query.Date + "\nTime : " + req.query.Time + "\nPICURL : " + req.query.picUrl + "\nDetails : " + req.query.organisator});
                            return;
                          },
                          error: function(eventObj, error) {
                            // Execute any logic that should take place if the save fails.
                            // error is a Parse.Error with an error code and message.
                            res.render('infobox', {title : "Organisation failed!", title2 : "Please try again!", title3: ""});
                            return;
                          }
                        });
                      },
                  error: function(object, error) {
                    // The delete failed.
                    // error is a Parse.Error with an error code and message.
                    res.redirect("/");
                    return;
                  }
                });  
               
                }
            }
         }
      },
      error: function(error) {
        res.redirect("/");
        return;
      }
    });
     
});
 
 
 

//////////////////////////////////////////////////////////////////////////////////////////////
// Java register database connection redirect to infobox.
//////////////////////////////////////////////////////////////////////////////////////////////

app.get('/registerJava', function(req, res) { 

	tags=["NAME","EMAIL","PHONE","STUDENTNO","DEPARTMENT", "CLASS"];
	var JAVA = Parse.Object.extend("JAVA");
	var newmember = new JAVA();
	var acl = new Parse.ACL();
	acl.setPublicReadAccess(false);
	acl.setPublicWriteAccess(false);
	newmember.set(tags[0], req.query.NAME);
	newmember.set(tags[1], req.query.EMAIL);
	newmember.set(tags[2], req.query.PHONE);
	newmember.set(tags[3], parseInt(req.query.STUDENTNO));
	newmember.set(tags[4], req.query.DEPARTMENT);
	newmember.set(tags[5], parseInt(req.query.CLASS));
	if(req.query.SECTION)
		newmember.set("SECTION", req.query.SECTION);
	else
		newmember.set("SECTION", "3");
	newmember.set("ACL",acl);
	newmember.save(null, {
		success: function(eventObj) {
			res.render('infobox', {title : "Basvurunuz alinmistir.", title2 : "Java programlama egitimlerimize basvurdugunuz icin tesekkur ederiz.", title3: ""});
			return;
		},
		error: function(eventObj, error) {
			res.render('infobox', {title : "Basvurunuz kaydedilemedi", title2 : "Lutfen hata ile ilgili Yigit YOL ile iletisime geciniz.", title3: ""});
			return;
		}
	});
});


//////////////////////////////////////////////////////////////////////////////////////////////
// JAVA interface
//////////////////////////////////////////////////////////////////////////////////////////////

app.get('/java', function(req, res) { 
	res.render('formjava', {});
});









app.listen();