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
    if(_currentPCB!= null) _currentPCB.addRow();
    };
    // TODO: Accumulate CPU usage and profiling statistics here.
    // Do the real work here. Be sure to set this.isExecuting appropriately.
    this.cycle = function() {
    	//alert(_currentPCB.startLocation);
        //krnTrace("CPU cycle");
    	this.pcb = _currentPCB;
    	//var processKill = false;
    	var currPC = _memoryManager.getPC();
        //var pc = _memoryManager.getPC();
        var hexCode = _memoryManager.getInstruction(currPC).toUpperCase();
        //alert("location" + currPC);
        //alert(hexCode);
        
        if(_currentPCB.kill){
        	hexCode = '00';
        	//processKill = true;
        }
        
        //load the accumulator
        if(hexCode==='A9'){
        	var userConstant = _memoryManager.getInstruction(currPC+1);
        	//alert(parseInt(userConstant,16));
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
        	var memAddress = memLocation + _currentPCB.startLocation;
        	var hex = this.pcb.accum.toString(16).toUpperCase();
        	if(hex.length===1)hex = "0"+hex;
        	_coreMem.Memory[memAddress] = hex;
        	//step over location
        	//_CPU.PC+=2;
        	this.pcb.program_counter+=2;
        	krnTrace("code 8D stored: "+this.pcb.accum+" in memory location: "+ _coreMem.Memory[memAddress]);
        }
      //add with carry
        else if (hexCode === "6D") {
            var memLocation = parseInt(_memoryManager.getInstruction(currPC+ 2) + _memoryManager.getInstruction(currPC + 1),16);
            var memAddress = memLocation + _currentPCB.startLocation;
            this.pcb.accum += parseInt(_coreMem.Memory[memAddress],16);
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
            var memAddress = memLocation + _currentPCB.startLocation;
        	//load x register
        	this.pcb.xreg = parseInt(_coreMem.Memory[memAddress],16);
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
            var userConstant = _memoryManager.getInstruction(currPC + 1);
            //load y register
            this.pcb.yreg = userConstant;
            //step over the constant
            this.pcb.program_counter++;
            krnTrace("code A0 loaded yreg with: "+userConstant);
        }
        
        //Load yReg from memory
        else if (hexCode === "AC") {
            var memLocation = parseInt(_memoryManager.getInstruction(currPC+2) + _memoryManager.getInstruction(currPC + 1),16);
            var decAddress = memLocation + parseInt(_currentPCB.startLocation);
            this.pcb.yreg =_coreMem.Memory[decAddress];
            //move over instruction
            this.pcb.program_counter += 2;
            krnTrace("code AC loaded yreg from memory: "+this.pcb.yreg);
        }
        //compare byte to x reg in memory to set z flag
        else if (hexCode === "EC") {
        	var memLocation = parseInt(_memoryManager.getInstruction(currPC + 2) + _memoryManager.getInstruction(currPC + 1),16);
        	var memAddress = memLocation + _currentPCB.startLocation;
        	//check with x reg 
            if(parseInt(_coreMem.Memory[memAddress]) - this.pcb.xreg === 0){
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
            if(this.pcb.xreg === 1){
            	//get the value from Y reg
            	var yreg = parseInt(this.pcb.yreg).toString();
            	for(var i = 0; i < yreg.length;i++){
            		_StdIn.putText( yreg.charAt(i));
            		_StdIn.putText(" ");
            	}
            }
            //Print string stored at address in Y reg
            if(this.pcb.xreg ===2){
            	var decAddress = parseInt(this.pcb.yreg,16);
            	var currentdec = _coreMem.Memory[decAddress];
            	while(currentdec != '00'){
            		var key = parseInt(currentdec,16);
            		var chr = String.fromCharCode(key);
            		//format output with prompt and advance line
            		_StdIn.putText(chr);
//            		_StdIn.advanceLine();
//            		_StdIn.putText(">");
            		
            		//move address up one then get next address from core mem
            		decAddress++;
            		currentdec = _coreMem.Memory[decAddress];
            	}            }
        	krnTrace("code FF ran with system call: ");
        }
        //no op just increment pc
        else if(hexCode ==="EA"){
        	this.pcb.program_counter++;
        	krnTrace("code EA no op increment pc to: "+this.pcb.program_counter);
        }
        
        //system break
        else if (hexCode ==='00'){
        	_StdIn.advanceLine();
        	_StdIn.putText(">");
        	//send an update to the pcb display
        	_currentPCB.update(this.pcb.xreg, this.pcb.yreg, this.pcb.accum,this.pcb.program_counter, this.pcb.zflag);
        	//_StdIn.putText(">");
//        	if(processKill){
//        	krnTrace("Process "+this.pcb.pid+" Killed...");
//        	_CPU.isExecuting = false;
//        	}
        	if(_RunAllMode){
        		if(readyQueue.length ===0){
        			_currentPCB.deleteRow(_currentPCB.pid);
        			runAllMode = false;
        			_CPU.isExecuting = false;
        		}
        		else{
            		_currentPCB.deleteRow(_currentPCB.pid);
            		_currentPCB = readyQueue.pop();
            		_currentPCB.addRow();
        		}
        	}
        	else{
        	krnTrace("system break...");
        	_currentPCB.deleteRow(_currentPCB.pid);
        	_CPU.isExecuting = false;
        	}
        	//stop execution at the end of program
        	
        	
        	
        	
        }
        //Increment byte
        else if(hexCode ==="EE"){
        	var memLocation = parseInt(_memoryManager.getInstruction(currPC+2) + _memoryManager.getInstruction(currPC + 1),16);
        	//increment the byte
        	var memAddress = memLocation + _currentPCB.startLocation;
        	var byte = parseInt(_coreMem.Memory[memAddress],16);
        	//increment byte
        	byte++;
        	var hex = byte.toString(16).toUpperCase();
            if (hex.length === 1){
                hex = "0" + hex;
            }
        	//put byte back into memory
        	_coreMem.Memory[memAddress] = hex;
        	this.pcb.program_counter+=2;
        	krnTrace("code EE incremented byte, now: " +hex);
        }
        else{
        	krnTrace("code not recognized:" + hexCode);
        	_CPU.isExecuting = false;
        }
        
       //bottom of while loop get next instruction
        this.pcb.program_counter++;
        //get next hexCode for the Log to help debug in beginning of proj
        var nextHexCode = _memoryManager.getInstruction(this.pcb.program_counter);
        //update the display
        _coreMem.display();
        //real time updates above the log
        _currentPCB.update(this.pcb.xreg, this.pcb.yreg, this.pcb.accum,this.pcb.program_counter, this.pcb.zflag);
        //update the pcCell in the RunningPrograms Table
        _currentPCB.updatePcCell();
        krnTrace("Current PC: " + currPC + ", NextHex: "+ nextHexCode);
    
};
    };

