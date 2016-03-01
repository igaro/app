// block old browsers
if (env && env.navigator) {

    var ua = env.navigator.userAgent.toLowerCase();
    if (
        (ua.indexOf('msie') !== -1 && parseFloat(ua.split('msie')[1]) < 8) ||
        (ua.indexOf('android') !== -1 && parseFloat(ua.match(/android\s([0-9\.]*)/)[1]) < 4)
    ) throw { incompatible:true };
}
