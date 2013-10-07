/* ------------  
   CPU.js

   Requires global.js.
   
   Routines for the host CPU simulation, NOT for the OS itself.  
   In this manner, it's A LITTLE BIT like a hypervisor,
   in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
   that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
   JavaScript in both the host and client environments.

   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

function Cpu() {
    this.PC    = 0;     // Program Counter
    this.Acc   = 0;     // Accumulator
    this.Xreg  = 0;     // X register
    this.Yreg  = 0;     // Y register
    this.Zflag = 0;     // Z-ero flag (Think of it as "isZero".)
    this.isExecuting = false;
    this.pcb;
    
    this.init = function() {
        this.PC    = 0;
        this.Acc   = 0;
        this.Xreg  = 0;
        this.Yreg  = 0;
        this.Zflag = 0;      
        this.isExecuting = false;  
        this.pcb = _currentPCB;
    };
    
    this.cycle = function() {
        krnTrace("CPU cycle");
        this.pcb = new pcb();
        var pc = _memoryManager.getPC();
        var hexCode = _memoryManager.getInstruction(pc).toUpperCase();
        //load the accumulator
        if(hexCode=='A9'){
        	var userConstant = _memoryManager.getInstruction(pc+1);
        	this.pcb.accum = parseInt(userConstant);
        	_currentPCB = this.pcb;
        	//need to step over the constant
        	this.pcb.program_counter++;
        	_currentPCB.pcbUpdateDisplay();
        }
        //Store accum in memory
        if(hexCode = '8D'){
        	//get the hex value of the memory location
        	var memLocation = parseInt(_memoryManager.getInstruction(pc+1) + _memoryManager.getInstruction(pc+2),16);
        	_coreMem.Memory[memLocation] = this.pcb.accum;
        	//step over location
        	this.pcb.program_counter+=2;
        	_currentPCB.pcbUpdateDisplay();
        }
        // TODO: Accumulate CPU usage and profiling statistics here.
        // Do the real work here. Be sure to set this.isExecuting appropriately.
    };
}
