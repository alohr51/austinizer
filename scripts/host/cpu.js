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
    this.hexCode;
    
    this.init = function() {
        this.PC    = 0;
        this.Acc   = 0;
        this.Xreg  = 0;
        this.Yreg  = 0;
        this.Zflag = 0;      
        this.isExecuting = false; 
        this.pcb = new pcb();
        this.hexCode = '00';
    };
    // TODO: Accumulate CPU usage and profiling statistics here.
    // Do the real work here. Be sure to set this.isExecuting appropriately.
    this.cycle = function() {
    	
    	//alert(_currentPCB.startLocation);
        //krnTrace("CPU cycle");
        //this.pcb = _currentPCB;
        //var pc = _memoryManager.getPC();
        var hexCode = _memoryManager.getInstruction(_CPU.PC).toUpperCase();
        //setTimeout( execute(), 15000 );
       
        
        //var currPc = _memoryManager.getPC();
        // _currentPCB = this.pcb;
 	
        //load the accumulator
        if(hexCode=='A9'){
        	var userConstant = _memoryManager.getInstruction(_CPU.PC+1);
        	_CPU.Acc = parseInt(userConstant,16);
        	//need to step over the constant
        	_CPU.PC++;
        	krnTrace("code A9 ran with: "+userConstant);
        }
        //Store accum in memory
        else if(hexCode == '8D'){
        	//get the hex value of the memory location, order is important
        	var memLocation = parseInt(_memoryManager.getInstruction(_CPU.PC+2) + _memoryManager.getInstruction(_CPU.PC+1),16);
        	_coreMem.Memory[memLocation] = _CPU.Acc;
        	//step over location
        	_CPU.PC+=2;
        	krnTrace("code 8D stored: "+_CPU.Acc+" in memory: "+ _coreMem.Memory[memLocation]);
        }
      //add with carry
        else if (hexCode == "6D") {
            var memLocation = parseInt(_memoryManager.getInstruction(_CPU.PC + 2) + _memoryManager.getInstruction(_CPU.PC + 1),16);
            _CPU.Acc += parseInt(_coreMem.Memory[memLocation],16);
            //krnTrace("6d cpuAcc:" + _CPU.Acc);
            //increment the pc past the instruction
            _CPU.PC+= 2;
            krnTrace("code 6D add with carry: "+ _CPU.Acc);
        }
        //Load xReg with constant
        else if (hexCode == "A2") {
            var userConstant = parseInt(_memoryManager.getInstruction(_CPU.PC + 1),16);
            //load x register
            _CPU.Xreg = userConstant;
            //step over the constant
            _CPU.PC++;
            krnTrace("code A2 loaded xreg with: "+userConstant);
        }
        //branch if z = 0
        else if(hexCode =='D0'){
        	if(_CPU.Zflag == 0 ){
        		var bValue = parseInt(_memoryManager.getInstruction(_CPU.PC + 1),16);
        		_CPU.PC+= bValue;
        		//check bounds
        		if(_CPU.PC > 255){
        			_CPU.PC -= 256;
        		}
        		_CPU.PC++;
        	}
        	else{
        		_CPU.PC+=2;
        		}
        	krnTrace("code D0 branch. zFlag: "+_CPU.Zflag);
        }
        //load y register with constant
        else if (hexCode == "A0") {
            var userConstant = memoryManager.getInstruction(_CPU.PC + 1);
            //load y register
            _CPU.Yreg = userConstant;
            //step over the constant
            _CPU.PC++;
            krnTrace("code A0 loaded yreg with: "+userConstant);
        }
        //Load yReg from memory
        else if (hexCode == "AC") {
            var memLocation = parseInt(_memoryManager.getInstruction(_CPU.PC+2) + _memoryManager.getInstruction(_CPU.PC + 1),16);
            _CPU.Yreg = _coreMem.Memory[memLocation];
            //move over instruction
            _CPU.PC += 2;
            krnTrace("code AC loaded yreg from memory: "+this.pcb.yreg);
        }
        //compare byte to x reg in memory to set z flag
        else if (hexCode == "EC") {
        	var memAddress = parseInt(_memoryManager.getInstruction(_CPU.PC + 2) + _memoryManager.getInstruction(_CPU.PC + 1),16);
        	//check with x reg 
            if(_coreMem.Memory[memAddress] - _CPU.Xreg == 0){
            	_CPU.Zflag = 1;
            }
            else{
            	_CPU.Zflag = 0;
            }
            
            _CPU.PC+=2;
            krnTrace("code EC checked zFlag: "+_CPU.Zflag);
        }
        //System Call
        else if (hexCode == "FF") {
            if(_CPU.Xreg === 1){
            	//get the value from Y reg
            	var yreg = parseInt(_CPU.Yreg).toString();
            	for(var i = 0; i < yreg.length;i++){
            		_StdIn.putText( yreg.charAt(i));
            		_StdIn.advanceLine();
            		_StdIn.putText(">");
            		
            	}
            }
            //Print string stored at address in Y reg
            else if(_CPU.Xreg ===2){
            	var yregAddress = parseInt(_CPU.Yreg,16);
            	var currentdec = _coreMem.Memory[yregAddress];
            	while(currentdec != '00'){
            		//var decInt = parseInt(currentHex,16);
            		var chr = String.fromCharCode(currentdec);
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
        else if(hexCode =="EA"){
        	_CPU.PC++;
        	krnTrace("code EA no op increment pc to: "+_CPU.PC);
        }
        
        //system break
        else if (hexCode =='00'){
        	krnTrace("system break...");
        	//send an update to the pcb display
        	_CurrentPCB.update(_CPU.Xreg, _CPU.Yreg, _CPU.Acc,_CPU.PC, _CPU.Zflag);
        	//stop execution at the end of program
        	_CPU.isExecuting = false;
        	//_StdIn.putText(">");
        	
        	
        	
        }
        //Increment byte
        else if(hexCode =="EE"){
        	var memLocation = parseInt(_memoryManager.getInstruction(_CPU.PC+2) + _memoryManager.getInstruction(_CPU.PC + 1),16);
        	//increment the byte
        	//byteToInc++;
        	var byte = _coreMem.Memory[memLocation];
        	//increment byte
        	byte++;
        	//put byte back into memory
        	_coreMem.Memory[memLocation] = byte;
        	_CPU.PC+=2;
        	krnTrace("code EE incremented byte");
        }
        else{
        	krnTrace("code not recognized:" + hexCode);
        }
        
       //bottom of while loop get next instruction
        _CPU.PC++;
        //var current = _memoryManager.getPC();
        hexCode = _memoryManager.getInstruction(_CPU.PC);
        
        //_currentPCB = this.pcb;
        _coreMem.display();
        //real time updates
        _CurrentPCB.update(_CPU.Xreg, _CPU.Yreg, _CPU.Acc,_CPU.PC, _CPU.Zflag);
        krnTrace("Current PC: " + _CPU.PC + ", NextHex: "+ hexCode);
    
};
    };

