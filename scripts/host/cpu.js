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
    this.Zflag = 0;     // Zero flag (Think of it as "isZero".)
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
    // TODO: Accumulate CPU usage and profiling statistics here.
    // Do the real work here. Be sure to set this.isExecuting appropriately.
    this.cycle = function() {
    	//alert(_currentPCB.startLocation);
        krnTrace("CPU cycle");
        this.pcb = new pcb();
        var pc = _memoryManager.getPC();
        var hexCode = _memoryManager.getInstruction(pc).toUpperCase();
        while (hexCode != "00")
        {
        var currPc = _memoryManager.getPC();
        //load the accumulator
        if(hexCode=='A9'){
        	var userConstant = _memoryManager.getInstruction(currPc+1);
        	this.pcb.accum = parseInt(userConstant);
        	_currentPCB = this.pcb;
        	//need to step over the constant
        	this.pcb.program_counter++;
        	_currentPCB.pcbUpdateDisplay();
        }
        //Store accum in memory
        if(hexCode = '8D'){
        	//get the hex value of the memory location
        	var memLocation = parseInt(_memoryManager.getInstruction(currPc+1) + _memoryManager.getInstruction(currPc+2),16);
        	_coreMem.Memory[memLocation] = this.pcb.accum;
        	//step over location
        	this.pcb.program_counter+=2;
        	_currentPCB.pcbUpdateDisplay();
        }
      //add with carry
        if (hexCode == "6D") {
            var memLocation = parseInt(_memoryManager.getInstruction(currPc + 1) + _memoryManager.getInstruction(currPc + 2),16);
            this.pcb.accum = _coreMem.Memory[memLocation] + this.pcb.accum ;
            //increment the pc past the instruction
            this.pcb.program_counter += 2;
        }
        //Load xReg with constant
        if (hexCode == "A2") {
            var userConstant = parseInt(_memoryManager.getInstruction(currPc + 1));
            //load x register
            this.pcb.xreg = userConstant;
            //step over the constant
            this.pcb.program_counter++;
        }
        //load y register with constant
        if (hexCode == "A0") {
            var userConstant = parseInt(_memoryManager.getInstruction(currPc + 1));
            //load y register
            this.pcb.yreg = userConstant;
            //step over the constant
            this.pcb.program_counter++;
        }
        //Load yReg from memory
        if (hexCode == "AC") {
            var memLocation = parseInt(_memoryManager.getInstruction(currPc) + _memoryManager.getInstruction(currPc + 2),16);
            this.pcb.yreg = _coreMem.Memory[memLocation];
            //move over instruction
            this.pcb.program_counter += 2;
        }
        //compare byte to x reg in memory to set z flag
        if (hexCode == "EC") {
        	var memLocation = parseInt(_memoryManager.getInstruction(currPc + 1) + _memoryManager.getInstruction(currPc + 2),16);
            //check with x reg
            if(memLocation - this.pcb.xreg == 0){
            	this.Zflag = 1;
            }
            else{
            	this.Zflag = 0;
            }
            this.pcb.program_counter+=2;
        }
        //System Call
        if (hexCode == "FF") {
            //Interrupt stuff?
        }
        //no op just increment pc
        if(hexCode =="EA"){
        	this.pcb.program_counter++;
        }
        //Increment byte
        if(hexCode =="EE"){
        	var byteToInc= _memoryManager.getInstruction(currPc+2);
        	var memLocation = parseInt(_memoryManager.getInstruction(currPc+1) + byteToInc,16);
        	//increment the byte
        	byteToInc++;
        	_coreMem.Memory[memLocation]=byteToInc;
        	this.pcb.program_counter+=2;
        }
        
        //bottom of while loop get next instruction
        this.pcb.program_counter++;
        var current = _memoryManager.getPC();
        hexCode = _memoryManager.getInstruction(current);
        _current_pcb = this.pcb;
        _coreMem.display();
        
    }
    //need to restore the info in the array of pid/current pid
    _current_pcb = this.pcb;
    _current_pcb.display();
    _current_pcb.pcbUpdateDisplay();
    _StdIn.putText(memory());
};

    };
    
    function memory() {
        var output = "";
        for (x in this.memory) {
            if (!this.memory[x] == "") {
                output = output + this.memory[x] + " ";
            }
        }
        return (output);
    }

