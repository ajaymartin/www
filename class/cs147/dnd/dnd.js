//dnd.js

var NOWIDGETS = 6
var MAXCOLS = 2,
	MAXROWS = MAXCOLS*NOWIDGETS;
var frame_padding = 2;
var titlebar_h = 19;
var toolbar_h = 10;
var statusbar_h = 20;
var clientarea_margin = 4;

// to save window height when window is minimized
var last_window_h;

// preload button images to ensure un-delayed image swapping    
var button_down_outset = new Image();
var button_down_inset = new Image();
var button_up_outset = new Image();
var button_up_inset = new Image();


function init()
{
	createWidgetLayoutTable();		//create main display table layout
	createAndRenderWidgets(true);	//render widgetxml into this table and create widgets 
	dragnDropInit();				//init the widgets for drag and drop
	preloadImages();
}


function preloadImages()
{
	button_down_outset.src = 'images/button_down_outset.gif';
	button_down_inset.src = 'images/button_down_inset.gif';
	button_up_outset.src = 'images/button_up_outset.gif';
	button_up_inset.src = 'images/button_up_inset.gif';
}

function createWidgetLayoutTable(){
	var tbl = document.getElementById("main");
	var col, row;
	for(col=0;col<MAXCOLS;col++) {
		var cell = tbl.rows[0].insertCell(col);
		cell.style.cssText="margin-bottom:20px;";
		cell.style.width = 100/MAXCOLS+"%";
		var oInnerTable = document.createElement("TABLE");

		for(row = 0; row <MAXROWS;row++) {
			oInnerTableRow = oInnerTable.insertRow(0);
			var iCell = oInnerTableRow.insertCell(0);
			iCell.style.cssText = "padding-bottom:7em;";
//			iCell.innerHTML = "hellow";
		}
		cell.appendChild(oInnerTable);
	}
}

function createAndRenderWidgets(bCreateWidgets)
{
	var tbl = document.getElementById("main");
	var i = 0;
	var oWidgetListHolder=document.getElementById("widgets");
	var oWidgetList = oWidgetListHolder.childNodes;

	while(i<oWidgetList.length) 
	{
		var	widget = oWidgetList[i];
		if(widget.nodeName!="#text"){
			var widgetRow = widget.getAttribute("row");
			var widgetCol = widget.getAttribute("col");
			var widgetTitle = getElementWithId(widget,"widgettitle");
			var widgetContent = getElementWithId(widget,"widgetcontent");
			
			var oInnerTable = tbl.rows[0].cells[widgetCol].childNodes[0];
			oInnerTable.rows[widgetRow].cells[0].appendChild(widget);
			if(bCreateWidgets)
				createWidgetWindow(widgetTitle.innerHTML, widgetContent.innerHTML, widgetCol, widgetRow)
		}
		i++;
	}
	
}

