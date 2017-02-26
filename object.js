 
'use strict';
 let firstName="bibin";
 let lastName="raj";


 let person ={

 	firstName,
 	lastName,
 	sayHello(){
 		console.log("function",this.firstName);
 	},
 	['is'+  'Computed'] :'yes||'

 }
 
 person.sayHello();
console.log("Object1",person.firstName,person.lastName)

//second section

let mySmbol = Symbol();

let movie = {
	name:'star',
	year:1888,
	'genre':'fantasy',
	['r' + 'rating'] : 8.7,
	[mySmbol]:'a value'
}


for (let p of Object.keys(movie)){
	console.log("second type" ,p)
}


//object reasign

const d = {url:'http.com'};
function demo (options){
	let opts = Object.assign(d,options);
	console.log("reasign",opts.url);
}

demo({url:'http.com1'}) 

//object assign


let obj ={food:'hello'};
let taco ={food:'hi'};
Object.assign(obj,taco);
console.log(obj);


//
//You should avoid using functions 
//in JSON, the functions will lose their scope, and you would have
// to use eval() to convert them back into functions.


var text = '{ "name":"John", "age":"function() {return 30;}", "city":"New York"}';
var obj2 = JSON.parse(text);
obj2.age2 = eval("(" + obj2.age + ")");
console.log("function info",obj2.age2());



// let person={
// 	fname:"hello",
// 	lname:"hi"
// }



// var objectInfo ={int:3,"id":"3",'hi':function(){console.log("hello") },"name":"bibin"}
// // console.log(JSON.stringify(NameObj));
// var obj2 = JSON.parse(objectInfo);


// // var obj4 = JSON.parse(NameObj);



// // obj4.age3 = eval("(" + NameObj.function + ")");


// console.log("function obj test", obj2)



