const START = -1;                                   // vrednost koja u matrici predstavlja pocetnu poziciju 
const END = -2;                                     // vrednost koja u matrici predstavlja krajnju poziciju
const EMPTY = 0;                                    // vrednost koja u matrici predstavlja slobodno polje
const NOT_EMPTY = 1;                                // vrednost koja u matrici predstavlja polje koje nije slobodno
const INFINITY = -1;

const brojVrsta = 13;
const brojKolona = 32;

let matrica;                                        // matrica koja se koristi kod zadatka za vizualizaciju algoritama
let visitedDFS;                                     // matrica koriscena za DFS
let prethodniciBFS;                                 // matrica koja predstavlja matricu prethodnika algoritma BFS
let prethodniciDFS;                                 // matrica koja predstavlja matricu prethodnika algoritma DFS
let docData = undefined;                            // Podaci koji su parsirani iz xml-a
let mouseclicked = false;                           // da li je pritisnut neki klik na misu

const positionStartI = 6;                             // pocetna pozicija i-ta koordinata
const positionStartJ = 2;                             // pocetna pozicija j-ta koordinata
const positionEndI = 6;                               // zavrsna pozicija i-ta koordinata
const positionEndJ = 29;                              // zavrsna pozicija j-ta koordinata

const kontejnerZaMatricu = document.getElementById("matrix");                               // referenca na div u kojem se nalazi tabela koja predstavlja matricu
const kontejnerFooter = document.getElementById("footer");                                  // referenca na div koji prestavlja footer
const tekstPomeranje = document.querySelector("div#footer span");                           // referenca na span sa tekstom koji se pomera u footer-u
const spanShowAlgo = document.querySelector("span#izaberiAlgoritam span");                  // referenca na span u kojem stoji tekst Algoritmi
const ostatciAlgoritma = document.getElementById("obrisiNakonAlgoritma");                   // referenca na span koji kada se klikne uklanja ostatke vizualizacije algoritma
const dostupniAlgoritmi = ["BFS algoritam", "DFS algoritam"]                                // niz dostupnih algoritama koji se mogu izabrati


let izborAlgoritma = null;                          // koji algoritam je izabran
let showAlgorithm = 0;                              // da li je odabran prikaz dostupnih algoritama
let dozvoliMenjanje = true;                         // indikator koji onemogucava bilo kakvu promenu na tabli u toku vizualizacije algoritma

let showMaze = 0;
const spanShowMaze = document.querySelector("span#izaberiLavirint span");

/* Pomeranje footer-a */
const step = 1;                                     // za koliko piksela se pomera tekst u footer-u
let positionLeft = 0;                               // udaljenost sa leve strane
let turn = 1;                                       // sa koje na koju stranu ide
let interval = null;                                // id intervala

function preparePage() {
    matrica = [];
    for(let i = 0; i < brojVrsta; i++) {
        let niz = [];
        for(let j = 0; j < brojKolona; j++)
            niz.push(EMPTY);
        matrica.push(niz);
    }

    mouseclicked = false;
    
    matrica[positionStartI][positionStartJ] = START;
    matrica[positionEndI][positionEndJ] = END;
    turn = 1;
    dozvoliMenjanje = true;
    ostatciAlgoritma.style.display = "none";

    generisiMatricu();
    moveFooter();
}

/*
    generisiMatricu() : void
    ------------------------
    Funkcija dinamicki, koriscenjem DOM modela, generise objekat tipa tabela i u njega
    smesta redove i celije koje predstavljaju polja matrice za prikazivanje algoritama.

    Svaka celija ima svoj jedinstven ID koji se sastoji iz reci "matrixDataID" i kombinacije
    indeksa vrste i kolone u kojima se nalazi. Ovaj ID se koristi radi lakseg referenciranja
    prilikom promene cinjenice da li je polje prazno ili ne.

    onmouseenter()
    onmousedown()
    onmouseup()
*/

