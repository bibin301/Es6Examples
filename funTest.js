function hello(){

	var hit = 5;

	return function hi(){
		console.log(hit);
	}
}

var j = hello();
j();