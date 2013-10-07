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
    this.memoryManager;
    this.display = pcbInfo;
    this.pcbUpdateDisplay = pcbUpdate;
}

function pcbInfo() {
    krnTrace("Begin PCB Display.");
    krnTrace("X reg: " + this.xreg);
    krnTrace("Y reg: " + this.yreg);
    krnTrace("Accum: " + this.accum);
    krnTrace("PC: " + this.program_counter);
    krnTrace("End PCB Display");
}

function pcbUpdate(){
	var xreg = document.getElementById('xreg');
	var yreg = document.getElementById('yreg');
	var accum = document.getElementById('accum');
	var pc = document.getElementById('pc');
	var zflag = document.getElementById('zflag');

	xreg.innerHTML = this.xreg;
	yreg.innerHTML = this.yreg;
	accum.innerHTML = this.accum;
	pc.innerHTML = this.program_counter;
	zflag.innerHTML = this.zflag;
}