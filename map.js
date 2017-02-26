var myMap = new Map();
console.log(myMap.size)
myMap.set('foo','bar');
myMap.set(function(){},'baz')
console.log(myMap.size)
console.log(myMap.get('foo'))