function createWidgetWindow(titleHtml, contentHtml, atCol, atRow, atX, atY )
{

/*
  <div id="frame" style="position:absolute;left:130px;top:150px;width:300px;height:240px;border:2px outset #eeeeee;background:#cccccc;visibility:hidden;"></div>

  <div id="titlebar" style="position:absolute;border:none;background:#4455aa;overflow:hidden;visibility:hidden;"><span style="position:relative;left:2px;top:2px;padding:0px;color:white;font-weight:bold;font-size:11px;font-family:Verdana,Geneva,sans-serif;">&nbsp;Window Simulation</span></div>
  <div id="clientarea" style="position:absolute;border:2px inset #cccccc;background:white;overflow:auto;visibility:hidden;">
	content inside here
  </div>

<img name="resizehandle" src="images/winresize.gif" width="20" height="20" alt="" style="visibility:hidden;">
<img name="resizebutton" src="images/button_up_outset.gif" width="16" height="14" alt="" style="visibility:hidden;">


*/


	var widgetFrame = document.createElement("DIV");
	widgetFrame.setAttribute("id","frame"+ atCol + "_" + atRow);
	widgetFrame.style.cssText = "position:absolute;left:130px;top:150px;"
								"width:300px;border:2px outset #eeeeee;"
								"background:gray;";
	widgetFrame.style.background = "#cccccc";
	widgetFrame.style.border = "2px outset #eeeeee";
	widgetFrame.setAttribute("onClick","widgetClicked("+atCol+","+atRow+")");
	document.body.appendChild(widgetFrame);

	var widgetTitle = document.createElement("DIV");
	widgetTitle.setAttribute("id","titlebar"+atCol+"_"+atRow);
	widgetTitle.style.cssText = "position:absolute;border:none;background:darkred;overflow:hidden;";
	widgetTitle.innerHTML = titleHtml;
	document.body.appendChild(widgetTitle);
	
	//create content frame
	var widgetContent = document.createElement("DIV");
	widgetContent.setAttribute("id","content"+atCol+"_"+atRow);
	widgetContent.style.cssText = "position:absolute;overflow:auto;background:white";
	widgetContent.setAttribute("row",atRow);
	widgetContent.setAttribute("col",atCol);
	widgetContent.innerHTML = contentHtml;
	widgetContent.setAttribute("onClick","widgetClicked("+atCol+","+atRow+")");
	document.body.appendChild(widgetContent);

	var resizeHandleImg = document.createElement("IMG");
	resizeHandleImg.setAttribute("id","resizehandle"+atCol+"_"+atRow);
	resizeHandleImg.setAttribute("src","images/winresize.gif");
	resizeHandleImg.setAttribute("width","20px");
	resizeHandleImg.setAttribute("height","20px");

//	resizeHandleImg.style.cssText = "visibility:hidden");
	document.body.appendChild(resizeHandleImg);

	var resizeHandleBtn = document.createElement("IMG");
	resizeHandleBtn.setAttribute("id","resizebutton"+atCol+"_"+atRow);
	resizeHandleBtn.setAttribute("src","images/button_up_outset.gif");
	resizeHandleBtn.setAttribute("width","16px");
	resizeHandleBtn.setAttribute("height","14px");
//	resizeHandleBtn.style.cssText = "visibility:hidden");
	document.body.appendChild(resizeHandleBtn);
}

function widgetClicked(col, row){
	var titlebar = eval("dd.elements.titlebar"+col+"_"+row);	
	titlebar.maximizeZ();
	titlebar.maximizeZ();
}

function getTableIdString (){
	var col, row;
	var idStr = "";
	for(col=0;col<MAXCOLS;col++) 
		for(row = 0; row <MAXROWS;row++)  
			idStr += "\"titlebar"+ col + "_" + row + "\"+CURSOR_MOVE+TRANSPARENT, " +
						"\"frame"+ col + "_" + row + "\"+NO_DRAG, " +
						"\"resizehandle"+ col + "_" + row + "\"+MAXOFFLEFT+210+MAXOFFTOP+90+CURSOR_NW_RESIZE, " +
						"\"resizebutton"+ col + "_" + row + "\"+VERTICAL+HORIZONTAL, " +
						"\"content"+ col + "_" + row + "\" +NO_DRAG+TRANSPARENT+CLONE , ";
	return idStr.substr(0,idStr.length-2);
			
}


function dragnDropInit()
{

	eval( 
		"SET_DHTML(CURSOR_MOVE, " + getTableIdString() + ");"
	);
	
	setupWidgetPositions();

	var col, row;
	for(col=0;col<MAXCOLS;col++) 
		for(row = 0; row <MAXROWS;row++){
			
			var titlebar = eval("dd.elements.titlebar"+col+"_"+row);
			var content  = eval("dd.elements.content"+col+"_"+row);
			var frame = eval("dd.elements.frame"+col+"_"+row);
			var resizehandle = eval("dd.elements.resizehandle"+col+"_"+row);
			var resizebutton = eval("dd.elements.resizebutton"+col+"_"+row);

			titlebar.moveTo(frame.x+2+frame_padding, frame.y+2+frame_padding);
			titlebar.addChild(frame);
			titlebar.setZ(frame.z+1); // ensure that titlebar is floating above frame
			titlebar.resizeTo(frame.w-4-(frame_padding<<1), titlebar_h);

			content.moveTo(frame.x+2+frame_padding+clientarea_margin, titlebar.y+titlebar_h+toolbar_h+clientarea_margin);
			titlebar.addChild(content);
			content.resizeTo(frame.w-4-(frame_padding<<1)-(clientarea_margin<<1), frame.h-titlebar_h-toolbar_h-statusbar_h-4-(frame_padding<<1)-clientarea_margin);

			resizehandle.moveTo(frame.x+frame.w-resizehandle.w-2, frame.y+frame.h-resizehandle.h-2);
			resizebutton.moveTo(titlebar.x+titlebar.w-resizebutton.w-frame_padding-(titlebar_h>>1)+Math.round(resizebutton.w/2), titlebar.y+Math.round(titlebar_h/2)-Math.round(resizebutton.h/2));
			titlebar.addChild(resizebutton);
			titlebar.addChild(resizehandle);
			
			titlebar.show();

			titlebar.row = row;
			titlebar.col = col;

		}
    	
}
/*
titlebar.child[0] = frame;
titlebar.child[1] = content;
titlebar.child[2] = resizebutton;
titlebar.child[3] = resizehandle;
*/


