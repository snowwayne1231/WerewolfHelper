export function newPlayers(num, start) {
    let i = start;
    return new Array(num).fill(0).map(e => {
        const obj = {
            id: i,
            name: `[ ${i} ]`,
            killing: false,
            killed: false,
            isWolf: false,
            guarded: false,
            poisoning: false,
            classword: 'none',
        }
        i++;
        return obj;
    });
}


export function playMp3(key, waitTime = 3000) {
    if (!window) return console.log('error play mp3 for not have window.');

    const promise = new Promise((resolve, reject) => {
      if (key && window.audio[key]) {
        window.audio[key].play();
      } else {
        reject(`do not have audio for key: [${key}]`);
      }

      window.setTimeout(function(){
        resolve();
      }, waitTime);
    });
    return promise;
}


export function yesorno(yesFunc, noFunc) {
    window._yes_function = yesFunc;
    window._no_function = noFunc;
    const confirm = window.$$('#process-alert')[0];
    confirm.style.display = 'block';
}
