module.exports.transform = (date) => {
    const day   = parseInt(date.substring(0,2));
    const month  = parseInt(date.substring(3,5));
    const year   = parseInt(date.substring(6,10));
    const hour   = parseInt(date.substring(11,13));
    const minutes = parseInt(date.substring(14,16));
    //const seconds = parseInt(date.substring(17,19));
    const newDate = new Date(year, month-1, day, hour+1, minutes);
    return newDate;
}

module.exports.laterDate = (date) => date > new Date();