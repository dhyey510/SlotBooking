const cancel=document.getElementById("cancel");
const form=document.getElementById("form");
const book=document.getElementById("book-now");

cancel.addEventListener("click",function(){
    form.classList.remove("show-model");
});

book.addEventListener('click',function(){
    form.classList.add('show-model');
});