function generisiMatricu() {
    let newTable = document.createElement("table");
    for(let i = 0; i < brojVrsta; i++) {
        let newRow = document.createElement('tr');
        for(let j = 0; j < brojKolona; j++) {
            let newTd = document.createElement('td');
            newTd.className = "notEnter";
            newTd.id = returnStringRepresentation(i, j);

            if(i == positionEndI && j == positionStartJ) {
                let image = document.createElement("img");
                image.src = "../Images/arrow-head.svg";
                    image.setAttribute("draggable", "false");
                    image.setAttribute("title", "Start");
                newTd.appendChild(image);
            }
            else if(i == positionEndI && j == positionEndJ) {
                let image = document.createElement("img");
                image.src = "../Images/finish-flag.svg";
                    image.setAttribute("draggable", "false");
                    image.setAttribute("title", "End");
                newTd.appendChild(image);
            }
            else {
                newTd.onmouseenter = function() {
                    if(dozvoliMenjanje) {
                        if(mouseclicked) {
                            if(newTd.className == "notEnter") {
                                newTd.className = "entered";
                                matrica[i][j] = NOT_EMPTY;
                            }
                            else {
                                newTd.className = "notEnter";
                                matrica[i][j] = EMPTY;
                            }
                        }
                    }
                }
    
                newTd.onmousedown = function() {
                    if(dozvoliMenjanje) {
                        if(mouseclicked == false) mouseclicked = true;
                        if(newTd.className == "notEnter") {
                            newTd.className = "entered";
                            matrica[i][j] = NOT_EMPTY;
                        }
                        else {
                            newTd.className = "notEnter";
                            matrica[i][j] = EMPTY;
                        }
                    }
                }
    
                newTd.onmouseup = function() {
                    if(mouseclicked == true && dozvoliMenjanje) mouseclicked = false;
                }
            }

            newRow.appendChild(newTd);
        }
        newTable.appendChild(newRow);
    }

    kontejnerZaMatricu.innerHTML = "";
    kontejnerZaMatricu.appendChild(newTable);
}

/*
    Vraca tabelu u izvorno stanje kako izgleda kada se ucita stranica
*/

function restartujTablu() {
    if(dozvoliMenjanje) {
        mouseclicked = false;
        for(let i = 0; i < brojVrsta; i++) {
            for(let j = 0; j < brojKolona; j++ ) {
                matrica[i][j] = EMPTY;
                let idToGet = returnStringRepresentation(i, j);
                document.getElementById(idToGet).className = "notEnter";
            }
        }
        matrica[positionStartI][positionStartJ] = START;
        matrica[positionEndI][positionEndJ] = END;
        ostatciAlgoritma.style.display = "none";
        generisiMatricu();
    }
}

/*
    Naredne dve funkcije se koriste za upravljanje pomeranjem teksta u footer-u
*/
function moveFooter() {
    tekstPomeranje.innerHTML = "Radovan Drašković 73/2021";
    tekstPomeranje.style.fontWeight = "bold";
    tekstPomeranje.style.fontStyle = "italic";
    interval = setInterval(frame, 10);   
}

