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
    {"noun_id": 11, noun: "Hintergrund", en_noun: "experience", article: "der", right_answers: 0, learnt: false}
]

function getNounsSlice(n_words, userCredentials) {
    let response = new Promise((resolve, reject) => {
        const n_nouns = nouns_data.length; 
        if ((n_words <= n_nouns) && (userCredentials.user === "demo") ) {
            
        } else {

        }
    }); 
    return response;
}