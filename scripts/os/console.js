/* ------------
   Console.js

   Requires globals.js

   The OS Console - stdIn and stdOut by default.
   Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
   ------------ */

function CLIconsole() {
    // Properties
    this.CurrentFont      = _DefaultFontFamily;
    this.CurrentFontSize  = _DefaultFontSize;
    this.CurrentXPosition = 0;
    this.CurrentYPosition = _DefaultFontSize;
    this.buffer = "";
    this.history =[];
   
    
    // Methods
    this.init = function() {
       this.clearScreen();
       this.resetXY();
    };

    this.clearScreen = function() {
       _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
    };

    this.resetXY = function() {
       this.CurrentXPosition = 0;
       this.CurrentYPosition = this.CurrentFontSize;
    };
    
    this.handleInput = function() {
       while (_KernelInputQueue.getSize() > 0)
       {
           // Get the next character from the kernel input queue.
           var chr = _KernelInputQueue.dequeue();
           
           
           // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
           if(chr == String.fromCharCode(94)){
        	   var hist = this.history.pop();
        	   this.putText(hist);
        	   this.buffer=hist;
        	   
           }
           //Backspace
           else if (chr == String.fromCharCode(8)){
        	   var BackspaceOffset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize,this.buffer.substr(this.buffer.length - 1) );
        	   //delete char out of the buffer
        	   this.buffer = this.buffer.slice(0, - 1);
        	   //delete the char visually from the user
        	   _DrawingContext.clearRect(this.CurrentXPosition,this.CurrentYPosition+4,-BackspaceOffset,-(this.CurrentFontSize+3));
        	   this.CurrentXPosition = this.CurrentXPosition - BackspaceOffset;
           }
           else if (chr == String.fromCharCode(13))  //     Enter key
           {
               // The enter key marks the end of a console command, so ...
               // ... tell the shell ...
               _OsShell.handleInput(this.buffer);
               // ... and reset our buffer.
               this.history.push(this.buffer);
               this.buffer = "";
           }
           // TODO: Write a case for Ctrl-C.
           else
           {
               // This is a "normal" character, so ...
               // ... draw it on the screen...
               this.putText(chr);
               // ... and add it to our buffer.
               this.buffer += chr;
           }
       }
    };

    this.putText = function(text) {
       // My first inclination here was to write two functions: putChar() and putString().
       // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
       // between the two.  So rather than be like PHP and write two (or more) functions that
       // do the same thing, thereby encouraging confusion and decreasing readability, I
       // decided to write one function and use the term "text" to connote string or char.
       if (text !== "")
       {
           // Draw the text at the current X and Y coordinates.
           _DrawingContext.drawText(this.CurrentFont, this.CurrentFontSize, this.CurrentXPosition, this.CurrentYPosition, text);
         // Move the current X position.
           var offset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, text);
           this.CurrentXPosition = this.CurrentXPosition + offset;
       }
    };

    this.advanceLine = function() {
       this.CurrentXPosition = 0;
       this.CurrentYPosition += _DefaultFontSize + _FontHeightMargin;
       //scrolling
       if(this.CurrentYPosition >= 460){
    	   //capture the canvas before deleting it
    	   var oldCanvas = _DrawingContext.getImageData(0,0,_Canvas.width,_Canvas.height);
    	   this.clearScreen();
    	   this.resetXY();
    	   //paste the old canvas back on with negative y coord to simulate scrolling
    	   _DrawingContext.putImageData(oldCanvas,0,-70);
    	   this.CurrentYPosition=410;
       }

    };
}
