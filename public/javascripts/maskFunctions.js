const masked = document.querySelector('.masked')
const unmasked = document.querySelector('.unmasked')

if (masked) {
    masked.addEventListener("keyup", function () {
        unmasked.value = destroyMask(this.value);
        this.value = createMask(unmasked.value)
    })
}

function createMask(dollars) {
    console.log(dollars)
    dollars += '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(dollars)) {
        dollars = dollars.replace(rgx, '$1' + ',' + '$2');
    }
    return dollars;
}

function destroyMask(string) {
    console.log(string)
    return string.replace(/\D/g, '');
}