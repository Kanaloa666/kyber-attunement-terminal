function attune(color){

const result = document.getElementById("result")

const messages = {

blue:"Kyber resonance detected. Guardian alignment confirmed.",

green:"Kyber resonance detected. Consular alignment confirmed.",

red:"Warning: Corrupted kyber signature detected.",

purple:"Rare resonance detected. Balance of light and dark.",

yellow:"Sentinel alignment confirmed.",

black:"Unknown kyber frequency. Ancient energy detected."
}

result.innerText = messages[color]

}

function resetTerminal(){

document.getElementById("result").innerText = ""

}
