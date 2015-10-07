//# sourceURL=conf.app.js

module.requires = [
    { name: 'core.router.js' },
    { name: 'core.language.js' },
    { name: 'core.currency.js'},
    { name: 'core.country.js' },
    { name: 'instance.toast.js' },
    { name: 'instance.modaldialog.js' }
];

// block old browsers
var ua = window.navigator.userAgent.toLowerCase();
if (
    (ua.indexOf('msie') !== -1 && parseFloat(ua.split('msie')[1]) < 10) ||
    (ua.indexOf('android') !== -1 && parseFloat(ua.match(/android\s([0-9\.]*)/)[1]) < 4)
) throw { incompatible:true };


module.exports = function(app, params) {

    "use strict";

    var rootEmitter = app['core.events'].rootEmitter,
        Amd = app['instance.amd'],
        router = app['core.router'],
        debug = app['core.debug'],
        language = app['core.language'],
        currency = app['core.currency'],
        country = app['core.country'],
        ModalDialog = app['instance.modaldialog'],
        Toast = app['instance.toast'],
        dom = app['core.dom'];

    return Promise.all([

    // add supported languages - IETF
    language.setPool({
        en : {
            name:"English"
        },
        fr : {
            name:"Français"
        },
        de : {
            name:"Deutsch"
        },
        id : {
            name:"Bahasa Indonesia"
        },
        "zh-CN" : {
            name:"简体中文"
        },
        ar : {
            name:"Arabic",
            rtl:true
        },
        pl : {
            name:"Polish"
        },
        ru : {
            name: "Русский"
        },
        pt : {
            name: "Português"
        },
        es : {
            name: "Español"
        }
      }),

      // add supported countries - iso 3166-2
      country.setPool({
        "AD": {
          "callingCode": [
            "376"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Andorra")
        },
        "AE": {
          "callingCode": [
            "971"
          ],
          "currency": [
            "AED"
          ],
          "name": _tr("United Arab Emirates"),
        },
        "AF": {
          "callingCode": [
            "93"
          ],
          "currency": [
            "AFN"
          ],
          "name": _tr("Afghanistan")
        },
        "AG": {
          "callingCode": [
            "1268"
          ],
          "currency": [
            "XCD"
          ],
          "name": _tr("Antigua and Barbuda")
        },
        "AI": {
          "callingCode": [
            "1264"
          ],
          "currency": [
            "XCD"
          ],
          "name": _tr("Anguilla"),
        },
        "AL": {
          "callingCode": [
            "355"
          ],
          "currency": [
            "ALL"
          ],
          "name": _tr("Albania")
        },
        "AM": {
          "callingCode": [
            "374"
          ],
          "currency": [
            "AMD"
          ],
          "name": _tr("Armenia")
        },
        "AO": {
          "callingCode": [
            "244"
          ],
          "currency": [
            "AOA"
          ],
          "name": _tr("Angola")
        },
        "AQ": {
          "name": _tr("Antarctica")
        },
        "AR": {
          "callingCode": [
            "54"
          ],
          "currency": [
            "ARS"
          ],
          "name": _tr("Argentina"),
        },
        "AS": {
          "callingCode": [
            "1684"
          ],
          "currency": [
            "USD"
          ],
          "name": _tr("American Samoa")
        },
        "AT": {
          "callingCode": [
            "43"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Austria")
        },
        "AU": {
          "callingCode": [
            "61"
          ],
          "currency": [
            "AUD"
          ],
          "name": _tr("Australia")
        },
        "AW": {
          "callingCode": [
            "297"
          ],
          "currency": [
            "AWG"
          ],
          "name": _tr("Aruba")
        },
        "AX": {
          "callingCode": [
            "358"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Åland Islands")
        },
        "AZ": {
          "callingCode": [
            "994"
          ],
          "currency": [
            "AZN"
          ],
          "name": _tr("Azerbaijan")
        },
        "BA": {
          "callingCode": [
            "387"
          ],
          "currency": [
            "BAM"
          ],
          "name": _tr("Bosnia and Herzegovina")
        },
        "BB": {
          "callingCode": [
            "1246"
          ],
          "currency": [
            "BBD"
          ],
          "name": _tr("Barbados")
        },
        "BD": {
          "callingCode": [
            "880"
          ],
          "currency": [
            "BDT"
          ],
          "name": _tr("Bangladesh")
        },
        "BE": {
          "callingCode": [
            "32"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Belgium")
        },
        "BF": {
          "callingCode": [
            "226"
          ],
          "currency": [
            "XOF"
          ],
          "name": _tr("Burkina Faso")
        },
        "BG": {
          "callingCode": [
            "359"
          ],
          "currency": [
            "BGN"
          ],
          "name": _tr("Bulgaria")
        },
        "BH": {
          "callingCode": [
            "973"
          ],
          "currency": [
            "BHD"
          ],
          "name": _tr("Bahrain")
        },
        "BI": {
          "callingCode": [
            "257"
          ],
          "currency": [
            "BIF"
          ],
          "name": _tr("Burundi")
        },
        "BJ": {
          "callingCode": [
            "229"
          ],
          "currency": [
            "XOF"
          ],
          "name": _tr("Benin")
        },
        "BL": {
          "callingCode": [
            "590"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Saint Barthélemy")
        },
        "BM": {
          "callingCode": [
            "1441"
          ],
          "currency": [
            "BMD"
          ],
          "name": _tr("Bermuda")
        },
        "BN": {
          "callingCode": [
            "673"
          ],
          "currency": [
            "BND"
          ],
          "name": _tr("Brunei")
        },
        "BO": {
          "callingCode": [
            "591"
          ],
          "currency": [
            "BOB",
            "BOV"
          ],
          "name": _tr("Bolivia")
        },
        "BQ": {
          "callingCode": [
            "5997"
          ],
          "currency": [
            "USD"
          ],
          "name": _tr("Bonaire")
        },
        "BR": {
          "callingCode": [
            "55"
          ],
          "currency": [
            "BRL"
          ],
          "name": _tr("Brazil")
        },
        "BS": {
          "callingCode": [
            "1242"
          ],
          "currency": [
            "BSD"
          ],
          "name": _tr("Bahamas"),
        },
        "BT": {
          "callingCode": [
            "975"
          ],
          "currency": [
            "BTN",
            "INR"
          ],
          "name": _tr("Bhutan")
        },
        "BV": {
          "currency": [
            "NOK"
          ],
          "name": _tr("Bouvet Island")
        },
        "BW": {
          "callingCode": [
            "267"
          ],
          "currency": [
            "BWP"
          ],
          "name": _tr("Botswana")
        },
        "BY": {
          "callingCode": [
            "375"
          ],
          "currency": [
            "BYR"
          ],
          "name": _tr("Belarus")
        },
        "BZ": {
          "callingCode": [
            "501"
          ],
          "currency": [
            "BZD"
          ],
          "name": _tr("Belize")
        },
        "CA": {
          "callingCode": [
            "1"
          ],
          "currency": [
            "CAD"
          ],
          "name": _tr("Canada")
        },
        "CC": {
          "callingCode": [
            "61"
          ],
          "currency": [
            "AUD"
          ],
          "name": _tr("Cocos (Keeling) Islands")
        },
        "CD": {
          "callingCode": [
            "243"
          ],
          "currency": [
            "CDF"
          ],
          "name": _tr("DR Congo")
        },
        "CF": {
          "callingCode": [
            "236"
          ],
          "currency": [
            "XAF"
          ],
          "name": _tr("Central African Republic")
        },
        "CG": {
          "callingCode": [
            "242"
          ],
          "currency": [
            "XAF"
          ],
          "name": _tr("Republic of the Congo")
        },
        "CH": {
          "callingCode": [
            "41"
          ],
          "currency": [
            "CHE",
            "CHF",
            "CHW"
          ],
          "name": _tr("Switzerland")
        },
        "CI": {
          "callingCode": [
            "225"
          ],
          "currency": [
            "XOF"
          ],
          "name": _tr("Ivory Coast")
        },
        "CK": {
          "callingCode": [
            "682"
          ],
          "currency": [
            "NZD"
          ],
          "name": _tr("Cook Islands")
        },
        "CL": {
          "callingCode": [
            "56"
          ],
          "currency": [
            "CLF",
            "CLP"
          ],
          "name": _tr("Chile")
        },
        "CM": {
          "callingCode": [
            "237"
          ],
          "currency": [
            "XAF"
          ],
          "name": _tr("Cameroon")
        },
        "CN": {
          "callingCode": [
            "86"
          ],
          "currency": [
            "CNY"
          ],
          "name": _tr("China")
        },
        "CO": {
          "callingCode": [
            "57"
          ],
          "currency": [
            "COP"
          ],
          "name": _tr("Colombia")
        },
        "CR": {
          "callingCode": [
            "506"
          ],
          "currency": [
            "CRC"
          ],
          "name": _tr("Costa Rica")
        },
        "CU": {
          "callingCode": [
            "53"
          ],
          "currency": [
            "CUC",
            "CUP"
          ],
          "name": _tr("Cuba")
        },
        "CV": {
          "callingCode": [
            "238"
          ],
          "currency": [
            "CVE"
          ],
          "name": _tr("Cape Verde")
        },
        "CW": {
          "callingCode": [
            "5999"
          ],
          "currency": [
            "ANG"
          ],
          "name": _tr("Curaçao")
        },
        "CX": {
          "callingCode": [
            "61"
          ],
          "currency": [
            "AUD"
          ],
          "name": _tr("Christmas Island")
        },
        "CY": {
          "callingCode": [
            "357"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Cyprus")
        },
        "CZ": {
          "callingCode": [
            "420"
          ],
          "currency": [
            "CZK"
          ],
          "name": _tr("Czech Republic")
        },
        "DE": {
          "callingCode": [
            "49"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Germany")
        },
        "DJ": {
          "callingCode": [
            "253"
          ],
          "currency": [
            "DJF"
          ],
          "name": _tr("Djibouti")
        },
        "DK": {
          "callingCode": [
            "45"
          ],
          "currency": [
            "DKK"
          ],
          "name": _tr("Denmark")
        },
        "DM": {
          "callingCode": [
            "1767"
          ],
          "currency": [
            "XCD"
          ],
          "name": _tr("Dominica")
        },
        "DO": {
          "callingCode": [
            "1809",
            "1829",
            "1849"
          ],
          "currency": [
            "DOP"
          ],
          "name": _tr("Dominican Republic")
        },
        "DZ": {
          "callingCode": [
            "213"
          ],
          "currency": [
            "DZD"
          ],
          "name": _tr("Algeria")
        },
        "EC": {
          "callingCode": [
            "593"
          ],
          "currency": [
            "USD"
          ],
          "name": _tr("Ecuador")
        },
        "EE": {
          "callingCode": [
            "372"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Estonia")
        },
        "EG": {
          "callingCode": [
            "20"
          ],
          "currency": [
            "EGP"
          ],
          "name": _tr("Egypt")
        },
        "EH": {
          "callingCode": [
            "212"
          ],
          "currency": [
            "MAD",
            "DZD",
            "MRO"
          ],
          "name": _tr("Western Sahara")
        },
        "ER": {
          "callingCode": [
            "291"
          ],
          "currency": [
            "ERN"
          ],
          "name": _tr("Eritrea")
        },
        "ES": {
          "callingCode": [
            "34"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Spain")
        },
        "ET": {
          "callingCode": [
            "251"
          ],
          "currency": [
            "ETB"
          ],
          "name": _tr("Ethiopia")
        },
        "FI": {
          "callingCode": [
            "358"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Finland")
        },
        "FJ": {
          "callingCode": [
            "679"
          ],
          "currency": [
            "FJD"
          ],
          "name": _tr("Fiji")
        },
        "FK": {
          "callingCode": [
            "500"
          ],
          "currency": [
            "FKP"
          ],
          "name": _tr("Falkland Islands")
        },
        "FM": {
          "callingCode": [
            "691"
          ],
          "currency": [
            "USD"
          ],
          "name": _tr("Micronesia")
        },
        "FO": {
          "callingCode": [
            "298"
          ],
          "currency": [
            "DKK"
          ],
          "name": _tr("Faroe Islands")
        },
        "FR": {
          "callingCode": [
            "33"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("France")
        },
        "GA": {
          "callingCode": [
            "241"
          ],
          "currency": [
            "XAF"
          ],
          "name": _tr("Gabon")
        },
        "GB": {
          "callingCode": [
            "44"
          ],
          "currency": [
            "GBP"
          ],
          "name": _tr("United Kingdom")
        },
        "GD": {
          "callingCode": [
            "1473"
          ],
          "currency": [
            "XCD"
          ],
          "name": _tr("Grenada")
        },
        "GE": {
          "callingCode": [
            "995"
          ],
          "currency": [
            "GEL"
          ],
          "name": _tr("Georgia")
        },
        "GF": {
          "callingCode": [
            "594"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("French Guiana")
        },
        "GG": {
          "callingCode": [
            "44"
          ],
          "currency": [
            "GBP"
          ],
          "name": _tr("Guernsey")
        },
        "GH": {
          "callingCode": [
            "233"
          ],
          "currency": [
            "GHS"
          ],
          "name": _tr("Ghana")
        },
        "GI": {
          "callingCode": [
            "350"
          ],
          "currency": [
            "GIP"
          ],
          "name": _tr("Gibraltar")
        },
        "GL": {
          "callingCode": [
            "299"
          ],
          "currency": [
            "DKK"
          ],
          "name": _tr("Greenland")
        },
        "GM": {
          "callingCode": [
            "220"
          ],
          "currency": [
            "GMD"
          ],
          "name": _tr("Gambia")
        },
        "GN": {
          "callingCode": [
            "224"
          ],
          "currency": [
            "GNF"
          ],
          "name": _tr("Guinea")
        },
        "GP": {
          "callingCode": [
            "590"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Guadeloupe")
        },
        "GQ": {
          "callingCode": [
            "240"
          ],
          "currency": [
            "XAF"
          ],
          "name": _tr("Equatorial Guinea")
        },
        "GR": {
          "callingCode": [
            "30"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Greece")
        },
        "GS": {
          "callingCode": [
            "500"
          ],
          "currency": [
            "GBP"
          ],
          "name": _tr("South Georgia")
        },
        "GT": {
          "callingCode": [
            "502"
          ],
          "currency": [
            "GTQ"
          ],
          "name": _tr("Guatemala")
        },
        "GU": {
          "callingCode": [
            "1671"
          ],
          "currency": [
            "USD"
          ],
          "name": _tr("Guam")
        },
        "GW": {
          "callingCode": [
            "245"
          ],
          "currency": [
            "XOF"
          ],
          "name": _tr("Guinea-Bissau")
        },
        "GY": {
          "callingCode": [
            "592"
          ],
          "currency": [
            "GYD"
          ],
          "name": _tr("Guyana")
        },
        "HK": {
          "callingCode": [
            "852"
          ],
          "currency": [
            "HKD"
          ],
          "name": _tr("Hong Kong")
        },
        "HM": {
          "currency": [
            "AUD"
          ],
          "name": _tr("Heard Island and McDonald Islands")
        },
        "HN": {
          "callingCode": [
            "504"
          ],
          "currency": [
            "HNL"
          ],
          "name": _tr("Honduras")
        },
        "HR": {
          "callingCode": [
            "385"
          ],
          "currency": [
            "HRK"
          ],
          "name": _tr("Croatia")
        },
        "HT": {
          "callingCode": [
            "509"
          ],
          "currency": [
            "HTG",
            "USD"
          ],
          "name": _tr("Haiti")
        },
        "HU": {
          "callingCode": [
            "36"
          ],
          "currency": [
            "HUF"
          ],
          "name": _tr("Hungary")
        },
        "ID": {
          "callingCode": [
            "62"
          ],
          "currency": [
            "IDR"
          ],
          "name": _tr("Indonesia")
        },
        "IE": {
          "callingCode": [
            "353"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Ireland")
        },
        "IL": {
          "callingCode": [
            "972"
          ],
          "currency": [
            "ILS"
          ],
          "name": _tr("Israel")
        },
        "IM": {
          "callingCode": [
            "44"
          ],
          "currency": [
            "GBP"
          ],
          "name": _tr("Isle of Man")
        },
        "IN": {
          "callingCode": [
            "91"
          ],
          "currency": [
            "INR"
          ],
          "name": _tr("India")
        },
        "IO": {
          "callingCode": [
            "246"
          ],
          "currency": [
            "USD"
          ],
          "name": _tr("British Indian Ocean Territory")
        },
        "IQ": {
          "callingCode": [
            "964"
          ],
          "currency": [
            "IQD"
          ],
          "name": _tr("Iraq")
        },
        "IR": {
          "callingCode": [
            "98"
          ],
          "currency": [
            "IRR"
          ],
          "name": _tr("Iran")
        },
        "IS": {
          "callingCode": [
            "354"
          ],
          "currency": [
            "ISK"
          ],
          "name": _tr("Iceland")
        },
        "IT": {
          "callingCode": [
            "39"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Italy")
        },
        "JE": {
          "callingCode": [
            "44"
          ],
          "currency": [
            "GBP"
          ],
          "name": _tr("Jersey")
        },
        "JM": {
          "callingCode": [
            "1876"
          ],
          "currency": [
            "JMD"
          ],
          "name": _tr("Jamaica")
        },
        "JO": {
          "callingCode": [
            "962"
          ],
          "currency": [
            "JOD"
          ],
          "name": _tr("Jordan")
        },
        "JP": {
          "callingCode": [
            "81"
          ],
          "currency": [
            "JPY"
          ],
          "name": _tr("Japan")
        },
        "KE": {
          "callingCode": [
            "254"
          ],
          "currency": [
            "KES"
          ],
          "name": _tr("Kenya")
        },
        "KG": {
          "callingCode": [
            "996"
          ],
          "currency": [
            "KGS"
          ],
          "name": _tr("Kyrgyzstan")
        },
        "KH": {
          "callingCode": [
            "855"
          ],
          "currency": [
            "KHR"
          ],
          "name": _tr("Cambodia")
        },
        "KI": {
          "callingCode": [
            "686"
          ],
          "currency": [
            "AUD"
          ],
          "name": _tr("Kiribati")
        },
        "KM": {
          "callingCode": [
            "269"
          ],
          "currency": [
            "KMF"
          ],
          "name": _tr("Comoros")
        },
        "KN": {
          "callingCode": [
            "1869"
          ],
          "currency": [
            "XCD"
          ],
          "name": _tr("Saint Kitts and Nevis"),
        },
        "KP": {
          "callingCode": [
            "850"
          ],
          "currency": [
            "KPW"
          ],
          "name": _tr("North Korea"),
        },
        "KR": {
          "callingCode": [
            "82"
          ],
          "currency": [
            "KRW"
          ],
          "name": _tr("South Korea")
        },
        "KW": {
          "callingCode": [
            "965"
          ],
          "currency": [
            "KWD"
          ],
          "name": _tr("Kuwait")
        },
        "KY": {
          "callingCode": [
            "1345"
          ],
          "currency": [
            "KYD"
          ],
          "name": _tr("Cayman Islands")
        },
        "KZ": {
          "callingCode": [
            "76",
            "77"
          ],
          "currency": [
            "KZT"
          ],
          "name": _tr("Kazakhstan")
        },
        "LA": {
          "callingCode": [
            "856"
          ],
          "currency": [
            "LAK"
          ],
          "name": _tr("Laos")
        },
        "LB": {
          "callingCode": [
            "961"
          ],
          "currency": [
            "LBP"
          ],
          "name": _tr("Lebanon")
        },
        "LC": {
          "callingCode": [
            "1758"
          ],
          "currency": [
            "XCD"
          ],
          "name": _tr("Saint Lucia")
        },
        "LI": {
          "callingCode": [
            "423"
          ],
          "currency": [
            "CHF"
          ],
          "name": _tr("Liechtenstein")
        },
        "LK": {
          "callingCode": [
            "94"
          ],
          "currency": [
            "LKR"
          ],
          "name": _tr("Sri Lanka")
        },
        "LR": {
          "callingCode": [
            "231"
          ],
          "currency": [
            "LRD"
          ],
          "name": _tr("Liberia")
        },
        "LS": {
          "callingCode": [
            "266"
          ],
          "currency": [
            "LSL",
            "ZAR"
          ],
          "name": _tr("Lesotho")
        },
        "LT": {
          "callingCode": [
            "370"
          ],
          "currency": [
            "LTL"
          ],
          "name": _tr("Lithuania")
        },
        "LU": {
          "callingCode": [
            "352"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Luxembourg")
        },
        "LV": {
          "callingCode": [
            "371"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Latvia")
        },
        "LY": {
          "callingCode": [
            "218"
          ],
          "currency": [
            "LYD"
          ],
          "name": _tr("Libya")
        },
        "MA": {
          "callingCode": [
            "212"
          ],
          "currency": [
            "MAD"
          ],
          "name": _tr("Morocco")
        },
        "MC": {
          "callingCode": [
            "377"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Monaco")
        },
        "MD": {
          "callingCode": [
            "373"
          ],
          "currency": [
            "MDL"
          ],
          "name": _tr("Moldova")
        },
        "ME": {
          "callingCode": [
            "382"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Montenegro")
        },
        "MF": {
          "callingCode": [
            "590"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Saint Martin")
        },
        "MG": {
          "callingCode": [
            "261"
          ],
          "currency": [
            "MGA"
          ],
          "name": _tr("Madagascar")
        },
        "MH": {
          "callingCode": [
            "692"
          ],
          "currency": [
            "USD"
          ],
          "name": _tr("Marshall Islands")
        },
        "MK": {
          "callingCode": [
            "389"
          ],
          "currency": [
            "MKD"
          ],
          "name": _tr("Macedonia")
        },
        "ML": {
          "callingCode": [
            "223"
          ],
          "currency": [
            "XOF"
          ],
          "name": _tr("Mali")
        },
        "MM": {
          "callingCode": [
            "95"
          ],
          "currency": [
            "MMK"
          ],
          "name": _tr("Myanmar")
        },
        "MN": {
          "callingCode": [
            "976"
          ],
          "currency": [
            "MNT"
          ],
          "name": _tr("Mongolia")
        },
        "MO": {
          "callingCode": [
            "853"
          ],
          "currency": [
            "MOP"
          ],
          "name": _tr("Macau")
        },
        "MP": {
          "callingCode": [
            "1670"
          ],
          "currency": [
            "USD"
          ],
          "name": _tr("Northern Mariana Islands")
        },
        "MQ": {
          "callingCode": [
            "596"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Martinique")
        },
        "MR": {
          "callingCode": [
            "222"
          ],
          "currency": [
            "MRO"
          ],
          "name": _tr("Mauritania")
        },
        "MS": {
          "callingCode": [
            "1664"
          ],
          "currency": [
            "XCD"
          ],
          "name": _tr("Montserrat")
        },
        "MT": {
          "callingCode": [
            "356"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Malta")
        },
        "MU": {
          "callingCode": [
            "230"
          ],
          "currency": [
            "MUR"
          ],
          "name": _tr("Mauritius")
        },
        "MV": {
          "callingCode": [
            "960"
          ],
          "currency": [
            "MVR"
          ],
          "name": _tr("Maldives")
        },
        "MW": {
          "callingCode": [
            "265"
          ],
          "currency": [
            "MWK"
          ],
          "name": _tr("Malawi")
        },
        "MX": {
          "callingCode": [
            "52"
          ],
          "currency": [
            "MXN"
          ],
          "name": _tr("Mexico")
        },
        "MY": {
          "callingCode": [
            "60"
          ],
          "currency": [
            "MYR"
          ],
          "name": _tr("Malaysia")
        },
        "MZ": {
          "callingCode": [
            "258"
          ],
          "currency": [
            "MZN"
          ],
          "name": _tr("Mozambique")
        },
        "NA": {
          "callingCode": [
            "264"
          ],
          "currency": [
            "NAD",
            "ZAR"
          ],
          "name": _tr("Namibia")
        },
        "NC": {
          "callingCode": [
            "687"
          ],
          "currency": [
            "XPF"
          ],
          "name": _tr("New Caledonia")
        },
        "NE": {
          "callingCode": [
            "227"
          ],
          "currency": [
            "XOF"
          ],
          "name": _tr("Niger")
        },
        "NF": {
          "callingCode": [
            "672"
          ],
          "currency": [
            "AUD"
          ],
          "name": _tr("Norfolk Island")
        },
        "NG": {
          "callingCode": [
            "234"
          ],
          "currency": [
            "NGN"
          ],
          "name": _tr("Nigeria")
        },
        "NI": {
          "callingCode": [
            "505"
          ],
          "currency": [
            "NIO"
          ],
          "name": _tr("Nicaragua")
        },
        "NL": {
          "callingCode": [
            "31"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Netherlands")
        },
        "NO": {
          "callingCode": [
            "47"
          ],
          "currency": [
            "NOK"
          ],
          "name": _tr("Norway")
        },
        "NP": {
          "callingCode": [
            "977"
          ],
          "currency": [
            "NPR"
          ],
          "name": _tr("Nepal")
        },
        "NR": {
          "callingCode": [
            "674"
          ],
          "currency": [
            "AUD"
          ],
          "name": _tr("Nauru")
        },
        "NU": {
          "callingCode": [
            "683"
          ],
          "currency": [
            "NZD"
          ],
          "name": _tr("Niue")
        },
        "NZ": {
          "callingCode": [
            "64"
          ],
          "currency": [
            "NZD"
          ],
          "name": _tr("New Zealand")
        },
        "OM": {
          "callingCode": [
            "968"
          ],
          "currency": [
            "OMR"
          ],
          "name": _tr("Oman")
        },
        "PA": {
          "callingCode": [
            "507"
          ],
          "currency": [
            "PAB",
            "USD"
          ],
          "name": _tr("Panama")
        },
        "PE": {
          "callingCode": [
            "51"
          ],
          "currency": [
            "PEN"
          ],
          "name": _tr("Peru")
        },
        "PF": {
          "callingCode": [
            "689"
          ],
          "currency": [
            "XPF"
          ],
          "name": _tr("French Polynesia")
        },
        "PG": {
          "callingCode": [
            "675"
          ],
          "currency": [
            "PGK"
          ],
          "name": _tr("Papua New Guinea")
        },
        "PH": {
          "callingCode": [
            "63"
          ],
          "currency": [
            "PHP"
          ],
          "name": _tr("Philippines")
        },
        "PK": {
          "callingCode": [
            "92"
          ],
          "currency": [
            "PKR"
          ],
          "name": _tr("Pakistan")
        },
        "PL": {
          "callingCode": [
            "48"
          ],
          "currency": [
            "PLN"
          ],
          "name": _tr("Poland")
        },
        "PM": {
          "callingCode": [
            "508"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Saint Pierre and Miquelon")
        },
        "PN": {
          "callingCode": [
            "64"
          ],
          "currency": [
            "NZD"
          ],
          "name": _tr("Pitcairn Islands")
        },
        "PR": {
          "callingCode": [
            "1787",
            "1939"
          ],
          "currency": [
            "USD"
          ],
          "name": _tr("Puerto Rico")
        },
        "PS": {
          "callingCode": [
            "970"
          ],
          "currency": [
            "ILS"
          ],
          "name": _tr("Palestine")
        },
        "PT": {
          "callingCode": [
            "351"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Portugal")
        },
        "PW": {
          "callingCode": [
            "680"
          ],
          "currency": [
            "USD"
          ],
          "name": _tr("Palau")
        },
        "PY": {
          "callingCode": [
            "595"
          ],
          "currency": [
            "PYG"
          ],
          "name": _tr("Paraguay")
        },
        "QA": {
          "callingCode": [
            "974"
          ],
          "currency": [
            "QAR"
          ],
          "name": _tr("Qatar")
        },
        "RE": {
          "callingCode": [
            "262"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Réunion")
        },
        "RO": {
          "callingCode": [
            "40"
          ],
          "currency": [
            "RON"
          ],
          "name": _tr("Romania")
        },
        "RS": {
          "callingCode": [
            "381"
          ],
          "currency": [
            "RSD"
          ],
          "name": _tr("Serbia")
        },
        "RU": {
          "callingCode": [
            "7"
          ],
          "currency": [
            "RUB"
          ],
          "name": _tr("Russia")
        },
        "RW": {
          "callingCode": [
            "250"
          ],
          "currency": [
            "RWF"
          ],
          "name": _tr("Rwanda")
        },
        "SA": {
          "callingCode": [
            "966"
          ],
          "currency": [
            "SAR"
          ],
          "name": _tr("Saudi Arabia")
        },
        "SB": {
          "callingCode": [
            "677"
          ],
          "currency": [
            "SDB"
          ],
          "name": _tr("Solomon Islands")
        },
        "SC": {
          "callingCode": [
            "248"
          ],
          "currency": [
            "SCR"
          ],
          "name": _tr("Seychelles")
        },
        "SD": {
          "callingCode": [
            "249"
          ],
          "currency": [
            "SDG"
          ],
          "name": _tr("Sudan")
        },
        "SE": {
          "callingCode": [
            "46"
          ],
          "currency": [
            "SEK"
          ],
          "name": _tr("Sweden")
        },
        "SG": {
          "callingCode": [
            "65"
          ],
          "currency": [
            "SGD"
          ],
          "name": _tr("Singapore")
        },
        "SH": {
          "callingCode": [
            "290"
          ],
          "currency": [
            "SHP"
          ],
          "name": _tr("Saint Helena, Ascension and Tristan da Cunha")
        },
        "SI": {
          "callingCode": [
            "386"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Slovenia")
        },
        "SJ": {
          "callingCode": [
            "4779"
          ],
          "currency": [
            "NOK"
          ],
          "name": _tr("Svalbard and Jan Mayen")
        },
        "SK": {
          "callingCode": [
            "421"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Slovakia")
        },
        "SL": {
          "callingCode": [
            "232"
          ],
          "currency": [
            "SLL"
          ],
          "name": _tr("Sierra Leone")
        },
        "SM": {
          "callingCode": [
            "378"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("San Marino")
        },
        "SN": {
          "callingCode": [
            "221"
          ],
          "currency": [
            "XOF"
          ],
          "name": _tr("Senegal")
        },
        "SO": {
          "callingCode": [
            "252"
          ],
          "currency": [
            "SOS"
          ],
          "name": _tr("Somalia")
        },
        "SR": {
          "callingCode": [
            "597"
          ],
          "currency": [
            "SRD"
          ],
          "name": _tr("Suriname")
        },
        "SS": {
          "callingCode": [
            "211"
          ],
          "currency": [
            "SSP"
          ],
          "name": _tr("South Sudan")
        },
        "ST": {
          "callingCode": [
            "239"
          ],
          "currency": [
            "STD"
          ],
          "name": _tr("São Tomé and Príncipe")
        },
        "SV": {
          "callingCode": [
            "503"
          ],
          "currency": [
            "SVC",
            "USD"
          ],
          "name": _tr("El Salvador")
        },
        "SX": {
          "callingCode": [
            "1721"
          ],
          "currency": [
            "ANG"
          ],
          "name": _tr("Sint Maarten")
        },
        "SY": {
          "callingCode": [
            "963"
          ],
          "currency": [
            "SYP"
          ],
          "name": _tr("Syria")
        },
        "SZ": {
          "callingCode": [
            "268"
          ],
          "currency": [
            "SZL"
          ],
          "name": _tr("Swaziland")
        },
        "TC": {
          "callingCode": [
            "1649"
          ],
          "currency": [
            "USD"
          ],
          "name": _tr("Turks and Caicos Islands")
        },
        "TD": {
          "callingCode": [
            "235"
          ],
          "currency": [
            "XAF"
          ],
          "name": _tr("Chad")
        },
        "TF": {
          "currency": [
            "EUR"
          ],
          "name": _tr("French Southern and Antarctic Lands")
        },
        "TG": {
          "callingCode": [
            "228"
          ],
          "currency": [
            "XOF"
          ],
          "name": _tr("Togo")
        },
        "TH": {
          "callingCode": [
            "66"
          ],
          "currency": [
            "THB"
          ],
          "name": _tr("Thailand")
        },
        "TJ": {
          "callingCode": [
            "992"
          ],
          "currency": [
            "TJS"
          ],
          "name": _tr("Tajikistan")
        },
        "TK": {
          "callingCode": [
            "690"
          ],
          "currency": [
            "NZD"
          ],
          "name": _tr("Tokelau")
        },
        "TL": {
          "callingCode": [
            "670"
          ],
          "currency": [
            "USD"
          ],
          "name": _tr("Timor-Leste")
        },
        "TM": {
          "callingCode": [
            "993"
          ],
          "currency": [
            "TMT"
          ],
          "name": _tr("Turkmenistan")
        },
        "TN": {
          "callingCode": [
            "216"
          ],
          "currency": [
            "TND"
          ],
          "name": _tr("Tunisia")
        },
        "TO": {
          "callingCode": [
            "676"
          ],
          "currency": [
            "TOP"
          ],
          "name": _tr("Tonga")
        },
        "TR": {
          "callingCode": [
            "90"
          ],
          "currency": [
            "TRY"
          ],
          "name": _tr("Turkey")
        },
        "TT": {
          "callingCode": [
            "1868"
          ],
          "currency": [
            "TTD"
          ],
          "name": _tr("Trinidad and Tobago")
        },
        "TV": {
          "callingCode": [
            "688"
          ],
          "currency": [
            "AUD"
          ],
          "name": _tr("Tuvalu")
        },
        "TW": {
          "callingCode": [
            "886"
          ],
          "currency": [
            "TWD"
          ],
          "name": _tr("Taiwan")
        },
        "TZ": {
          "callingCode": [
            "255"
          ],
          "currency": [
            "TZS"
          ],
          "name": _tr("Tanzania")
        },
        "UA": {
          "callingCode": [
            "380"
          ],
          "currency": [
            "UAH"
          ],
          "name": _tr("Ukraine")
        },
        "UG": {
          "callingCode": [
            "256"
          ],
          "currency": [
            "UGX"
          ],
          "name": _tr("Uganda")
        },
        "UM": {
          "currency": [
            "USD"
          ],
          "name": _tr("United States Minor Outlying Islands")
        },
        "US": {
          "callingCode": [
            "1"
          ],
          "currency": [
            "USD",
            "USN",
            "USS"
          ],
          "name": _tr("United States")
        },
        "UY": {
          "callingCode": [
            "598"
          ],
          "currency": [
            "UYI",
            "UYU"
          ],
          "name": _tr("Uruguay")
        },
        "UZ": {
          "callingCode": [
            "998"
          ],
          "currency": [
            "UZS"
          ],
          "name": _tr("Uzbekistan")
        },
        "VA": {
          "callingCode": [
            "3906698",
            "379"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Vatican City")
        },
        "VC": {
          "callingCode": [
            "1784"
          ],
          "currency": [
            "XCD"
          ],
          "name": _tr("Saint Vincent and the Grenadines")
        },
        "VE": {
          "callingCode": [
            "58"
          ],
          "currency": [
            "VEF"
          ],
          "name": _tr("Venezuela")
        },
        "VG": {
          "callingCode": [
            "1284"
          ],
          "currency": [
            "USD"
          ],
          "name": _tr("British Virgin Islands")
        },
        "VI": {
          "callingCode": [
            "1340"
          ],
          "currency": [
            "USD"
          ],
          "name": _tr("United States Virgin Islands")
        },
        "VN": {
          "callingCode": [
            "84"
          ],
          "currency": [
            "VND"
          ],
          "name": _tr("Vietnam")
        },
        "VU": {
          "callingCode": [
            "678"
          ],
          "currency": [
            "VUV"
          ],
          "name": _tr("Vanuatu")
        },
        "WF": {
          "callingCode": [
            "681"
          ],
          "currency": [
            "XPF"
          ],
          "name": _tr("Wallis and Futuna")
        },
        "WS": {
          "callingCode": [
            "685"
          ],
          "currency": [
            "WST"
          ],
          "name": _tr("Samoa")
        },
        "XK": {
          "callingCode": [
            "377",
            "381",
            "386"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Kosovo")
        },
        "YE": {
          "callingCode": [
            "967"
          ],
          "currency": [
            "YER"
          ],
          "name": _tr("Yemen")
        },
        "YT": {
          "callingCode": [
            "262"
          ],
          "currency": [
            "EUR"
          ],
          "name": _tr("Mayotte")
        },
        "ZA": {
          "callingCode": [
            "27"
          ],
          "currency": [
            "ZAR"
          ],
          "name": _tr("South Africa")
        },
        "ZM": {
          "callingCode": [
            "260"
          ],
          "currency": [
            "ZMK"
          ],
          "name": _tr("Zambia")
        },
        "ZW": {
          "callingCode": [
            "263"
          ],
          "currency": [
            "ZWL"
          ],
          "name": _tr("Zimbabwe")
        }
      })

    ]).then(function () {

      // add supported currencies - ISO 4217
      return currency.setPool({
          USD : {
              symbol : '$',
              name : _tr("United States Dollar")
          },
          GBP : {
              symbol : '£',
              name : _tr("British Sterling")
          },
          AUD : {
              symbol : '$',
              name : _tr("Australian Dollar"),
              format : function(v,o) {
                  var x = (v<0?'-':'')+ 'A$'+currency.commarize(v < 0? v*-1: v);
                  if (o && o.colorize) {
                      x = currency.colorize(v,x);
                  }
                  return x;
              }
          },
          EUR : {
              symbol : '€',
              name : _tr("Euro")
          }
      }).then(function() {

        // use native alert box if available
        if (window.navigator.notification && window.navigator.notification.alert)
            window.alert = window.navigator.notification.alert;

        // adds route.* files as a route provider
        router.addProvider({
            handles : function() {
                return true;
            },
            url : params.repo,
            fetch : function(o) {
                var name = o.path.join('.');
                return new Amd().get({
                    modules:[{ name: name+'.js' }]
                }).then(function() {
                    if (! app[name])
                        throw {
                            msg:'invalid route file',
                            route:name
                        };
                    return {
                        js: app[name]
                    };
                });
            }
        });

        // debug handling
        var displaying = false;
        rootEmitter.on('core.debug.handle', function (o) {
            var value = typeof o === 'object' && typeof o.value === 'object'? o.value : {},
                error = value.error;
            if (displaying || error === 0)
                return;
            displaying = true;
            var param = params.conf,
                msg = typeof error === 'object' && error.incompatible? param.msgIncompatible : param.msgErr;
            try {
                new ModalDialog().alert({
                    message: msg
                }).then(function() {
                    displaying = false;
                });
            } catch (e) {
                // should never get here
                try {
                    window.alert(msg.en);
                } catch(eX) {
                    window.alert(eX);
                }
                displaying = false;
            }
            return debug.log.append(o.value,o.path,o.event);
        });

        // route loading overlay
        dom.mk('div',null,null,function() {
            var self = this,
                rME = router.managers.event,
                body = document.body,
                bodyStyle = body.style,
                ref;
            dom.mk('div',this,dom.mk('div',null,_tr("Loading...")),'progress');
            this.className = 'igaro-router-loading';
            rME.on('to-in-progress', function() {
                clearTimeout(ref);
                ref = setTimeout(function() {
                    bodyStyle.overflow = 'hidden';
                    body.appendChild(self);
                }, 700);
            });
            rME.on(['to-end','to-error'], function(o) {
                if (! o || o.value !== -1600) {
                    clearTimeout(ref);
                    if (! params.conf.noBodyStyleOverflowReset)
                        bodyStyle.overflow = '';
                    dom.rm(self);
                }
            });
        });

        // handle router errors
        router.managers.event.on('to-error', function (o) {
            // invalid url
            if (o.uri)
                return new ModalDialog().alert({
                    message: language.substitute(_tr("A problem with the URL was detected and loading aborted prematurely.\n\nError: %[0]"),o.uri)
                });
            // get the http xhr code
            var httpCode = o;
            while (typeof httpCode === 'object' && httpCode.error) {
              httpCode = httpCode.error;
            }
            if (httpCode === 404)
                return new ModalDialog().alert({
                    message: _tr("The page you requested does not exist.")
                });
            // else handle
            return router.managers.debug.handle(o);
        });

        // capture 401 xhr errors (unauthorized) and begin oauth if for account
        var replay = [];
        rootEmitter.on('instance.xhr.response', function(o) {
            if (o.xhr.status !== 401 || ! o.stash || ! o.stash.account)
                return;
            replay.push(o);
            var acc = o.stash.account,
                oauth = acc.oauth2;
            // token is bad, wipe
            acc.setToken();
            // begin oauth if not in progress
            if (! oauth.inProgress) {
                oauth.exec().then(function (o) {
                    var token = o.token;
                    acc.setToken(token);
                    replay.forEach(function(p,i) {
                        var s = p.stash.account;
                        if (p && ((typeof s === 'function' && acc === s()) || acc === p.stash.account)) {
                            if (token) {
                                replay[i].send();
                            } else {
                                replay[i].abort();
                            }
                            replay[i]= null;
                        }
                    });
                });
            }
            return {
                stopImmediatePropagation:true
            };
        },{ prepend:true });

        // route XHR errors (404 etc) to Toast
        var httpCodeTextMap = {
            100 : _tr("Continue"),
            101 : _tr("Switching Protocols"),
            102 : _tr("Processing"),
            200 : _tr("OK"),
            201 : _tr("Created"),
            202 : _tr("Accepted"),
            203 : _tr("Non-Authoritative Information"),
            204 : _tr("No Content"),
            205 : _tr("Reset Content"),
            206 : _tr("Partial Content"),
            207 : _tr("Multi-Status"),
            300 : _tr("Multiple Choices"),
            301 : _tr("Moved Permanently"),
            302 : _tr("Found"),
            303 : _tr("See Other"),
            304 : _tr("Not Modified"),
            305 : _tr("Use Proxy"),
            306 : _tr("Switch Proxy"),
            307 : _tr("Temporary Redirect"),
            400 : _tr("Bad Request"),
            401 : _tr("Unauthorized"),
            402 : _tr("Payment Required"),
            403 : _tr("Forbidden"),
            404 : _tr("Not Found"),
            405 : _tr("Method Not Allowed"),
            406 : _tr("Not Acceptable"),
            407 : _tr("Proxy Authentication Required"),
            408 : _tr("Request Timeout"),
            409 : _tr("Conflict"),
            410 : _tr("Gone"),
            411 : _tr("Length Required"),
            412 : _tr("Precondition Failed"),
            413 : _tr("Request Entity Too Large"),
            414 : _tr("Request-URI Too Long"),
            415 : _tr("Unsupported Media Type"),
            416 : _tr("Requested Range Not Satisfiable"),
            417 : _tr("Expectation Failed"),
            422 : _tr("Unprocessable Entity"),
            423 : _tr("Locked"),
            424 : _tr("Failed Dependency"),
            425 : _tr("Unordered Collection"),
            426 : _tr("Upgrade Required"),
            449 : _tr("Retry With"),
            450 : _tr("Blocked by Windows Parental Controls"),
            500 : _tr("Internal Server Error"),
            501 : _tr("Not Implemented"),
            502 : _tr("Bad Gateway"),
            503 : _tr("Service Unavailable"),
            504 : _tr("Gateway Timeout"),
            505 : _tr("HTTP Version Not Supported"),
            506 : _tr("Variant Also Negotiates"),
            507 : _tr("Insufficient Storage"),
            509 : _tr("Bandwidth Limit Exceeded"),
            510 : _tr("Not Extended")
        };

        rootEmitter.on('instance.xhr.error', function (o) {
            var x = o.x,
                xhr = x.xhr;
            if (x.expectedContentType) {
                var c = xhr.getResponseHeader("Content-Type");
                if (c && c.indexOf('/'+x.expectedContentType) === -1) {
                    new Toast({
                        message:_tr("Invalid Response")
                    });
                    return;
                }
            }
            new Toast({
                message:x.connectionFailure? _tr("Connection Failure") : httpCodeTextMap[xhr.status] || _tr("Unrecogonized Response")
            });
        });

        // setup page with core routes
        rootEmitter.on('state.init', function() {
            // load initial routes
            return router.root.addRoutes(
                ['header','location','main','footer'].map(function(name) {
                    return { name:name };
                })
            ).then(function(m) {
                m.forEach(function(v) {
                    if (v.autoShow)
                        v.show();
                });
                router.current = router.base = m[2];
                // write page title & meta for current route and on route change (SEO)
                var eF = function(element,n,model) {
                    var c = model.stash[n];
                    if (! c)
                        return dom.rm(element);
                    dom.setContent(element,c);
                    dom.head.appendChild(element);
                };
                // title
                var title = dom.head.getElementsByTagName('title')[0],
                    set = function(model) {
                        return eF(title,'title',model);
                    };
                set(router.current);
                router.managers.event.on('to-in-progress', function(model) {
                    return set(model);
                });
                // meta tags
                ['description','keywords'].forEach(function(n) {
                    dom.mk('meta',null,null,function() {
                        this.name = n;
                        eF(this,n,router.current);
                        var self = this;
                        router.managers.event.on('to-in-progress', function(model) {
                            return eF(self,n,model);
                        });
                    });
                });
                // handle error here
                return rootEmitter.dispatch('state.base').then(function() {
                    return rootEmitter.dispatch('state.ready');
                }).catch(function (e) {
                    // don't return the handle - doing so will prevent the parent model from displaying and will show the generic load error.
                    if (e !== 0) // connection issues are handled by a pageMessage
                        debug.handle(e);
                });
            }).then(function() {
                return { removeEventListener:true };
            });
        });

      });

  });

};
