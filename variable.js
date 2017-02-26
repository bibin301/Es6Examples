//es5 var
//global var scope
//local var scope or function scope..
//es6 var decleartion types
//var, let & const

//no block scope for javascript
//let block scope

// function varTest(){
// var bestCricketer ="virat";//global scope
// var team ="sa";
// if(team==="sa"){
// 	var bestCricketer ="sachin";//global scope
// 	console.log("best cricker value inside the if block is" + bestCricketer  +"\n")//sachin
// }
// console.log("best cricker value outside the if block is" + bestCricketer  +"\n")//sachin
// };

// varTest();

// function letTest(){
// let bestCricketer ="virat";//global scope
// let team ="sa";
// if(team==="sa"){
// 	let bestCricketer ="sachin";//block scope
// 	console.log("best cricker value inside the if block is" + bestCricketer  +"\n")//sachin
// }
// console.log("best cricker value outside the if block is" + bestCricketer  +"\n")//sachin
// };

//  letTest();
      




// function myFunction(a) {
//     //var c= a * b;
//     console.log(a);                // Function returns the product of a and b
// }
// var x = myFunction("bibin"); 





// var x = myFunction(4, 3);        // Function is called, return value will end up in x

// function myFunction(a, b) {
//      var c= a * b;
//     console.log(c);               // Function returns the product of a and b
// } 


//diff between var and let

// function sayHello(){
// 	// var name="bibin";
// 	// var name="raj";
// 	// console.log(name);
// 	let name="bibin";
// 	let name2="raj";
// 	console.log(name);
// 	console.log(name2);
// }
// sayHello();


//const -> keyword can't reasign ,read only memory



// const pI =3.14;
// //var pI =3.14;
// console.log(pI)


// const data ={
// 	"name":"bibin"
// }

// console.log(data.name);


const key = 'abc123';
let points = 50;
let winner = false;

points = 60;
console.log(points);

// const gt ='hello';
// gt ="hi";
// console.log(gt);





// let key word section



let first = "first";

second ="second";

console.log("global let" , second);

var first1 ="first var key";

 second2 ="second var key2"
 console.log(second2);
//end
let info ="hello every one"


info ="hi";

console.log(info);


// function for var

function hello(){

	a= 6;

	var  a= 9;

	console.log("function" , a)
	let data ="hello every one";
	console.log("let ",data)
}

hello();




function myInfo(){

let a =4;
a=9;

console.log("let function" , a);
}


myInfo();