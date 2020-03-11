

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCAMdAakqbkODxLzTynFje48YM6qW-qvRs",
    authDomain: "web-practice-370f5.firebaseapp.com",
    databaseURL: "https://web-practice-370f5.firebaseio.com",
    projectId: "web-practice-370f5",
    storageBucket: "web-practice-370f5.appspot.com",
    messagingSenderId: "644869696650",
    appId: "1:644869696650:web:8f92788000bab37af99173",
    measurementId: "G-7L0J66Z9FJ"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  const auth=firebase.auth();

  function signup(){
      var email = document.getElementById("email");
      var password = document.getElementById("password");
      const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
      promise.catch(e => alert(e.mesaage));
      alert("signed up successful");
      window.location="../Book.ejs"
  }
  function signin(){
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    const promise = auth.signInWithEmailAndPassword(email.value, password.value);
    promise.catch(e => alert(e.mesaage));
    //alert("signed IN"+ email.value); 
    window.location="../../views/Book.ejs"
  }
  function signout(){
       auth.signOut();
      //  alert("sign out successful");
  }
  auth.onAuthStateChanged(function(user)
  {
      if(user){
          var email =user.email;
          // window.location="../Book.html"
      }else{
        alert("hello");
      }

  });


  