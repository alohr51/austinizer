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
    this.hexCode;
    this.lineWrap;
    this.init = function() {
    this.isExecuting = false;
    this.lineWrap = 0;
    if(_currentPCB!= null) _currentPCB.addRow();
    };
    // TODO: Accumulate CPU usage and profiling statistics here.
    // Do the real work here. Be sure to set this.isExecuting appropriately.
    this.cycle = function() {
    	//no need to context switch if there is only 1 program left
    	//give it all the cpu!
        if(_RoundRobin && readyQueue.length != 0){
        	if(_OSclock % _Quantum === 0){
        		_CpuScheduler.contextSwitch();
        		alert("switch to: "+_currentPCB.pid+"with pc: " + _currentPCB.program_counter+"with hex: " + hexcode);
        	}
        }
        //helps kill a process in instruction "00"
    	var processKill = false;
    	var currPC = _memoryManager.getPC();
        var hexCode = _memoryManager.getInstruction(currPC).toUpperCase();
        
        if(_currentPCB.kill){
        	hexCode = '00';
        	processKill = true;
        }
        
        //load the accumulator
        if(hexCode==='A9'){
        	var userConstant = _memoryManager.getInstruction(currPC+1);
        	//alert(parseInt(userConstant,16));
        	_currentPCB.accum = parseInt(userConstant,16);
        	//need to step over the constant
        	//_CPU.PC++;
        	_currentPCB.program_counter++;
        	krnTrace("code A9 ran with: "+userConstant);
        }
        //Store accum in memory
        else if(hexCode === '8D'){
        	//get the hex value of the memory location, order is important
        	var memLocation = parseInt(_memoryManager.getInstruction(currPC+2) + _memoryManager.getInstruction(currPC+1),16);
        	var memAddress = memLocation + _currentPCB.startLocation;
        	var hex = _currentPCB.accum.toString(16).toUpperCase();
        	if(hex.length===1)hex = "0"+hex;
        	_coreMem.Memory[memAddress] = hex;
        	//step over location
        	//_CPU.PC+=2;
        	_currentPCB.program_counter+=2;
        	krnTrace("code 8D stored: "+_currentPCB.accum+" in memory location: "+ _coreMem.Memory[memAddress]);
        }
      //add with carry
        else if (hexCode === "6D") {
            var memLocation = parseInt(_memoryManager.getInstruction(currPC+ 2) + _memoryManager.getInstruction(currPC + 1),16);
            var memAddress = memLocation + _currentPCB.startLocation;
            _currentPCB.accum += parseInt(_coreMem.Memory[memAddress],16);
            //krnTrace("6d cpuAcc:" + _CPU.Acc);
            //increment the pc past the instruction
            _currentPCB.program_counter+= 2;
            krnTrace("code 6D add with carry: "+ _currentPCB.accum);
        }
        //Load xReg with constant
        else if (hexCode === "A2") {
            var userConstant = parseInt(_memoryManager.getInstruction(currPC + 1),16);
            //load x register
            _currentPCB.xreg = userConstant;
            //step over the constant
            _currentPCB.program_counter++;
            krnTrace("code A2 loaded xreg with: "+userConstant);
        }
        
        //Load xReg from memory
        else if (hexCode === "AE") {
        	var memLocation = parseInt(_memoryManager.getInstruction(currPC + 2) + _memoryManager.getInstruction(currPC + 1),16);
            var memAddress = memLocation + _currentPCB.startLocation;
        	//load x register
            _currentPCB.xreg = parseInt(_coreMem.Memory[memAddress],16);
            //step over the constant
            _currentPCB.program_counter+=2;
            krnTrace("code AE loaded xreg from mem: "+memLocation);
        }
        
        //branch if z = 0
        else if(hexCode ==='D0'){
        	if(_currentPCB.zflag === 0 ){
        		var bValue = parseInt(_memoryManager.getInstruction(currPC + 1),16);
        		_currentPCB.program_counter+= bValue;
        		//check bounds
        		if(_currentPCB.program_counter > 255){
        			_currentPCB.program_counter -= 256;
        		}
        		_currentPCB.program_counter++;
        	}
        	else{
        		_currentPCB.program_counter++;
        		}
        	krnTrace("code D0 branch. zFlag: "+_currentPCB.zflag);
        }
        //load y register with constant
        else if (hexCode === "A0") {
            var userConstant = _memoryManager.getInstruction(currPC + 1);
            //load y register
            _currentPCB.yreg = userConstant;
            //step over the constant
            _currentPCB.program_counter++;
            krnTrace("code A0 loaded yreg with: "+userConstant);
        }
        
        //Load yReg from memory
        else if (hexCode === "AC") {
            var memLocation = parseInt(_memoryManager.getInstruction(currPC+2) + _memoryManager.getInstruction(currPC + 1),16);
            var decAddress = memLocation + parseInt(_currentPCB.startLocation);
            _currentPCB.yreg =_coreMem.Memory[decAddress];
            //move over instruction
            _currentPCB.program_counter += 2;
            krnTrace("code AC loaded yreg from memory: "+_currentPCB.yreg);
        }
        //compare byte to x reg in memory to set z flag
        else if (hexCode === "EC") {
        	var memLocation = parseInt(_memoryManager.getInstruction(currPC + 2) + _memoryManager.getInstruction(currPC + 1),16);
        	var memAddress = memLocation + _currentPCB.startLocation;
        	//check with x reg 
            if(parseInt(_coreMem.Memory[memAddress]) - _currentPCB.xreg === 0){
            	_currentPCB.zflag = 1;
            }
            else{
            	_currentPCB.zflag = 0;
            }
            
            _currentPCB.program_counter+=2;
            krnTrace("code EC checked zFlag: "+_currentPCB.zflag);
        }
        //System Call
        else if (hexCode === "FF") {
            if(_currentPCB.xreg === 1){
            	//get the value from Y reg
            	var yreg = parseInt(_currentPCB.yreg).toString();
            	for(var i = 0; i < yreg.length;i++){
            		_StdIn.putText( yreg.charAt(i));
            		_StdIn.putText(" ");
            	}
            }
            //Print string stored at address in Y reg
            if(_currentPCB.xreg ===2){
            	var decAddress = parseInt(_currentPCB.yreg,16);
            	var currentdec = _coreMem.Memory[decAddress];
            	
            	while(currentdec != '00'){
            		this.lineWrap++;
            		var key = parseInt(currentdec,16);
            		var chr = String.fromCharCode(key);
            		//format output with prompt and advance line
            		_StdIn.putText(chr);
            		if(this.lineWrap % 47 ===0)_StdIn.advanceLine();
//            		_StdIn.putText(">");
            		
            		//move address up one then get next address from core mem
            		decAddress++;
            		currentdec = _coreMem.Memory[decAddress];
            	}            }
        	krnTrace("code FF ran with system call: ");
        }
        //no op just increment pc
        else if(hexCode ==="EA"){
        	_currentPCB.program_counter++;
        	krnTrace("code EA no op increment pc to: "+_currentPCB.program_counter);
        }
        
        //system break
        else if (hexCode ==='00'){
        	//_StdIn.advanceLine();
        	//_StdIn.putText(">");
        	//send an update to the pcb display
        	_currentPCB.update(_currentPCB.xreg,_currentPCB.yreg, _currentPCB.accum,_currentPCB.program_counter, _currentPCB.zflag);
        	//_StdIn.putText(">");
        	
        	if(processKill){
        	krnTrace("Process "+_currentPCB.pid+" Killed...");
        	}
        	if(_RunAllMode){
        		//if the readyQueue is empty delete the process from the table
        		//shutoff runall mode and stop cpu executing
        		if(readyQueue.length ===0){
        			_currentPCB.deleteRow(_currentPCB.pid);
        			_RunAllMode = false;
        			_RoundRobin = false;
        			_CPU.isExecuting = false;
        			//all programs ran, free memory and reset programs stored
        			_coreMem.init();
        			_ProgramsStored = 0;
                	_StdIn.advanceLine();
                	_StdIn.putText(">");
        			
        		}
        		//the process has ended. Mark finished true
        		//and take it off the table of running processes
        		else if(_RoundRobin){
        			_currentPCB.finished = true;
        			_currentPCB.deleteRow(_currentPCB.pid);
        			
        		}
        		//round robin is off and the first process has finished
        		//delete it from the table and grab the next process.
        		else{
            		_currentPCB.deleteRow(_currentPCB.pid);
            		_currentPCB = readyQueue.shift();
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
        	_currentPCB.program_counter+=2;
        	krnTrace("code EE incremented byte, now: " +hex);
        }
        else{
        	krnTrace("code not recognized:" + hexCode);
        	_CPU.isExecuting = false;
        }
        if(!_currentPCB.finished){
       //bottom of while loop get next instruction
        _currentPCB.program_counter++;
        //get next hexCode for the Log to help debug in beginning of proj
        var nextHexCode = _memoryManager.getInstruction(_currentPCB.program_counter);
        //update the display
        _coreMem.display();
        //real time updates above the log
        _currentPCB.update(_currentPCB.xreg, _currentPCB.yreg, _currentPCB.accum,_currentPCB.program_counter, _currentPCB.zflag);
        //update the pcCell in the RunningPrograms Table
        _currentPCB.updatePcCell(_currentPCB.pid);
        krnTrace("Current PC: " + currPC + ", NextHex: "+ nextHexCode);
        }
    
};
    };

