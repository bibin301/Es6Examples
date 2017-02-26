
function foo(one,two,three){
	console.log(one);
}
var arr =[0,1,2];
foo (arr);
//op->[0,1,2]


function foo(one,two,three){
	console.log(one);
}
var arr =[0,1,2];
foo.apply(null,arr);

//op->[0,1,2]
//0

//spread operator


function foo(one,two,three){
	console.log(one);
}
var arr =[0,1,2];
foo(...arr);






// rest -> can pass multiple params
//javascript internally call arguments
function multiply(...s){

	console.log("multiply",s)
}

 multiply("hi","hello")
 //op->['hi','hello']


function log(){

	console.log("arguments",arguments)
}

 log("hi","hello")


 //op->{'o':'hi','1':'hello '}