function frame() {

    if(turn == 1) {
        if (positionLeft >= kontejnerFooter.offsetWidth - 200) {
            positionLeft = kontejnerFooter.offsetWidth - 200;
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

function prikaziIliSakrijDostupneAlgoritme() {
    if(!dozvoliMenjanje) return;

    if(showAlgorithm == 0) {
        let select1 = document.createElement("select");
        select1.id = "selectAlgoritamID";

        let defOpt = document.createElement("option");
        defOpt.value = "empty";
        select1.appendChild(defOpt);

        for(let alg of dostupniAlgoritmi) {
            let newOption = document.createElement("option");
            newOption.value = alg;
            newOption.innerHTML = alg;

            select1.appendChild(newOption);
        }

        spanShowAlgo.innerHTML = "";
        spanShowAlgo.appendChild(select1);

        showAlgorithm = 1;
        izborAlgoritma = select1;
    }
    else {
        spanShowAlgo.innerHTML = "Algoritmi";
        izborAlgoritma = null;
        showAlgorithm = 0;
    }
}

function prikaziIliSakrijDostupneLavirinte() {

    if(!dozvoliMenjanje) return;

    if(showMaze == 0) {
        let xmlReq = new XMLHttpRequest();

        xmlReq.onload = function() {
            docData = xmlReq.responseXML;
            showMaze = 1;
            showAvailable();
        }

        xmlReq.open("GET", "../XMLs/matrix1.xml", true);
        xmlReq.send();
    }
    else {
        showMaze = 0;
        spanShowMaze.innerHTML = "Generiši lavirint";
    }

}

function showAvailable() {

    let select = document.createElement("select");
    select.id = "selectAlgoritamID";

    let defOpt = document.createElement("option");
    defOpt.value = "empty";
    defOpt.onclick = function() {
        if(dozvoliMenjanje)
            generateChoosenMaze(defOpt.value)
    }
    select.appendChild(defOpt);

    for(let element of docData.getElementsByTagName("matrix") ) {
        let newOption = document.createElement("option");
        newOption.innerText = "Lavirint " + element.id;
        newOption.value = element.id;
        newOption.onclick = function() {
            if(dozvoliMenjanje)
                generateChoosenMaze(newOption.value);
        }
        select.appendChild(newOption);
    }

    spanShowMaze.innerHTML = "";
    spanShowMaze.appendChild(select);
}

function generateChoosenMaze(choosen_id) {
    
    if(choosen_id == "empty") {
        for(let i = 0; i < brojVrsta; i++) {
            for(let j = 0; j < brojKolona; j++ ) {
                matrica[i][j] = EMPTY;
                let idToGet = returnStringRepresentation(i, j);
                document.getElementById(idToGet).className = "notEnter";
            }
        }
        matrica[positionStartI][positionStartJ] = START;
        matrica[positionEndI][positionEndJ] = END;
    }

    for(let elem of docData.getElementsByTagName("matrix")) {
        
        if(elem.id == choosen_id) {
            
            for(let i = 0; i < brojVrsta; i++) {
                for(let j = 0; j < brojKolona; j++ ) {
                    matrica[i][j] = EMPTY;

                    let idToGet = returnStringRepresentation(i, j);
                    document.getElementById(idToGet).className = "notEnter";
                }
            }
            
            matrica[positionStartI][positionStartJ] = START;
            matrica[positionEndI][positionEndJ] = END;

            for(let data of elem.getElementsByTagName("data")) {
                let indexI = Number(data.getElementsByTagName("index_i")[0].textContent);
                let indexJ = Number(data.getElementsByTagName("index_j")[0].textContent);
                
                matrica[indexI][indexJ] = NOT_EMPTY;

                let idToGet = returnStringRepresentation(indexI, indexJ);
                document.getElementById(idToGet).className = "entered";

            }
            break;
        }
    }
}

function runSelectedAlgorithm() {

    if(dozvoliMenjanje) {
        if(izborAlgoritma == null) {
            alert("Nije izabran algoritam");
            return;
        }
        else if (izborAlgoritma.value == "empty") {
            alert("Nije izabran algoritam");
            return;
        }
        else {
            
            dozvoliMenjanje = false;
            ostatciAlgoritma.style.display = "none";
            if(izborAlgoritma.value == "BFS algoritam") run_bfs();
            else run_dfs();

            // postaviti polja da budu zatvorena
            spanShowAlgo.innerHTML = "Algoritmi";
            izborAlgoritma = null;
            showAlgorithm = 0;

            showMaze = 0;
            spanShowMaze.innerHTML = "Generiši lavirint";
        }
    }
}

/* IMPLEMENTACIJA BFS ALGORITMA */

function run_bfs() {

    let kopijaMatrice = matrica;
    prethodniciBFS = [];
    for(let i = 0; i < brojVrsta; i++) {
        let r = [];
        for(let j = 0; j < brojKolona; j++)
            r.push(INFINITY);
        prethodniciBFS.push(r);
    }
        
    const queue = [];
    let idToGet = returnStringRepresentation(positionStartI, positionStartJ);
    document.getElementById(idToGet).className = "visited";

    queue.push({row: positionStartI, col: positionStartJ, level: 1})

    let visited = [];
    for(let i = 0; i < brojVrsta; i++) {
        let r = [];
        for(let j = 0; j < brojKolona; j++)
            r.push(false);
        visited.push(r);
    }
    visited[positionStartI][positionStartJ] = true;
    
    // Pravci kretanja
    directions = [
        { row: 0, col: 1 },    // Desno
        { row: 1, col: 0 },    // Dole
        { row: 0, col: -1 },   // Levo
        { row: -1, col: 0 }   // Gore
    ];

    
    let interval = setInterval(() => {

        if(queue.length == 0){
            clearInterval(interval);
            rekonstruisi(prethodniciBFS);
            return 0;
        }

        const {row, col, level} = queue.shift();

        // Poseti komsije
        for(const dir of directions) {
            const newRow = row + dir.row;
            const newCol = col + dir.col;
   
            if(newRow >= 0 && newRow < brojVrsta && newCol >= 0 && newCol < brojKolona && visited[newRow][newCol] == false && kopijaMatrice[newRow][newCol] != NOT_EMPTY) {
                prethodniciBFS[newRow][newCol] = returnStringRepresentation(row, col);
                visited[newRow][newCol] = true;

                let idToGet = returnStringRepresentation(newRow, newCol);
                document.getElementById(idToGet).className = "visited";
                
                if(newRow == positionEndI && newCol == positionEndJ) {
                    clearInterval(interval);
                    rekonstruisi(prethodniciBFS);
                    return 1;
                }

                queue.push({ row: newRow, col: newCol, level: level + 1 });
            }
        }
    }, 16)
}

/* IMPLEMENTACIJA DFS ALGORITMA */

function run_dfs() {
    kopijaMatrice = matrica;
    visitedDFS = [];
  
    for (let i = 0; i < brojVrsta; i++) {
        let r = [];
        for (let j = 0; j < brojKolona; j++)
            r.push(false);
        
        visitedDFS.push(r);
    }

    prethodniciDFS = [];
    for(let i = 0; i < brojVrsta; i++) {
        let r = [];
        for(let j = 0; j < brojKolona; j++)
            r.push(INFINITY);
        prethodniciDFS.push(r);
    }
  
    let idToGet = returnStringRepresentation(positionStartI, positionStartJ);
    document.getElementById(idToGet).className = "visited";
  
    visitedDFS[positionStartI][positionStartJ] = true;
  
    directions = [
        { row: 0, col: 1 },     // Desno
        { row: 1, col: 0 },     // Dole
        { row: 0, col: -1 },    // Levo
        { row: -1, col: 0 }     // Gore
    ];
  
    let currentIndex = 0;
    function traverseDirection() {
        const dir = directions[currentIndex];
        const newRow = positionStartI + dir.row;
        const newCol = positionStartJ + dir.col;
  
        if (newRow >= 0 && newRow < brojVrsta && newCol >= 0 && newCol < brojKolona && visitedDFS[newRow][newCol] == false && kopijaMatrice[newRow][newCol] != NOT_EMPTY) {
            prethodniciDFS[newRow][newCol] = returnStringRepresentation(positionStartI, positionStartJ);
            let t = DFS_VISIT(newRow, newCol, kopijaMatrice, visitedDFS, directions, (result) => {
                if(result == 1) return 1;
                currentIndex++;
                if (currentIndex < directions.length) traverseDirection();
            });
        } else {
            currentIndex++;
            if (currentIndex < directions.length) traverseDirection();
            else rekonstruisi(prethodniciDFS);
        }
    }
    traverseDirection();
}
  
function DFS_VISIT(currentI, currentJ, matrix, visitedDFS, directions, callback) {
    let idToGet = returnStringRepresentation(currentI, currentJ);

    setTimeout(() => {
        document.getElementById(idToGet).className = "visited";
        visitedDFS[currentI][currentJ] = true;

        if (currentI == positionEndI && currentJ == positionEndJ) {
            rekonstruisi(prethodniciDFS);
            callback(1);
            return;
        }

        let currentIndex = 0;

        function traverseDirection() {
            const dir = directions[currentIndex];
            const newRow = currentI + dir.row;
            const newCol = currentJ + dir.col;

            if (newRow >= 0 && newRow < brojVrsta && newCol >= 0 && newCol < brojKolona && visitedDFS[newRow][newCol] == false && matrix[newRow][newCol] != NOT_EMPTY) {
                prethodniciDFS[newRow][newCol] = returnStringRepresentation(currentI, currentJ);
                DFS_VISIT(newRow, newCol, matrix, visitedDFS, directions, (result) => {
                    if (result == 1) {
                        callback(1);
                        return;
                    }
                    currentIndex++;
                    if (currentIndex < directions.length) traverseDirection();
                    else callback(0);
                });
            } else {
                currentIndex++;
                if (currentIndex < directions.length) traverseDirection();
                else callback(0);
            }
        }
        traverseDirection();
    }, 40);
}

/* IMPLEMENTACIJA DIJKSTRA ALGORITMA */
// POSSIBLY TO DO !!!

function rekonstruisi(matricaPrethodnika) {
    ostatciAlgoritma.style.display = "";
    if (matricaPrethodnika[positionEndI][positionEndJ] == INFINITY) {
        dozvoliMenjanje = true;
        return -1;
    }
    rekonstruisiPut(matricaPrethodnika);
}

function rekonstruisiPut(matricaPrethodnika) {

    if (matricaPrethodnika[positionEndI][positionEndJ] == INFINITY) {
        console.log("Nema puta");
        dozvoliMenjanje = true;
        return -1;
    }
  
    let indexI = positionEndI;
    let indexJ = positionEndJ;
    document.getElementById(returnStringRepresentation(positionEndI, positionEndJ)).className = "parentPath";
    let prethodnik = matricaPrethodnika[positionEndI][positionEndJ];
  
    const animatePath = () => {
        if (prethodnik == INFINITY) {
            clearInterval(interval);
            dozvoliMenjanje = true;
            return 1;
        }

        document.getElementById(prethodnik).className = "parentPath";
  
        let returnArr = decodeStringRepresentation(prethodnik);
        indexI = returnArr[0];
        indexJ = returnArr[1];
        prethodnik = matricaPrethodnika[indexI][indexJ];
    };
  
    const interval = setInterval(animatePath, 20);
    return interval;
}

function ukloniPoslediceAlgoritma() {

    if(!dozvoliMenjanje) return;
    for(let i = 0; i < brojVrsta; i++) {
        for(let j = 0; j < brojKolona; j++) {
            let idToGet = returnStringRepresentation(i, j);
            let tmp = document.getElementById(idToGet);
            if(tmp.className == "visited" || tmp.className == "parentPath")
                tmp.className = "notEnter";
        }
    }

    ostatciAlgoritma.style.display = "none";
}

function decodeStringRepresentation(encodedString) {
    let i = 0;
    let j = 0;
    let count = 0;

    for(let letter of encodedString) {
        if(letter >= '0' && letter <= '9') {
            if(count < 2) {
                i = i*10 + Number(letter);
                count++;
            }
            else {
                j = j*10 + Number(letter);
                count++;
            }
        }
    }

    return [i, j];
}

function returnStringRepresentation(indexI, indexJ) {
    let str1;
    let str2;

    if(indexI < 10) str1 = "0" + indexI;
    else str1 = indexI;

    if(indexJ < 10) str2 = "0" + indexJ;
    else str2 = indexJ;

    return "matrixDataID" + str1 + str2;
}
