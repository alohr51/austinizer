/* ----------------------------------
   DeviceDriverKeyboard.js
   
   Requires deviceDriver.js
   
   The Kernel Keyboard Device Driver.
   ---------------------------------- */

DeviceDriverKeyboard.prototype = new DeviceDriver;  // "Inherit" from prototype DeviceDriver in deviceDriver.js.

function DeviceDriverKeyboard()                     // Add or override specific attributes and method pointers.
{
    // "subclass"-specific attributes.
    // this.buffer = "";    // TODO: Do we need this?
    // Override the base method pointers.
    this.driverEntry = krnKbdDriverEntry;
    this.isr = krnKbdDispatchKeyPress;
    // "Constructor" code.
}

function krnKbdDriverEntry()
{
    // Initialization routine for this, the kernel-mode Keyboard Device Driver.
    this.status = "loaded";
    // More?
}

function krnKbdDispatchKeyPress(params)
{
	
    // Parse the params.    TODO: Check that they are valid and osTrapError if not.
	if(isNaN(params[0])){
		osTrapError("krnkbdDispatchKeyPress Wrong Parameters");
	}
	else{
    var keyCode = params[0];
    var isShifted = params[1];
    krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
    var chr = "";
    // Check to see if we even want to deal with the key that was pressed.
    if ( ((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
         ((keyCode >= 97) && (keyCode <= 123)))   // a..z
    {

        // Determine the character we want to display.  
        // Assume it's lowercase...
        chr = String.fromCharCode(keyCode + 32);
        // ... then check the shift key and re-adjust if necessary.
        if (isShifted)
        {
            chr = String.fromCharCode(keyCode);
        }
        // TODO: Check for caps-lock and handle as shifted if so.
        _KernelInputQueue.enqueue(chr);        
    }
    else if(keyCode==38){
        chr = String.fromCharCode(keyCode+56);
        _KernelInputQueue.enqueue(chr);
    }
    else if((keyCode >= 186) && (keyCode <192)){
        chr = String.fromCharCode(keyCode-144);
        _KernelInputQueue.enqueue(chr);
        }    
    
    else if ( ((keyCode >= 48) && (keyCode <= 57))  ||   // digits 
               (keyCode == 32)                      ||   // space
               (keyCode == 13)						||	 // enter
               (keyCode == 173)						||	 // !
               (keyCode == 192)						||
               (keyCode == 8))                        	 //backspace
    {
        if(keyCode == 50 && isShifted){
        	chr = String.fromCharCode(keyCode+14);
        	}
        else if(keyCode == 54 && isShifted){
        	chr = String.fromCharCode(keyCode+40);
        	}
        else if(keyCode == 55 || keyCode == 57 && isShifted){
        	chr = String.fromCharCode(keyCode-17);
        	}
        else if(keyCode == 56 && isShifted){
        	chr = String.fromCharCode(keyCode-14);
        	}
        else if(keyCode == 48 && isShifted){
        	chr = String.fromCharCode(keyCode-7);
        	}
        else if(keyCode == 192){
        	if(isShifted){
        		chr = String.fromCharCode(keyCode-66);
        	}
        	else{
        		chr = String.fromCharCode(keyCode-96);
        	}
        	}
        else if(keyCode == 173){
        	if(isShifted){
        	chr = String.fromCharCode(keyCode-78);
        	}
        	else{
        	chr = String.fromCharCode(keyCode-128);
        	}
        	}

        else{
            if(isShifted){
            	chr = String.fromCharCode(keyCode-16);
            }
            else{
        	chr = String.fromCharCode(keyCode);
            }
        }
        _KernelInputQueue.enqueue(chr); 
    }
    function osTrapError(msg){
    	_StdIn.putText("OS Error: " + msg);
    	_StdIn.advanceLine();
    }
}
}
