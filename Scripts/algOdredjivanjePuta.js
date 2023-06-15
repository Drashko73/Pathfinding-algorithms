/* THIS SCRIPT IS USED FOR algoritmiZaOdredjivanjePuta.html PAGE */

function preparePage() {
    kontejnerZaKod.style.display = "none";
    
    for(let elem of izabranAlgoritam.children) elem.selected = false;
    for(let elem of izabranJezik.children) elem.selected = false;

    parseCodeForAlgorithms();
}

function parseCodeForAlgorithms() {
    let xmlReq = new XMLHttpRequest();
 
    xmlReq.onload = function() {
        docData = xmlReq.responseXML;
        prikaziKod();
    }

    xmlReq.open("GET", "../XMLs/algorithms.xml", true);
    xmlReq.send();
}

function logout() {
    sessionStorage.setItem("loginFlag", "false");
}

function prikaziKod() {
    let algoritam = izabranAlgoritam.selectedOptions[0].value.toString().toLowerCase();
    let pjezik = izabranJezik.selectedOptions[0].value.toString().toLowerCase();
    let stringFind = algoritam + "_" + pjezik;

    for(let alg of docData.getElementsByTagName("algorithm")) {
        if(alg.id == stringFind) {

            let newElement = document.createElement("code");
            
            for(let line of alg.getElementsByTagName("line")) {
                let stringLine = "";
                for(let letter of line.textContent) {
                    if(letter == " ") stringLine += "&nbsp;";
                    else stringLine += letter;
                }
                newElement.innerHTML += stringLine + "<br>";
            }

            kontejnerZaKod.innerHTML = "";
            kontejnerZaKod.appendChild(newElement);
            kontejnerZaKod.style.display = "";
            break;
        }
    }
}


const kontejnerIzbor = document.getElementById("algLangChoose");
const kontejnerZaKod = document.getElementById("spaceForCode");
const izabranAlgoritam = document.getElementById("izborAlgoritma");
const izabranJezik = document.getElementById("planguage");

let docData = undefined;