function setupWidgetPositions()
{
	var tbl = document.getElementById("main");
	var col, row;
	for(col=0;col<MAXCOLS;col++) {
		var cell = tbl.rows[0].cells[col];
		for(row = 0; row <MAXROWS;row++) {
			var oInnerTable = cell.childNodes[0];
			oInnerTableRow = oInnerTable.rows[row];

			var frame = eval("dd.elements.frame"+col+"_"+row+";");
			frame.resizeTo(oInnerTableRow.offsetWidth, oInnerTableRow.offsetHeight-25);
			frame.moveTo(getLeft(oInnerTableRow), getTop(oInnerTableRow));
			
		}
	}
	for(col=0;col<MAXCOLS;col++) {
		var cell = tbl.rows[0].cells[col];
		for(row = 0; row <MAXROWS;row++) {
			var oInnerTable = cell.childNodes[0];
			oInnerTableRow = oInnerTable.rows[row];
			oInnerTableRow.style.display="none";
		}
	}
}


function my_PickFunc()
{
    if (dd.obj.name.indexOf("resizebutton") == 0)
    {
        dd.obj.swapImage(dd.obj.parent.children[1].visible? button_up_inset.src : button_down_inset.src);
    }
}


function my_DragFunc()
{
    if (dd.obj.name.indexOf("resizehandle") == 0)
    {
		var frame = dd.obj.parent.children[0];
		var titlebar = dd.obj.parent;
		var content = dd.obj.parent.children[1];
		var resizebutton = dd.obj.parent.children[2];
		var resizehandle = dd.obj.parent.children[3];

        frame.resizeTo(dd.obj.x-frame.x+dd.obj.w+2, dd.obj.y-frame.y+dd.obj.h+2);
        titlebar.resizeTo(dd.obj.x-titlebar.x+dd.obj.w-frame_padding, titlebar_h);
        content.resizeTo(frame.w-4-(frame_padding<<1)-(clientarea_margin<<1), frame.h-titlebar_h-toolbar_h-statusbar_h-4-(frame_padding<<1)-clientarea_margin);
        resizebutton.moveTo(titlebar.x+titlebar.w-resizebutton.w-frame_padding-(titlebar_h>>1)+Math.round(resizebutton.w/2), resizebutton.y);
//		frame.maximizeZ();
		content.maximizeZ();
		resizebutton.maximizeZ();
		resizehandle.maximizeZ();
		titlebar.maximizeZ();
    }
}


function my_DropFunc()
{
    if (dd.obj.name.indexOf("resizebutton") == 0)
    {
		var frame = dd.obj.parent.children[0];
		var titlebar = dd.obj.parent;
		var content = dd.obj.parent.children[1];
		var resizebutton = dd.obj.parent.children[2];
		var resizehandle = dd.obj.parent.children[3];

        if (content.visible)
        {
            dd.obj.swapImage(button_down_outset.src);
            content.hide();
            resizehandle.hide();
            last_window_h = frame.h;
            frame.resizeTo(frame.w, titlebar_h+(frame_padding<<1)+4);
        }
        else
        {
            dd.obj.swapImage(button_up_outset.src);
            content.show();
            resizehandle.show();
            frame.resizeTo(frame.w, last_window_h);
        }
    }
}
