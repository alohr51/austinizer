/*
 * pcb.js
 * holds the information for each process.
 */

function pcb() {
    // Properties
    this.xreg = 0;
    this.yreg = 0;
    this.program_counter = 0;
    this.accum = 0;
    this.base_location = 0; //start of program.
    this.end_location = 128; //end of program
    this.schedule;
    this.memoryManagement;
    this.state;
    this.IOinfo;
    this.AccountingInfo;
    this.display = pcbInfo;
}

function pcbInfo() {
    krnTrace("Begin PCB Display.");
    krnTrace("X register: " + this.xreg);
    krnTrace("Y register: " + this.yreg);
    krnTrace("Accumulator: " + this.accum);
    krnTrace("PC: " + this.program_counter);
    krnTrace("Start of program at: " + this.base_location);
    krnTrace("End of program at: " + this.end_location);
    krnTrace("End PCB Display");
}