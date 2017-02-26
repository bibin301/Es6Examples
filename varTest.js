
'use strict';

function varTest(){




var foo ="true";
if(true){
	var foo ="false";
	console.log(foo)//false
}
console.log(foo);//false
}

varTest();



//let keyword test



 function letTest(){

let foo ="true";
//let foo ="false";
if(true){
	let foo ="false";
	console.log(foo)//false
}
console.log(foo);//true

 }

 letTest();




 function constantTest(){

const foo ="true";

if(true){
	const foo ="false";
	console.log("constant",foo)//false
}
console.log(foo);//true

 }

 constantTest();

