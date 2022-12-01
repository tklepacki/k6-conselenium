export function getFormKey(response) {
    var formKey = response.body.match(/'formKey':..................'/gm).toString();
    var formKeyArray = formKey.split(': ');
    var formKeyValue = formKeyArray[1].toString();
    var formKeyValueClean = formKeyValue.replace("'", "").replace("'", "");
    return formKeyValueClean
}

export function getRandomNumber() {
    const min = 0.0
    const max = 100.0
    return Math.random() * (max - min) + min;
}