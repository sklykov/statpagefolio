export function authenticate(userData) {
    let response = new Promise((resolve, reject) => {
        if (userData.user === "demo" && userData.password == "test") {
            let responseTime = Math.round(Math.random()*2000) + 2000;  // random response time
            setTimeout(resolve(true), responseTime);   // NOTE THAT React somehow runs the code faster than the set response time
        } else {
            setTimeout(reject("Only accepts demo user"), 500);
        }
    });
    return response;
}