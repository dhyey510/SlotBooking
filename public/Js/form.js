const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});

// img upload
const fileupld=document.querySelector('#profile-img');
const filebtn=document.querySelector('#img-upload');

filebtn.addEventListener("change",function(){
    const file=this.files[0];

    if(file){
        const reader=new FileReader();

        reader.addEventListener("load",function(){
            fileupld.setAttribute("src",this.result);
        });

        reader.readAsDataURL(file);

    }else{

    }
});