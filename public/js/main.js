function confirmform(){
	tags=["title","Location","Date","Time","picUrl"];
	tags2=["SB","CS","GDC","HRC","OC","PES","WIE"];
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
	for(i in tags2){
		if(document.getElementById(tags2[i]).checked){
			o["Organisator"]=document.getElementById(tags2[i]+"L").innerHTML;
			size++;
		}
	}
	
	var fin = JSON.stringify(o);
	if(fin.search("undefined") != -1 || fin.search("null") != -1 || size < tags.length + 1){
		alert("Form has not finished yet!");
		return;
	}
	fin = fin.replace(/,/g,"\n");
	fin = fin.replace(/{/g,"");
	fin = fin.replace(/}/g,"");
	fin = fin.replace(/"/g,"");
	if(confirm("Please check information below and make sure it is correct after confirm.\n" +fin)){
		document.getElementById("formid").submit();
	}
	

}

if(location.href.indexOf('?') != -1){
	history.pushState(null, "Register an Organisation Form", "form.html");
}
