const userName = document.getElementById("name")
const userEmail = document.getElementById("email")
const userPass = document.getElementById("password")
const userGst = document.getElementById("gst")
const userPan = document.getElementById("pan")
const userMobile = document.getElementById("mobile")
const userStore = document.getElementById("store")
const userAddress = document.getElementById("storeAddress")
const error = document.getElementById("err")

function validate(e){
    if(e.target.value.trim().length<5){
        e.target.style.outline = "1px solid red";
    } else {
        e.target.style.outline = "none";
    }
}

function validateEmail(e){
    let regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/
    if(!regex.test(e.target.value.trim())){
        e.target.style.outline = "1px solid red";
        error.innerText = "Email is invalid !"
        return false
    } else{
        e.target.style.outline = "none";
        error.innerText = ""
    }
}

function validatePass(e){
    let regex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/; 
    if(!regex.test(e.target.value.trim())){
        document.getElementById("passwordInput").style.outline = "1px solid red";
        error.innerText = "Password must begin with a capital and contain lower, number and alphanumeric character"
        return false
    } else{
        document.getElementById("passwordInput").style.outline = "none";
        error.innerText = ""
    }
}

userName.addEventListener('input',validate)
userEmail.addEventListener('input',validateEmail)
userPass.addEventListener('input',validatePass)
userGst.addEventListener('input',validate)
userPan.addEventListener('input',validate)
userMobile.addEventListener('input',validate)
userStore.addEventListener('input',validate)
userAddress.addEventListener('input',validate)

document.getElementById("signUpBtn").addEventListener('click',e=>{
    if(error.innerText!=""){
        error.innerText = "All fields are required !"
        return false
    } else if(userName=="" || userEmail=="" || userPass=="" || userGst=="" || userMobile=="" || userMobile=="" || userStore=="" ||userAddress==""){
        error.innerText = "All fields are required !"
        return false
    }
    fetch("/signup",{
        redirect:"follow",
        method:"POST",
        headers:{
            'content-type':'application/json'
        },
        body:JSON.stringify({
            name:userName.value,
            email:userEmail.value,
            password:userPass.value,
            gst:userGst.value,
            pan:userPan.value,
            mobile:userMobile.value,
            store:userStore.value,
            address:userAddress.value
        })
    })
    .then((result) => {
        if(result.redirected){
            Swal.fire({
                title: 'Request submitted',
                text: 'Your signup application has been received. Please wait for approvel from our admin.',
                icon: 'success',
                confirmButtonText: 'Ok'
            })  
            location.href = result.url
        } else if(result.status===403){
            document.getElementById("err").innerText = "Email already Exists !"
            setTimeout(()=>{
                document.getElementById("err").innerText = ""
            },3000)
        }
    })
    .catch((err) => {
        document.getElementById("err").innerText = err
    });
})

document.getElementById("hideShowPass").addEventListener('click',e=>{
    if(e.target.classList.contains("fa-eye")){
        e.target.classList.remove("fa-eye")
        e.target.classList.add("fa-eye-slash")
        userPass.type = "text"
    } else {
        e.target.classList.add("fa-eye")
        e.target.classList.remove("fa-eye-slash")
        userPass.type = "password"
    }
})

