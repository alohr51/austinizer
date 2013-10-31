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
    this.isExecuting = false;
    this.pcb;
    this.hexCode;
    this.pcb = new pcb();
    
    this.init = function() {
        this.isExecuting = false;
		
    };
    // TODO: Accumulate CPU usage and profiling statistics here.
    // Do the real work here. Be sure to set this.isExecuting appropriately.
    this.cycle = function() {
    	//alert(_currentPCB.startLocation);
        //krnTrace("CPU cycle");
        this.pcb = _currentPCB;
        var currPC = _memoryManager.getPC();
        //var pc = _memoryManager.getPC();
        var hexCode = _memoryManager.getInstruction(currPC).toUpperCase();
        //alert("location" + currPC);
        //alert(hexCode);
       
        
        //var currPc = _memoryManager.getPC();
        // _currentPCB = this.pcb;
        //if(this.pcb.kill){
        //	hexCode ='00';
        //}
        
        //load the accumulator
        if(hexCode==='A9'){
        	var userConstant = _memoryManager.getInstruction(currPC+1);
        	this.pcb.accum = parseInt(userConstant,16);
        	//need to step over the constant
        	//_CPU.PC++;
        	this.pcb.program_counter++;
        	krnTrace("code A9 ran with: "+userConstant);
        }
        //Store accum in memory
        else if(hexCode === '8D'){
        	//get the hex value of the memory location, order is important
        	var memLocation = parseInt(_memoryManager.getInstruction(currPC+2) + _memoryManager.getInstruction(currPC+1),16);
        	_coreMem.Memory[memLocation] = this.pcb.accum;
        	//step over location
        	//_CPU.PC+=2;
        	this.pcb.program_counter+=2;
        	krnTrace("code 8D stored: "+this.pcb.accum+" in memory: "+ _coreMem.Memory[memLocation]);
        }
      //add with carry
        else if (hexCode === "6D") {
            var memLocation = parseInt(_memoryManager.getInstruction(currPC+ 2) + _memoryManager.getInstruction(currPC + 1),16);
            this.pcb.accum += parseInt(_coreMem.Memory[memLocation],16);
            //krnTrace("6d cpuAcc:" + _CPU.Acc);
            //increment the pc past the instruction
            this.pcb.program_counter+= 2;
            krnTrace("code 6D add with carry: "+ this.pcb.accum);
        }
        //Load xReg with constant
        else if (hexCode === "A2") {
            var userConstant = parseInt(_memoryManager.getInstruction(currPC + 1),16);
            //load x register
            this.pcb.xreg = userConstant;
            //step over the constant
            this.pcb.program_counter++;
            krnTrace("code A2 loaded xreg with: "+userConstant);
        }
        
        //Load xReg from memory
        else if (hexCode === "AE") {
        	var memLocation = parseInt(_memoryManager.getInstruction(currPC + 2) + _memoryManager.getInstruction(currPC + 1),16);
            //load x register
        	this.pcb.xreg = parseInt(_coreMem.Memory[memLocation], 16);
            //step over the constant
        	this.pcb.program_counter+=2;
            krnTrace("code AE loaded xreg from mem: "+memLocation);
        }
        
        //branch if z = 0
        else if(hexCode ==='D0'){
        	if(this.pcb.zflag === 0 ){
        		var bValue = parseInt(_memoryManager.getInstruction(currPC + 1),16);
        		this.pcb.program_counter+= bValue;
        		//check bounds
        		if(this.pcb.program_counter > 255){
        			this.pcb.program_counter -= 256;
        		}
        		this.pcb.program_counter++;
        	}
        	else{
        		this.pcb.program_counter++;
        		}
        	krnTrace("code D0 branch. zFlag: "+this.pcb.zflag);
        }
        //load y register with constant
        else if (hexCode === "A0") {
            var userConstant = memoryManager.getInstruction(currPC + 1);
            //load y register
            this.pcb.yreg = userConstant;
            //step over the constant
            this.pcb.program_counter++;
            krnTrace("code A0 loaded yreg with: "+userConstant);
        }
        
        //Load yReg from memory
        else if (hexCode === "AC") {
            var memLocation = parseInt(_memoryManager.getInstruction(currPC+2) + _memoryManager.getInstruction(currPC + 1),16);
            this.pcb.yreg = _coreMem.Memory[memLocation];
            //move over instruction
            this.pcb.program_counter += 2;
            krnTrace("code AC loaded yreg from memory: "+this.pcb.yreg);
        }
        //compare byte to x reg in memory to set z flag
        else if (hexCode === "EC") {
        	var memAddress = parseInt(_memoryManager.getInstruction(currPC + 2) + _memoryManager.getInstruction(currPC + 1),16);
        	//check with x reg 
            if(_coreMem.Memory[memAddress] - this.pcb.xreg == 0){
            	this.pcb.zflag = 1;
            }
            else{
            	this.pcb.zflag = 0;
            }
            
            this.pcb.program_counter+=2;
            krnTrace("code EC checked zFlag: "+this.pcb.zflag);
        }
        //System Call
        else if (hexCode === "FF") {
        	alert("FF");
            if(this.pcb.xreg === 1){
            	//get the value from Y reg
            	var yreg = parseInt(this.pcb.yreg).toString();
            	for(var i = 0; i < yreg.length;i++){
            		_StdIn.putText( yreg.charAt(i));
            		_StdIn.advanceLine();
            		_StdIn.putText(">");
            		
            	}
            }
            //Print string stored at address in Y reg
            else if(this.pcb.xreg ===2){
            	var yregAddress = parseInt(this.pcb.yreg);
            	var currentdec = _coreMem.Memory[yregAddress];
            	
            	while(currentdec != '00'){
            		var key = parseInt(currentdec,16);
            		var chr = String.fromCharCode(key);
            		//format output with prompt and advance line
            		_StdIn.putText(">");
            		_StdIn.putText(chr);
            		_StdIn.advanceLine();
            		//move address up one then get next address from core mem
            		currentdec++;
            		currentdec = _coreMem.Memory[yregAddress];
            	}

            }
        	krnTrace("code FF ran with system call: ");
        }
        //no op just increment pc
        else if(hexCode ==="EA"){
        	this.pcb.program_counter++;
        	krnTrace("code EA no op increment pc to: "+this.pcb.program_counter);
        }
        
        //system break
        else if (hexCode ==='00'){
        	krnTrace("system break...");
        	//send an update to the pcb display
        	_CurrentPCB.update(this.pcb.xreg, this.pcb.yreg, this.pcb.accum,this.pcb.program_counter, this.pcb.zflag);
        	//stop execution at the end of program
        	_CPU.isExecuting = false;
        	//_StdIn.putText(">");
        	
        	
        	
        }
        //Increment byte
        else if(hexCode ==="EE"){
        	var memLocation = parseInt(_memoryManager.getInstruction(currPC+2) + _memoryManager.getInstruction(currPC + 1),16);
        	//increment the byte
        	//byteToInc++;
        	var byte = _coreMem.Memory[memLocation];
        	//increment byte
        	byte++;
        	//put byte back into memory
        	_coreMem.Memory[memLocation] = byte;
        	this.pcb.program_counter+=2;
        	krnTrace("code EE incremented byte");
        }
        else{
        	krnTrace("code not recognized:" + hexCode);
        	_CPU.isExecuting = false;
        }
        
       //bottom of while loop get next instruction
        this.pcb.program_counter++;
        //var current = _memoryManager.getPC();
        var nextHexCode = _memoryManager.getInstruction(this.pcb.program_counter);
        
        //_currentPCB = this.pcb;
        _coreMem.display();
        //real time updates
        _CurrentPCB.update(this.pcb.xreg, this.pcb.yreg, this.pcb.accum,this.pcb.program_counter, this.pcb.zflag);
        krnTrace("Current PC: " + currPC + ", NextHex: "+ nextHexCode);
    
};
    };

