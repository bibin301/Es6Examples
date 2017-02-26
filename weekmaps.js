//limitations we can get size
//WeakMap allows garbage collector to do its task but not Map.

var myMap = new Map();
var myWeakMap = new WeakMap();
var object1 ={'foo':'bar'};
var object2 ={'bar':'baz'};

myMap.set(object1,'hello');
myWeakMap.set(object2,'hello');
console.log(myMap.get(object1));
console.log(myWeakMap.get(object2));

object1 = null;
object2 =null;

myMap.forEach(function(key,val){
	console.log(key,val);
})



