function elm(id){return document.getElementById(id);}
function gecko(){return navigator.userAgent.match(/gecko/i);}
function getTimeStamp(t){var dt = new Date();return dt.getTime();}
function min(a,b){return a<b?a:b;}
function max(a,b){return a>b?a:b;}
function debug(str,owr){if(owr) {document.getElementById("debug").innerHTML = str;} else document.getElementById("debug").innerHTML += str;}

// Cookie functions
function getCookieVal (offset) { 
	var endstr = document.cookie.indexOf (";", offset); 
	if (endstr == -1) 
	endstr = document.cookie.length; 
	return unescape(document.cookie.substring(offset, endstr));
}

function GetCookie (name) { 
	var arg = name + "="; 
	var alen = arg.length; 
	var clen = document.cookie.length; 
	var i = 0; 
	while (i < clen) { 
		var j = i + alen; 
		if (document.cookie.substring(i, j) == arg) 
		return getCookieVal (j); 
		i = document.cookie.indexOf(" ", i) + 1; 
		if (i == 0) break; 
	} 
	return null;
}

function SetCookie (name, value) { 
	var argv = SetCookie.arguments; 
	var argc = SetCookie.arguments.length; 
	var expires = (argc > 2) ? argv[2] : null; 
	var path = (argc > 3) ? argv[3] : null; 
	var domain = (argc > 4) ? argv[4] : null; 
	var secure = (argc > 5) ? argv[5] : false; 
	document.cookie = name + "=" + escape (value) + 
		((expires == null) ? "" : ("; expires=" + expires.toGMTString())) + 
		((path == null) ? "" : ("; path=" + path)) + 
		((domain == null) ? "" : ("; domain=" + domain)) +
		((secure == true) ? "; secure" : "");
}

function DeleteCookie (name) { 
	var exp = new Date(); 
	exp.setTime (exp.getTime() - 1); 
	// This cookie is history 
	var cval = GetCookie (name); 
	document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
}

function getElemFromEvent(e){                                                   
//	if (typeof(e.srcElement)!="undefined") return e.srcElement;             
//	if (typeof(e.target)!="undefined") return e.target;                     
return(e.srcElement)?e.srcElement:e.target;
}

function getControlPrefix() {
   if (getControlPrefix.prefix)
      return getControlPrefix.prefix;
   
   var prefixes = ["MSXML2", "Microsoft", "MSXML", "MSXML3"];
   var o, o2;
   for (var i = 0; i < prefixes.length; i++) {
      try {
         // try to create the objects
         o2 = new ActiveXObject(prefixes[i] + ".DOMDocument");
         return getControlPrefix.prefix = prefixes[i];
      }
      catch (ex) {};
   }
   
   throw new Error("Could not find an installed XML parser");
}

function GetXmlHttp()
{
	var ObjXmlHttp = null ;
	if ( gecko() ) {
		ObjXmlHttp = new XMLHttpRequest() ;
	}
	else{
		ObjXmlHttp = new ActiveXObject(getControlPrefix() + ".XmlHttp") ;
	}
	
	return ObjXmlHttp ;
}



/*
 * evals any scripts inside the "elem" element
 */

function evalScripts(elem){
	var scriptElems = elem.getElementsByTagName("script");
	var length = scriptElems.length;
	if(length > 0)
		for(i=0;i<length;i++)
		{
			var scrptItem = scriptElems.item(i);
			eval(scrptItem.innerHTML)
		}
}



/*
 * gets all those children unto leaf level that have the particular attribute and value
 */
function getChildrenWithAttVal(obj,att,val){
	var oItem = getAllChildNodesWithTag(obj,"a;span;img;td;tr");
	if(oItem==null)
		return null;
	var indx = 0;
	var items = new Array();
	for(var i=0;i<oItem.length;i++){
		var item = oItem[i];
		if (item.nodeName=="#text") continue;
		if (item.getAttribute(att)==val) {
			items[indx++]=item;
		}
	}
	if(items.length>0)
		return items;
	else
		return null;
}


