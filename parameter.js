//way es5


// function multiple(num,num2){


// var num2= typeof num2=="undefined"? 2	:num2;
// return(console.log(num*num2))
// };

// multiple(8);


//es6 way


let multiple = (num1,num2=10)=>console.log(num1*num2);
multiple(8);