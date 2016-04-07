function confirmform(){
	tags=["NAME","EMAIL","PHONE","STUDENTNO","DEPARTMENT", "CLASS"];
	var o = {};
	var size = 0;
	for(i in tags){
		if(document.getElementById(tags[i]).value.length != 0){
			o[tags[i]]=document.getElementById(tags[i]).value;
			size++;
		}
		else{
			alert("Form has not finished yet!");
			return;
		}
			
	}
	
	if(confirm("You are sending IEEE METU NCC Registeration form. Make sure all information is correct! If so please confirm.")){
		document.getElementById("formid").submit();
	}
	

}

if(location.href.indexOf('?') != -1){
	history.pushState(null, "Register an Organisation Form", "xamarin.html");
}