/*
 * gets all those children unto leaf level that have the particular attribute
 */
function getChildrenWithAtt(obj,att){
	var oItem = getAllChildNodesWithTag(obj,"a;span;img;td;tr");
	if(oItem==null)
		return null;
	var indx = 0;
	var items = new Array();
	for(var i=0;i<oItem.length;i++){
		var item = oItem[i];
		if (item.nodeName=="#text") continue;
		if (item.getAttribute(att)) {
			items[indx++]=item;
		}
	}
	if(items.length>0)
		return items;
	else
		return null;
}

/*
 * gets all children upto leaf level 
 */
function getAllChildNodesWithTag(p,taglist)
{
	var j = taglist.split(";");
	var nodes = new Array();
	var idx = 0;
	for( var i=0; i<j.length; i++)
	{
		var child = p.getElementsByTagName(j[i]);
		var count = child.length;
		for(var l=0;l<count;l++)
			nodes[idx++] = child[l];
	}
	if(nodes.length>0)
		return nodes;
	else
		return null;
}

/*
 * returns all children of node "p" that have the tagname as "tag"
 */

function getChildwithTag(p,tag){
	var oItem = p.childNodes;
	var item;
	for(i=oItem.length-1;i>=0;i--){
		item = oItem.item(i);
		if (item.nodeName==tag)
			return item;
	}
	return null;
}

function getElementWithId(p,id){
	var oItem = p.childNodes;
	var item;
	for(i=oItem.length-1;i>=0;i--){
		item = oItem.item(i);
		if (item.id ==id)
			return item;
	}
	return null;
}



function cancelEvent(event){
	event.cancelBubble=true;
	event.returnValue=false;
	if(event.cancelable)
		event.preventDefault();
	return event;
}

// returns parent (starting with elem) having attribute "attr" having value "value"
// if only presence of attribute is required pass empty string in value
function getParentWithAttribute(elem, attr, value)
{
	try
	{
		var eP = elem;
		while (eP != null)
		{
			if (eP.nodeType != 3)
				if (eP.getAttribute(attr) != null && (value == "" || (value != "" && (eP.getAttribute(attr).value).toLowerCase() == value.toLowerCase()))) break;
			eP = eP.parentNode;
		}
	}
	catch (e)
	{
		eP = null;
	}
	return eP;
}

function aonclick(event)
{
	var el = getElemFromEvent(event);
	alert(el);
	if(!el) return;
	var stateid = el.getAttribute("stateid");
	var strHref = el.href.toString();
	if (strHref.indexOf("?") >=0)
		el.href = el.href + "&stateid=" + stateid;
	else
		el.href = el.href + "?stateid=" + stateid;
	cancelEvent(event);
	top.location = el.href;
}
function checkValidEmail(strEmail) 
{
	var atIndex=strEmail.indexOf("@");
	// check for @ being present and not at the start or end.
	if (atIndex==-1 || atIndex==0 || atIndex==strEmail.length){
	   return false;
	}

	var dotIndex=strEmail.indexOf(".");
	// check for . being present and not at the start or end.
	if (dotIndex==-1 || dotIndex==0 || dotIndex==strEmail.length){
	    return false;
	}
	// not more than one @ or  a space in between
	if (strEmail.indexOf("@",(atIndex+1))!=-1 || strEmail.indexOf(" ")!=-1){
		return false;
	}
	// @ and . should not be together.
	if (strEmail.substring(atIndex-1,atIndex)=="." || strEmail.substring(atIndex+1,atIndex+2)=="."){
		return false;
	}
	// there should be a . after the @
	if (strEmail.indexOf(".",(atIndex+2))==-1 ){
		return false;
	}
	return true;
}

function getLeft (oNode){
	var iLeft = 0;
	do{iLeft += oNode.offsetLeft;}
	while((oNode = oNode.offsetParent).tagName != "BODY");
	
	return iLeft;
};

function getTop (oNode){
	var iTop = 0;
	while(oNode.tagName != "BODY" && (iTop += oNode.offsetTop) && (oNode = oNode.offsetParent));
	return iTop;
};
