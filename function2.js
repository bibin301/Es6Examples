//Rhs ->read
//Lhs->write

function init() {
  var name = "Mozilla"; // name is a local variable created by init
  function displayName() { // displayName() is the inner function, a closure
    alert(name); // use variable declared in the parent function    
  }
  displayName();    
}
init();

// var add = (function(){
// 	var name="jellabi";
// 	console.log("bibin");
// 	return function (){ return name;}
// })();

// console.log("hello "+add());

// console.log("hi "+add());

// console.log("darling "+add());

///has own property
// var item = {"a" : 2, "b": 3};

// if(item.hasOwnProperty("a"))
// 	console.log(item["a"])
// else 
// 	console.log("no element found")


// var myname="bibin";
// function myFun(name){
// 	console.log("inter",name)
// }

//myFun(myname);


//execution phase

  