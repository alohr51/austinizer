//pcb.js

function pcb() {
    // Properties
    this.xreg = 0;
    this.yreg = 0;
    this.program_counter = 0;
    this.accum = 0;
    this.zflag=0;
    this.pid = 0;
    this.location = " ";
    this.kill = false;
    this.finished = false;
    this.disk = false;
    this.startLocation = 0; //start of program.
    this.endLocation = 0; //end of program
    this.update = pcbUpdate;
    this.addRow = addTableUpdate;
    this.deleteRow = deleteTableUpdate;
    this.updatePcCell = updatePcCell;
    this.inTable = inTable;
}


function pcbUpdate(xreg,yreg,accum,pc,zflag){
	var xregTag = document.getElementById('xreg');
	var yregTag = document.getElementById('yreg');
	var accumTag = document.getElementById('accum');
	var pcTag = document.getElementById('pc');
	var zflagTag = document.getElementById('zflag');

	xregTag.innerHTML = xreg;
	yregTag.innerHTML = yreg;
	accumTag.innerHTML = accum;
	pcTag.innerHTML = pc;
	zflagTag.innerHTML = zflag;
}

function addTableUpdate(){
	var table = document.getElementById("CurrentProgramTable");
	var row=table.insertRow(1);
	var cell1=row.insertCell(0);
	var cell2=row.insertCell(1);
	var cell3=row.insertCell(2);
	//added cell for the pc real time update in updatePcCell function
	row.insertCell(3);
	var cell5 = row.insertCell(4);
	
	//3 programs in memory and 1 on disk
	if(_ProgramsStored <=4){
		cell1.innerHTML=_currentPCB.pid;
		cell2.innerHTML=_currentPCB.startLocation;
		cell3.innerHTML=_currentPCB.endLocation;
		cell5.innerHTML=_currentPCB.location;
	}
}
//only one that needs to be constantly updated
function updatePcCell(pid,location){
	var table = document.getElementById("CurrentProgramTable");
	for (var i = 1, row; row = table.rows[i]; i++) {
		   //iterate through rows
		   //rows would be accessed using the "row" variable assigned in the for loop
		   col = row.cells[0];
		   var tablePid = parseInt(col.innerHTML);
		   //alert("tablepid:" + tablePid+"...pid:" + pid);
		   if(pid === tablePid){
			   var row1 = table.rows[i];
			   var cell4 = row1.cells[3];
			   var cell5 = row1.cells[4];
			   cell4.innerHTML=_currentPCB.program_counter;
			   cell5.innerHTML=_currentPCB.location;
		   };
		   
		}
}
//checks if process is already in Running programs table
function inTable(pid){
	var table = document.getElementById("CurrentProgramTable");
	for (var i = 1, row; row = table.rows[i]; i++) {
		   //iterate through rows
		   //rows would be accessed using the "row" variable assigned in the for loop
		   col = row.cells[0];
		   var tablePid = parseInt(col.innerHTML);
		   //alert("tablepid:" + tablePid+"...pid:" + pid);
		   if(pid === tablePid){
			   return true;
		   };
		   
		}
	return false;
}

function deleteTableUpdate(pid){
	var table = document.getElementById("CurrentProgramTable");
	//table.deleteRow(pid);
	for (var i = 1, row; row = table.rows[i]; i++) {
		   //iterate through rows
		   //rows would be accessed using the "row" variable assigned in the for loop
		   col = row.cells[0];
		   var tablePid = parseInt(col.innerHTML);
		   //alert("tablepid:" + tablePid+"...pid:" + pid);
		   if(pid === tablePid){
			   table.deleteRow(i);
		   };
		   
		}
	
}

pcb.prototype.toString = function pcbToString() {
	  var pcbString = + this.pid + "," + this.startLocation + "," + this.endLocation + "," + this.program_counter+","+this.location+", isDisk: "+this.disk;
	  return pcbString;
	};