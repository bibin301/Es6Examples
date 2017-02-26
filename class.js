
  
// REST	
// REpresentational State Transfer
class Person{
	constructor(age,height){
		this.age =age;
		this.height =height;

console.log(this.age,this.height);
	}
}

var Hello = new Person(5,6)



class Foo{
	constructor(first,second){
		this.first =first;
		this.second = second;
	}

	gettotal(){
		 return this.first+this.second;
	}
}

var foo = new Foo(4,8);
console.log(foo.gettotal());



//sto extend


class Cat{
	constructor(name){
		this.name =name;
	}
	speak(){
		console.log(this.name + 'makes a noise');
	}
}

class Lion extends Cat{
	speak(){
		super.speak();
		console.log(this.name + 'makes a roars');

	}
}
var meow  = new Lion("meow");
meow.speak();