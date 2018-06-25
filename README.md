
# **What is this**
   The aim of the project is to visualize the process of the weakest precondition's computing

### Where is it working
* Environment is a browser
* [Uploaded build](http://w-p.surge.sh)

### What was used
* There is being used React framework, JavaScript

### Work process
* You enter a program in TEL programming language and a postcondition for the program, after that press button, and you will see first step of computing of the weakest precondition using special notation, to proceed process of computing choose appropriate block of 'wp[Index]' and click that, you will see next step, when a precondition computing for a block is completed, there is a button '=Substitute all wp[Index]=', when it is pressed, you can see how all occurrences of current block will be replaced with computed precondition for the 'wp[Index]' block. 
   
### Final report
* [Report](https://drive.google.com/open?id=1BF58lh2uYpvUW2jxNR5WOc1pmvj0HsnOJCjtNFbZiJA)

### TEL programming language
* #### Description
  TEL is a fictional programminng language designed for educational purposes.
* #### Notation
  ##### BNF:
  * <const_or_var\> ::= <constant\> | <variable\>
  * <relation\> ::= = | \> | < | ~= | >= | <=
  * <operation\> ::= | + | -
  * <expression\> ::= <const_or_var\> |   
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <const_or_var\> <bln\> <operation\> <bln\> <const_or_var\>
  * <assignment\> ::= <variable\> <bln\> := <bln\> <expression\>
  * <comparison\> ::= <const_or_var\> <bln\> <relation\> <bln\> <const_or_var\>
  * <program\> ::= <assignment\> |  
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <bln\> <program\> <bln\> |  
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (<bln\> <program\> <n/s> ; <n/s> <program\> <n/s>) |  
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (<bln\> IF <n/s> <spc\> <comparison\> <spc\> <n/s> THEN <n/s> <program\> <n/s> ELSE <n/s> <program\> <n/s> ) |  
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (<bln\> WHILE <n/s><spc\> <comparison\> <spc\><n/s> DO <n/s> <program\> <n/s> ) |
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (<bln\> WIN <n/s> <spc\> <formula\> <spc\> <n/s> EOI <n/s> <spc\> <comparison\> <spc\> <n/s> DO <n/s> <program\> <n/s> )

  ##### Comment on notation:
  * All concepts are in angles “< >”.
  * All terminal symbols (but spacing symbols) are as they depicted.
  * All explicit spacing in the definition above is just for structuring and readability.
  * <spc\> stays for the single blank space.
  * <bln\> stays for any (including zero) number of <spc\>.
  * <n/s> stays for a single new line or a single blank space.
  * <constant\> stays for any integer in decimal notation (leading zeros are admissible).
  * <variable\> stays for any sequence of low-case Latin letters and decimal digits staring with aletter.
  * <formula\> stays for any sequence of low-case Latin letters, decimal digits, <operation\> and
  * <relation\> symbols, and parenthesis ‘(‘ and ‘)’ balanced with respect to parenthesis, i.e.
  * The total number of ‘(‘ is equal to the total number of ‘)’,
  * Scanning from left to right the number ‘(‘ is never less than the number of ‘)’.

* #### TEL program example
  * program32 := start ;  
    (IF&nbsp; q = x&nbsp; THEN  
    &nbsp; &nbsp; z := 0 ;  
    &nbsp; &nbsp; fo := m2 + 13  
    ELSE   
    &nbsp; &nbsp; pre := condition ;  
    &nbsp; &nbsp; formal := semantics ;  
    &nbsp; &nbsp; (IF&nbsp; max =d&nbsp; THEN d :=0- max ELSE s33  := var ) ;  
    &nbsp; &nbsp; dmitry := kochetov ;  
    &nbsp; &nbsp; maxim := popov ;  
    &nbsp; &nbsp; (WIN&nbsp; x < u&nbsp; EOI&nbsp; x = y&nbsp; DO  
    &nbsp; &nbsp; &nbsp; &nbsp; qwe := 13   
    &nbsp; &nbsp; )  
    )
    
  * If you get a parse exception it's most likely you type one space char instead of 2 space chars which is specified in BNF
    
* #### Postcondition example
  * x >= formal
  * !(x<formal) && (dmitry + (pre * formal)) < 13
  * (x>formal || r12 ~= 22) && (dmitry - 1) < 13 || q > e
  
### Screenshots
  ![](../assets/InputPage1.png?raw=true 'Input page 1')
  ![](../assets/InputPage2.png?raw=true 'Input page 2')
  ![](../assets/VisualisationPage1.png?raw=true 'Visualisation page 1')
  ![](../assets/VisualisationPage2.png?raw=true 'Visualisation page 2')
  ![](../assets/VisualisationPage3.png?raw=true 'Visualisation page 3')
  ![](../assets/VisualisationPage4.png?raw=true 'Visualisation page 4')
