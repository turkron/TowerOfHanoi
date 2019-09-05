const getEl = (elementID) => document.getElementById(elementID.toString());

function startGame() {
    hanoi(totalDisks, "pole1", "pole2", "pole3");
    console.log(solution);
    getEl("StartScreen").style.visibility = "hidden";
    getEl("GameScreen").style.visibility = "visible";
    let promiseChain = solution.reduce((promise, nextStep, index) => {
        return promise.then(() => {
           return waitForClick(nextStep);
        })
    }, Promise.resolve())
        .then(() => {
            getEl("NextStep").style.visibility = "hidden";
            getEl("complete").style.visibility = "visible";
            getEl("stepInfo").textContent = "";
            return Promise.resolve();
        })
}
let nextStep;
const totalDisks = 5;

let currentState = {
    pole1: [5,4,3,2,1],
    pole2: [],
    pole3: []
}

const waitForClick = (step) => {
    return new Promise(resolve => {
        nextStep = takeTurn(resolve, step);
        return getEl("NextStep").addEventListener("click", nextStep);
    })
}

const takeTurn = (resolve, step) => {
    if (step == null) return resolve;
    currentState[step[1]] = _.without(currentState[step[1]],step[0]);
    currentState[step[2]].push(step[0]);
    redrawGame();
    getEl("stepInfo").textContent = ("Disk " + step[0] + ", move from " + step[1] + " to " + step[2]);
    return resolve;
}
let solution = [null];

const redrawGame = () => {
    console.log(currentState)
    _.range(1,4).map(poleNumber=> {
        currentState["pole" + poleNumber].map((piece,index) => {
            const display = document.getElementById("piece" + piece)
            display.style.top = poleTop[index]+"%";
            display.style.left = pieceLocations[piece-1][poleNumber-1] + "%";
        })
    })
}

const hanoi = function (disk, src, aux, dst) {
    if (disk > 0) {
        hanoi(disk - 1, src, dst, aux);
        solution.push([disk, src , dst]);
        hanoi(disk - 1, aux, src, dst);
    }
};

const poleTop = [20, 22.5, 25, 27.5, 30].reverse();
const pieceLocations = [
    [21.5, 46.5, 71.5],
    [20, 45, 70],
    [18.5, 43.5, 68.5],
    [17, 42, 67],
    [15.5, 40.5, 65.5]
]
