//pcb.js

function pcb() {
    // Properties
    this.xreg = 0;
    this.yreg = 0;
    this.program_counter = 0;
    this.accum = 0;
    this.zflag=0;
    this.startLocation = 0; //start of program.
    this.endLocation = 128; //end of program
    this.update = pcbUpdate;
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