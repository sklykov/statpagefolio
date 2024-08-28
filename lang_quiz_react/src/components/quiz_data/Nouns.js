// Simulating the response from the server
const nouns_data = [
    {"noun_id": 1, noun: "Heimat", en_noun: "homeland", article: "die", right_answers: 0, learnt: false}, 
    {"noun_id": 2, noun: "Ausflug", en_noun: "short (1-2) travel", article: "der", right_answers: 0, learnt: false}, 
    {"noun_id": 3, noun: "Erfahrung", en_noun: "experience", article: "die", right_answers: 0, learnt: false},
    {"noun_id": 4, noun: "Fluss", en_noun: "river, flow", article: "der", right_answers: 0, learnt: false},
    {"noun_id": 5, noun: "Menge", en_noun: "amount, quantity", article: "die", right_answers: 0, learnt: false}, 
    {"noun_id": 6, noun: "Ergebnis", en_noun: "result, outcome", article: "das", right_answers: 0, learnt: false},
    {"noun_id": 7, noun: "Bescheid", en_noun: "notice, decision", article: "der", right_answers: 0, learnt: false}, 
    {"noun_id": 8, noun: "Abbruch", en_noun: "cancellation", article: "der", right_answers: 0, learnt: false},
    {"noun_id": 9, noun: "Gepäck", en_noun: "luggage, baggage", article: "das", right_answers: 0, learnt: false}, 
    {"noun_id": 10, noun: "Zweifel", en_noun: "doubt", article: "der", right_answers: 0, learnt: false}, 
    {"noun_id": 11, noun: "Hintergrund", en_noun: "experience", article: "der", right_answers: 0, learnt: false}, 
    {"noun_id": 12, noun: "Angebot", en_noun: "offer", article: "das", right_answers: 0, learnt: false}
]

// function returning Promise with the sliced data from the array above
export function getNounsSlice(n_words, userCredentials, learntNouns) {
    let response = new Promise((resolve, reject) => {
        let n_nouns = nouns_data.length; let initialData = nouns_data.slice();
        // Filter out the already learnt nouns from the initial array with words
        let nounsFiltered = false;
        if (learntNouns.length > 0) {
            for (let learntNoun of learntNouns) {
                let indexEl = initialData.indexOf(learntNoun);  // find the learnt noun
                if (indexEl > -1) {
                    initialData.splice(indexEl, 1);  // remove the learnt noun
                    if (!nounsFiltered) nounsFiltered = true;
                }
            }
        }
        if (nounsFiltered) {
            n_nouns = initialData.length;
        }
        // Select random slice of words for returning, set resolve and reject answers
        let responseTime = Math.round(Math.random()*2000) + 2000;  // random ms response time from the specified range
        // console.log("Expected response time:", responseTime);
        if ((n_words <= n_nouns) && (userCredentials.authenticated === true)) {
            let nounsSlice = []; 
            // Randomly select and return the slice of 
            for (let i=0; i < n_words; i++) {
                let iRandom = Math.floor(Math.random()*initialData.length); 
                nounsSlice.push(initialData[iRandom]); initialData.splice(iRandom, 1);
            } 
            setTimeout(resolve(nounsSlice), responseTime);  // send the found slice with nouns
        } else {
            if (n_words > n_nouns) {
                setTimeout(reject("# of requested words is larger than the remained not learnt nouns"), responseTime);
            } else {
                setTimeout(reject("User not authenticated (credentials not found)"), responseTime);
            }
        }
    }); 
    return response;
}
