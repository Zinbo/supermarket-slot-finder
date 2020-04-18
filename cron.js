const {exec} = require('child_process');
const npm = require("npm");

(async () => {
    let countdown = 10;
    
    while(countdown-- > 0) {
        npm.load(() => npm.run("cypress:run"));
        
        console.log("sending email...");
        await main();
        console.log("sent mail");

        console.log("sleep for 1 hour...");
        await sleep(3600000);
        console.log("Nap done, looping again")
    }
})();

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
