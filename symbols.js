//geneators

//generators function has an astersistic


function* neverEnding(){
	let index =0;
	while(index < 1){
		yield index++;
	}
}

let gen = neverEnding();
console.log(gen.next());
console.log(gen.next());
console.log(gen.next());