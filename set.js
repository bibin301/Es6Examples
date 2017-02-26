var mySet = new Set();

mySet.add(10);
mySet.add('foo');
mySet.add({'foo':'bar'})
console.log(mySet.size);
mySet.delete('foo');

console.log(mySet.has(10));



for (let item of mySet){
	console.log(item);
}