// var top =10;
// var inner =50;

// function foo(){
// 	var inner =20;
// 	console.log("local", inner);
// }

// foo();
// console.log("global" , inner);



//function scope

// var name="hi";

// function dep(){
// 	if(name==="hi"){
// 		var depart ="en";// we can't access functional scope globally
// 	}
// }

// dep();
// console.log(depart);

// function call

// function myfun(){
// 	var a =10;                // function is not called -> o/p =>null
// 	var b=40;
// 	console.log(a+b);
// }

// function myfun(){
// 	var a =10;                // function is not called -> o/p =>null
// 	var b=40;
// 	console.log(a+b);
// }


// mufun(); //-> function call





/// parameter with global
//name argument will create a localscope


// var name="hr";

// function hello(name){
// 	console.log("hello" + name);
// }

// hello("bibin")

// function hi(){
	
// 	console.log(a);
	
	
// 	var a = 7;
// }

// hi();


///////////////////////IIFE-immediately invoked function expression -> anotomy function

(function(){
	var a=10;
	var b=40;
	console.log(a+b);

})();