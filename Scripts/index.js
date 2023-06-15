/* THIS SCRIPT IS USED FOR index.html PAGE */

function preparePage() {

    if(sessionStorage.getItem("loginFlag") == null || sessionStorage.getItem("loginFlag") == "false") {
        contentContainer.style.display = "none";
        loginContainer.style.display = "";
        sessionStorage.setItem("loginFlag", "false");
        inputUserName.value = "";
        inputPassword.value = "";
        inputEmail.value = "";
        inputPhoneNumber.value = "";
    }
    else {
        loginContainer.style.display = "none";
        moveWelcome();
    }
}

function logionLogout() {
    if(sessionStorage.getItem("loginFlag") == "false") {

        let u = checkUserName();
        let p = checkPassword();
        let e = checkEmail();
        let ph = checkPhoneNumber();
        let niz = [];

        let msg = "Neuspešna registracija!\nSledeći podaci nisu ispravni:\n";
        if(!u) {
            niz.push(1);
            msg += "\tKorisničko ime\n";
        }
        if(!p) {
            niz.push(1);
            msg += "\tLozinka\n";
        }
        if(!e) {
            niz.push(1);
            msg += "\tEmail adresa\n";
        }
        if(!ph) {
            niz.push(1);
            msg += "\tBroj telefona\n";
        }
        if(niz.length > 0) {
            alert(msg);
            return;
        }

        contentContainer.style.display = "";
        loginContainer.style.display = "none";
        sessionStorage.setItem("loginFlag", "true");
        turn = 0;
        moveWelcome();
    }
    else {
        contentContainer.style.display = "none";
        loginContainer.style.display = "";
        sessionStorage.setItem("loginFlag", "false")
    }
}

function checkUserName() {
    /*
        Korisnicko ime mora poceti tacno jednim velikim slovom.
        Nakon toga sledi vise od jednog malog slova.
        Razmak
        Isto
    */
    let regex = /^[A-Z][a-z]+\ [A-Z][a-z]+$/;
    let value = inputUserName.value.toString();

    if(regex.test(value)) inputUserName.className = "valid";
    else inputUserName.className = "notValid";

    return regex.test(value);
}

function logout() {
    sessionStorage.setItem("loginFlag", "false");
}

function checkPassword() {

    /*
        Lozinka moze poceti bilo kojim malim slovom ili donjom crtom.
        Nakon toga mogu slediti mala slova, velika slova kao i znaci _ - ! ? ~ kojih moze biti ali i ne.
        Lozinka se mora zavrsiti malim slovom.
    */

    let value = inputPassword.value.toString();
    let regex = /^[a-z\_][a-zA-Z0-9\_\-\!\?\~]{0,}[a-z]$/;

    if(regex.test(value)) inputPassword.className = "valid";
    else inputPassword.className = "notValid";

    return regex.test(value);
}

function checkEmail() {

    /*
        Moze poceti malim slovom, velikim slovom, brojem ili karakterom _
        Moze slediti grupa karaktera [.-]? i alfanumericki karakteri sa _
        Znak @
        alfanumericki karakteri sa _
        grupa karaktera [.-] i alfanumericki sa donjom crtom
    */

    let value = inputEmail.value.toString();
    let regex = /^[A-Za-z0-9_]+([\.-]?[A-Za-z0-9_]+)*@[A-Za-z0-9_]+([\.-]?[A-Za-z0-9_]+)*(\.[A-Za-z0-9_]{2,3})+$/;

    if(regex.test(value)) inputEmail.className = "valid";
    else inputEmail.className = "notValid";

    return regex.test(value);
}

function checkPhoneNumber() {
    let value = inputPhoneNumber.value;
    let regex = /^\+[0-9]{3}\ ?[0-9]{3}\ ?[0-9]{3}\ ?[0-9]{3}$/;

    if(regex.test(value)) inputPhoneNumber.className = "valid";
    else inputPhoneNumber.className = "notValid";

    return regex.test(value);
}

function moveWelcome() {
    tekstPomeranje.style.fontWeight = "bold";
    tekstPomeranje.style.fontStyle = "italic";
    interval = setInterval(frame, 10);
}

function frame() {

    let datum = new Date();
    tekstPomeranje.innerHTML = "<span id='paintRed'>Dobrodošli!</span>" + "Trenutno vreme: " + datum.toLocaleTimeString();
    if(turn == 1) {
        if (positionLeft >= headerTop.offsetWidth - 290) {
            positionLeft = headerTop.offsetWidth - 290;
            turn = 0;
        }
        else {
            positionLeft += step;
            tekstPomeranje.style.left = positionLeft + 'px';
        }
    }
    else {
        if (positionLeft <= 0) {
            positionLeft = 0;
            turn = 1;
        }
        else {
            positionLeft -= step;
            tekstPomeranje.style.left = positionLeft + 'px';
        }
    }
}

let turn = undefined;
let positionLeft = 0;
let step = 1;
let interval = null;

const contentContainer = document.getElementById("contentInd");
const loginContainer = document.getElementById("login");
const headerTop = document.getElementById("headerPomeraj");

const inputUserName = document.getElementById("inp-korisnickoIme");
const inputPassword = document.getElementById("inp-lozinka");
const inputEmail = document.getElementById("inp-email");
const inputPhoneNumber = document.getElementById("inp-brojTelefona");
const tekstPomeranje = document.getElementById("mestoZaVremeIPorukuDobrodoslice")
