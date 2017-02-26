var handler ={
	get:function (target,name){
		//custom logic
		if(name in target){
			return target[name];
		} else{
			return 'error';
		}
	}
}


var p = new Proxy({},handler);
p.foo ='bar';
p.bar ='baz';
console.log(p.foo,p.bar);

console.log(p.foobar);