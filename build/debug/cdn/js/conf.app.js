(function() {

'use strict';

module.requires = [
    { name: 'core.router.js' },
    { name: 'core.language.js' },
    { name: 'core.currency.js'},
    { name: 'core.country.js' },
    { name: 'instance.toast.js' },
    { name: 'instance.modaldialog.js' }
];

// block old browsers
var ua = navigator.userAgent.toLowerCase();
if (
    (ua.indexOf('msie') !== -1 && parseFloat(ua.split('msie')[1]) < 10) ||
    (ua.indexOf('android') !== -1 && parseFloat(ua.match(/android\s([0-9\.]*)/)[1]) < 4)
) throw { incompatible:true };

module.exports = function(app, params) {

    var events = app['core.events'],
        Amd = app['instance.amd'],
        router = app['core.router'],
        debug = app['core.debug'],
        language = app['core.language'],
        currency = app['core.currency'],
        country = app['core.country'],
        ModalDialog = app['instance.modaldialog'],
        Toast = app['instance.toast'];

    var routerEventMgr = router.eventMgr;

    return Promise.all([

      // add supported languages - IETF
      language.setPool({
        en : "English",
        fr : "Français",
        de : "Deutsch",
        id : "Bahasa Indonesia",
        "zh-CN" : "简体中文",
        ar : "Arabic",
        pl : "Polish",
        ru : "Русский",
        pt : "Português",
        es : "Español"
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
          "name": {"en":"Andorra"}
        },
        "AE": {
          "callingCode": [
            "971"
          ],
          "currency": [
            "AED"
          ],
          "name": {"en":"United Arab Emirates"},
        },
        "AF": {
          "callingCode": [
            "93"
          ],
          "currency": [
            "AFN"
          ],
          "name": {"en":"Afghanistan"}
        },
        "AG": {
          "callingCode": [
            "1268"
          ],
          "currency": [
            "XCD"
          ],
          "name": {"en":"Antigua and Barbuda"}
        },
        "AI": {
          "callingCode": [
            "1264"
          ],
          "currency": [
            "XCD"
          ],
          "name": {"en":"Anguilla"},
        },
        "AL": {
          "callingCode": [
            "355"
          ],
          "currency": [
            "ALL"
          ],
          "name": {"en":"Albania"}
        },
        "AM": {
          "callingCode": [
            "374"
          ],
          "currency": [
            "AMD"
          ],
          "name": {"en":"Armenia"}
        },
        "AO": {
          "callingCode": [
            "244"
          ],
          "currency": [
            "AOA"
          ],
          "name": {"en":"Angola"}
        },
        "AQ": {
          "name": {"en":"Antarctica"}
        },
        "AR": {
          "callingCode": [
            "54"
          ],
          "currency": [
            "ARS"
          ],
          "name": {"en":"Argentina"},
        },
        "AS": {
          "callingCode": [
            "1684"
          ],
          "currency": [
            "USD"
          ],
          "name": {"en":"American Samoa"}
        },
        "AT": {
          "callingCode": [
            "43"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Austria"}
        },
        "AU": {
          "callingCode": [
            "61"
          ],
          "currency": [
            "AUD"
          ],
          "name": {"en":"Australia"}
        },
        "AW": {
          "callingCode": [
            "297"
          ],
          "currency": [
            "AWG"
          ],
          "name": {"en":"Aruba"}
        },
        "AX": {
          "callingCode": [
            "358"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Åland Islands"}
        },
        "AZ": {
          "callingCode": [
            "994"
          ],
          "currency": [
            "AZN"
          ],
          "name": {"en":"Azerbaijan"}
        },
        "BA": {
          "callingCode": [
            "387"
          ],
          "currency": [
            "BAM"
          ],
          "name": {"en":"Bosnia and Herzegovina"}
        },
        "BB": {
          "callingCode": [
            "1246"
          ],
          "currency": [
            "BBD"
          ],
          "name": {"en":"Barbados"}
        },
        "BD": {
          "callingCode": [
            "880"
          ],
          "currency": [
            "BDT"
          ],
          "name": {"en":"Bangladesh"}
        },
        "BE": {
          "callingCode": [
            "32"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Belgium"}
        },
        "BF": {
          "callingCode": [
            "226"
          ],
          "currency": [
            "XOF"
          ],
          "name": {"en":"Burkina Faso"}
        },
        "BG": {
          "callingCode": [
            "359"
          ],
          "currency": [
            "BGN"
          ],
          "name": {"en":"Bulgaria"}
        },
        "BH": {
          "callingCode": [
            "973"
          ],
          "currency": [
            "BHD"
          ],
          "name": {"en":"Bahrain"}
        },
        "BI": {
          "callingCode": [
            "257"
          ],
          "currency": [
            "BIF"
          ],
          "name": {"en":"Burundi"}
        },
        "BJ": {
          "callingCode": [
            "229"
          ],
          "currency": [
            "XOF"
          ],
          "name": {"en":"Benin"}
        },
        "BL": {
          "callingCode": [
            "590"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Saint Barthélemy"}
        },
        "BM": {
          "callingCode": [
            "1441"
          ],
          "currency": [
            "BMD"
          ],
          "name": {"en":"Bermuda"}
        },
        "BN": {
          "callingCode": [
            "673"
          ],
          "currency": [
            "BND"
          ],
          "name": {"en":"Brunei"}
        },
        "BO": {
          "callingCode": [
            "591"
          ],
          "currency": [
            "BOB",
            "BOV"
          ],
          "name": {"en":"Bolivia"}
        },
        "BQ": {
          "callingCode": [
            "5997"
          ],
          "currency": [
            "USD"
          ],
          "name": {"en":"Bonaire"}
        },
        "BR": {
          "callingCode": [
            "55"
          ],
          "currency": [
            "BRL"
          ],
          "name": {"en":"Brazil"}
        },
        "BS": {
          "callingCode": [
            "1242"
          ],
          "currency": [
            "BSD"
          ],
          "name": {"en":"Bahamas"},
        },
        "BT": {
          "callingCode": [
            "975"
          ],
          "currency": [
            "BTN",
            "INR"
          ],
          "name": {"en":"Bhutan"}
        },
        "BV": {
          "currency": [
            "NOK"
          ],
          "name": {"en":"Bouvet Island"}
        },
        "BW": {
          "callingCode": [
            "267"
          ],
          "currency": [
            "BWP"
          ],
          "name": {"en":"Botswana"}
        },
        "BY": {
          "callingCode": [
            "375"
          ],
          "currency": [
            "BYR"
          ],
          "name": {"en":"Belarus"}
        },
        "BZ": {
          "callingCode": [
            "501"
          ],
          "currency": [
            "BZD"
          ],
          "name": {"en":"Belize"}
        },
        "CA": {
          "callingCode": [
            "1"
          ],
          "currency": [
            "CAD"
          ],
          "name": {"en":"Canada"}
        },
        "CC": {
          "callingCode": [
            "61"
          ],
          "currency": [
            "AUD"
          ],
          "name": {"en":"Cocos (Keeling) Islands"}
        },
        "CD": {
          "callingCode": [
            "243"
          ],
          "currency": [
            "CDF"
          ],
          "name": {"en":"DR Congo"}
        },
        "CF": {
          "callingCode": [
            "236"
          ],
          "currency": [
            "XAF"
          ],
          "name": {"en":"Central African Republic"}
        },
        "CG": {
          "callingCode": [
            "242"
          ],
          "currency": [
            "XAF"
          ],
          "name": {"en":"Republic of the Congo"}
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
          "name": {"en":"Switzerland"}
        },
        "CI": {
          "callingCode": [
            "225"
          ],
          "currency": [
            "XOF"
          ],
          "name": {"en":"Ivory Coast"}
        },
        "CK": {
          "callingCode": [
            "682"
          ],
          "currency": [
            "NZD"
          ],
          "name": {"en":"Cook Islands"}
        },
        "CL": {
          "callingCode": [
            "56"
          ],
          "currency": [
            "CLF",
            "CLP"
          ],
          "name": {"en":"Chile"}
        },
        "CM": {
          "callingCode": [
            "237"
          ],
          "currency": [
            "XAF"
          ],
          "name": {"en":"Cameroon"}
        },
        "CN": {
          "callingCode": [
            "86"
          ],
          "currency": [
            "CNY"
          ],
          "name": {"en":"China"}
        },
        "CO": {
          "callingCode": [
            "57"
          ],
          "currency": [
            "COP"
          ],
          "name": {"en":"Colombia"}
        },
        "CR": {
          "callingCode": [
            "506"
          ],
          "currency": [
            "CRC"
          ],
          "name": {"en":"Costa Rica"}
        },
        "CU": {
          "callingCode": [
            "53"
          ],
          "currency": [
            "CUC",
            "CUP"
          ],
          "name": {"en":"Cuba"}
        },
        "CV": {
          "callingCode": [
            "238"
          ],
          "currency": [
            "CVE"
          ],
          "name": {"en":"Cape Verde"}
        },
        "CW": {
          "callingCode": [
            "5999"
          ],
          "currency": [
            "ANG"
          ],
          "name": {"en":"Curaçao"}
        },
        "CX": {
          "callingCode": [
            "61"
          ],
          "currency": [
            "AUD"
          ],
          "name": {"en":"Christmas Island"}
        },
        "CY": {
          "callingCode": [
            "357"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Cyprus"}
        },
        "CZ": {
          "callingCode": [
            "420"
          ],
          "currency": [
            "CZK"
          ],
          "name": {"en":"Czech Republic"}
        },
        "DE": {
          "callingCode": [
            "49"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Germany"}
        },
        "DJ": {
          "callingCode": [
            "253"
          ],
          "currency": [
            "DJF"
          ],
          "name": {"en":"Djibouti"}
        },
        "DK": {
          "callingCode": [
            "45"
          ],
          "currency": [
            "DKK"
          ],
          "name": {"en":"Denmark"}
        },
        "DM": {
          "callingCode": [
            "1767"
          ],
          "currency": [
            "XCD"
          ],
          "name": {"en":"Dominica"}
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
          "name": {"en":"Dominican Republic"}
        },
        "DZ": {
          "callingCode": [
            "213"
          ],
          "currency": [
            "DZD"
          ],
          "name": {"en":"Algeria"}
        },
        "EC": {
          "callingCode": [
            "593"
          ],
          "currency": [
            "USD"
          ],
          "name": {"en":"Ecuador"}
        },
        "EE": {
          "callingCode": [
            "372"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Estonia"}
        },
        "EG": {
          "callingCode": [
            "20"
          ],
          "currency": [
            "EGP"
          ],
          "name": {"en":"Egypt"}
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
          "name": {"en":"Western Sahara"}
        },
        "ER": {
          "callingCode": [
            "291"
          ],
          "currency": [
            "ERN"
          ],
          "name": {"en":"Eritrea"}
        },
        "ES": {
          "callingCode": [
            "34"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Spain"}
        },
        "ET": {
          "callingCode": [
            "251"
          ],
          "currency": [
            "ETB"
          ],
          "name": {"en":"Ethiopia"}
        },
        "FI": {
          "callingCode": [
            "358"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Finland"}
        },
        "FJ": {
          "callingCode": [
            "679"
          ],
          "currency": [
            "FJD"
          ],
          "name": {"en":"Fiji"}
        },
        "FK": {
          "callingCode": [
            "500"
          ],
          "currency": [
            "FKP"
          ],
          "name": {"en":"Falkland Islands"}
        },
        "FM": {
          "callingCode": [
            "691"
          ],
          "currency": [
            "USD"
          ],
          "name": {"en":"Micronesia"}
        },
        "FO": {
          "callingCode": [
            "298"
          ],
          "currency": [
            "DKK"
          ],
          "name": {"en":"Faroe Islands"}
        },
        "FR": {
          "callingCode": [
            "33"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"France"}
        },
        "GA": {
          "callingCode": [
            "241"
          ],
          "currency": [
            "XAF"
          ],
          "name": {"en":"Gabon"}
        },
        "GB": {
          "callingCode": [
            "44"
          ],
          "currency": [
            "GBP"
          ],
          "name": {"en":"United Kingdom"}
        },
        "GD": {
          "callingCode": [
            "1473"
          ],
          "currency": [
            "XCD"
          ],
          "name": {"en":"Grenada"}
        },
        "GE": {
          "callingCode": [
            "995"
          ],
          "currency": [
            "GEL"
          ],
          "name": {"en":"Georgia"}
        },
        "GF": {
          "callingCode": [
            "594"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"French Guiana"}
        },
        "GG": {
          "callingCode": [
            "44"
          ],
          "currency": [
            "GBP"
          ],
          "name": {"en":"Guernsey"}
        },
        "GH": {
          "callingCode": [
            "233"
          ],
          "currency": [
            "GHS"
          ],
          "name": {"en":"Ghana"}
        },
        "GI": {
          "callingCode": [
            "350"
          ],
          "currency": [
            "GIP"
          ],
          "name": {"en":"Gibraltar"}
        },
        "GL": {
          "callingCode": [
            "299"
          ],
          "currency": [
            "DKK"
          ],
          "name": {"en":"Greenland"}
        },
        "GM": {
          "callingCode": [
            "220"
          ],
          "currency": [
            "GMD"
          ],
          "name": {"en":"Gambia"}
        },
        "GN": {
          "callingCode": [
            "224"
          ],
          "currency": [
            "GNF"
          ],
          "name": {"en":"Guinea"}
        },
        "GP": {
          "callingCode": [
            "590"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Guadeloupe"}
        },
        "GQ": {
          "callingCode": [
            "240"
          ],
          "currency": [
            "XAF"
          ],
          "name": {"en":"Equatorial Guinea"}
        },
        "GR": {
          "callingCode": [
            "30"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Greece"}
        },
        "GS": {
          "callingCode": [
            "500"
          ],
          "currency": [
            "GBP"
          ],
          "name": {"en":"South Georgia"}
        },
        "GT": {
          "callingCode": [
            "502"
          ],
          "currency": [
            "GTQ"
          ],
          "name": {"en":"Guatemala"}
        },
        "GU": {
          "callingCode": [
            "1671"
          ],
          "currency": [
            "USD"
          ],
          "name": {"en":"Guam"}
        },
        "GW": {
          "callingCode": [
            "245"
          ],
          "currency": [
            "XOF"
          ],
          "name": {"en":"Guinea-Bissau"}
        },
        "GY": {
          "callingCode": [
            "592"
          ],
          "currency": [
            "GYD"
          ],
          "name": {"en":"Guyana"}
        },
        "HK": {
          "callingCode": [
            "852"
          ],
          "currency": [
            "HKD"
          ],
          "name": {"en":"Hong Kong"}
        },
        "HM": {
          "currency": [
            "AUD"
          ],
          "name": {"en":"Heard Island and McDonald Islands"}
        },
        "HN": {
          "callingCode": [
            "504"
          ],
          "currency": [
            "HNL"
          ],
          "name": {"en":"Honduras"}
        },
        "HR": {
          "callingCode": [
            "385"
          ],
          "currency": [
            "HRK"
          ],
          "name": {"en":"Croatia"}
        },
        "HT": {
          "callingCode": [
            "509"
          ],
          "currency": [
            "HTG",
            "USD"
          ],
          "name": {"en":"Haiti"}
        },
        "HU": {
          "callingCode": [
            "36"
          ],
          "currency": [
            "HUF"
          ],
          "name": {"en":"Hungary"}
        },
        "ID": {
          "callingCode": [
            "62"
          ],
          "currency": [
            "IDR"
          ],
          "name": {"en":"Indonesia"}
        },
        "IE": {
          "callingCode": [
            "353"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Ireland"}
        },
        "IL": {
          "callingCode": [
            "972"
          ],
          "currency": [
            "ILS"
          ],
          "name": {"en":"Israel"}
        },
        "IM": {
          "callingCode": [
            "44"
          ],
          "currency": [
            "GBP"
          ],
          "name": {"en":"Isle of Man"}
        },
        "IN": {
          "callingCode": [
            "91"
          ],
          "currency": [
            "INR"
          ],
          "name": {"en":"India"}
        },
        "IO": {
          "callingCode": [
            "246"
          ],
          "currency": [
            "USD"
          ],
          "name": {"en":"British Indian Ocean Territory"}
        },
        "IQ": {
          "callingCode": [
            "964"
          ],
          "currency": [
            "IQD"
          ],
          "name": {"en":"Iraq"}
        },
        "IR": {
          "callingCode": [
            "98"
          ],
          "currency": [
            "IRR"
          ],
          "name": {"en":"Iran"}
        },
        "IS": {
          "callingCode": [
            "354"
          ],
          "currency": [
            "ISK"
          ],
          "name": {"en":"Iceland"}
        },
        "IT": {
          "callingCode": [
            "39"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Italy"}
        },
        "JE": {
          "callingCode": [
            "44"
          ],
          "currency": [
            "GBP"
          ],
          "name": {"en":"Jersey"}
        },
        "JM": {
          "callingCode": [
            "1876"
          ],
          "currency": [
            "JMD"
          ],
          "name": {"en":"Jamaica"}
        },
        "JO": {
          "callingCode": [
            "962"
          ],
          "currency": [
            "JOD"
          ],
          "name": {"en":"Jordan"}
        },
        "JP": {
          "callingCode": [
            "81"
          ],
          "currency": [
            "JPY"
          ],
          "name": {"en":"Japan"}
        },
        "KE": {
          "callingCode": [
            "254"
          ],
          "currency": [
            "KES"
          ],
          "name": {"en":"Kenya"}
        },
        "KG": {
          "callingCode": [
            "996"
          ],
          "currency": [
            "KGS"
          ],
          "name": {"en":"Kyrgyzstan"}
        },
        "KH": {
          "callingCode": [
            "855"
          ],
          "currency": [
            "KHR"
          ],
          "name": {"en":"Cambodia"}
        },
        "KI": {
          "callingCode": [
            "686"
          ],
          "currency": [
            "AUD"
          ],
          "name": {"en":"Kiribati"}
        },
        "KM": {
          "callingCode": [
            "269"
          ],
          "currency": [
            "KMF"
          ],
          "name": {"en":"Comoros"}
        },
        "KN": {
          "callingCode": [
            "1869"
          ],
          "currency": [
            "XCD"
          ],
          "name": {"en":"Saint Kitts and Nevis"},
        },
        "KP": {
          "callingCode": [
            "850"
          ],
          "currency": [
            "KPW"
          ],
          "name": {"en":"North Korea"},
        },
        "KR": {
          "callingCode": [
            "82"
          ],
          "currency": [
            "KRW"
          ],
          "name": {"en":"South Korea"}
        },
        "KW": {
          "callingCode": [
            "965"
          ],
          "currency": [
            "KWD"
          ],
          "name": {"en":"Kuwait"}
        },
        "KY": {
          "callingCode": [
            "1345"
          ],
          "currency": [
            "KYD"
          ],
          "name": {"en":"Cayman Islands"}
        },
        "KZ": {
          "callingCode": [
            "76",
            "77"
          ],
          "currency": [
            "KZT"
          ],
          "name": {"en":"Kazakhstan"}
        },
        "LA": {
          "callingCode": [
            "856"
          ],
          "currency": [
            "LAK"
          ],
          "name": {"en":"Laos"}
        },
        "LB": {
          "callingCode": [
            "961"
          ],
          "currency": [
            "LBP"
          ],
          "name": {"en":"Lebanon"}
        },
        "LC": {
          "callingCode": [
            "1758"
          ],
          "currency": [
            "XCD"
          ],
          "name": {"en":"Saint Lucia"}
        },
        "LI": {
          "callingCode": [
            "423"
          ],
          "currency": [
            "CHF"
          ],
          "name": {"en":"Liechtenstein"}
        },
        "LK": {
          "callingCode": [
            "94"
          ],
          "currency": [
            "LKR"
          ],
          "name": {"en":"Sri Lanka"}
        },
        "LR": {
          "callingCode": [
            "231"
          ],
          "currency": [
            "LRD"
          ],
          "name": {"en":"Liberia"}
        },
        "LS": {
          "callingCode": [
            "266"
          ],
          "currency": [
            "LSL",
            "ZAR"
          ],
          "name": {"en":"Lesotho"}
        },
        "LT": {
          "callingCode": [
            "370"
          ],
          "currency": [
            "LTL"
          ],
          "name": {"en":"Lithuania"}
        },
        "LU": {
          "callingCode": [
            "352"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Luxembourg"}
        },
        "LV": {
          "callingCode": [
            "371"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Latvia"}
        },
        "LY": {
          "callingCode": [
            "218"
          ],
          "currency": [
            "LYD"
          ],
          "name": {"en":"Libya"}
        },
        "MA": {
          "callingCode": [
            "212"
          ],
          "currency": [
            "MAD"
          ],
          "name": {"en":"Morocco"}
        },
        "MC": {
          "callingCode": [
            "377"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Monaco"}
        },
        "MD": {
          "callingCode": [
            "373"
          ],
          "currency": [
            "MDL"
          ],
          "name": {"en":"Moldova"}
        },
        "ME": {
          "callingCode": [
            "382"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Montenegro"}
        },
        "MF": {
          "callingCode": [
            "590"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Saint Martin"}
        },
        "MG": {
          "callingCode": [
            "261"
          ],
          "currency": [
            "MGA"
          ],
          "name": {"en":"Madagascar"}
        },
        "MH": {
          "callingCode": [
            "692"
          ],
          "currency": [
            "USD"
          ],
          "name": {"en":"Marshall Islands"}
        },
        "MK": {
          "callingCode": [
            "389"
          ],
          "currency": [
            "MKD"
          ],
          "name": {"en":"Macedonia"}
        },
        "ML": {
          "callingCode": [
            "223"
          ],
          "currency": [
            "XOF"
          ],
          "name": {"en":"Mali"}
        },
        "MM": {
          "callingCode": [
            "95"
          ],
          "currency": [
            "MMK"
          ],
          "name": {"en":"Myanmar"}
        },
        "MN": {
          "callingCode": [
            "976"
          ],
          "currency": [
            "MNT"
          ],
          "name": {"en":"Mongolia"}
        },
        "MO": {
          "callingCode": [
            "853"
          ],
          "currency": [
            "MOP"
          ],
          "name": {"en":"Macau"}
        },
        "MP": {
          "callingCode": [
            "1670"
          ],
          "currency": [
            "USD"
          ],
          "name": {"en":"Northern Mariana Islands"}
        },
        "MQ": {
          "callingCode": [
            "596"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Martinique"}
        },
        "MR": {
          "callingCode": [
            "222"
          ],
          "currency": [
            "MRO"
          ],
          "name": {"en":"Mauritania"}
        },
        "MS": {
          "callingCode": [
            "1664"
          ],
          "currency": [
            "XCD"
          ],
          "name": {"en":"Montserrat"}
        },
        "MT": {
          "callingCode": [
            "356"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Malta"}
        },
        "MU": {
          "callingCode": [
            "230"
          ],
          "currency": [
            "MUR"
          ],
          "name": {"en":"Mauritius"}
        },
        "MV": {
          "callingCode": [
            "960"
          ],
          "currency": [
            "MVR"
          ],
          "name": {"en":"Maldives"}
        },
        "MW": {
          "callingCode": [
            "265"
          ],
          "currency": [
            "MWK"
          ],
          "name": {"en":"Malawi"}
        },
        "MX": {
          "callingCode": [
            "52"
          ],
          "currency": [
            "MXN"
          ],
          "name": {"en":"Mexico"}
        },
        "MY": {
          "callingCode": [
            "60"
          ],
          "currency": [
            "MYR"
          ],
          "name": {"en":"Malaysia"}
        },
        "MZ": {
          "callingCode": [
            "258"
          ],
          "currency": [
            "MZN"
          ],
          "name": {"en":"Mozambique"}
        },
        "NA": {
          "callingCode": [
            "264"
          ],
          "currency": [
            "NAD",
            "ZAR"
          ],
          "name": {"en":"Namibia"}
        },
        "NC": {
          "callingCode": [
            "687"
          ],
          "currency": [
            "XPF"
          ],
          "name": {"en":"New Caledonia"}
        },
        "NE": {
          "callingCode": [
            "227"
          ],
          "currency": [
            "XOF"
          ],
          "name": {"en":"Niger"}
        },
        "NF": {
          "callingCode": [
            "672"
          ],
          "currency": [
            "AUD"
          ],
          "name": {"en":"Norfolk Island"}
        },
        "NG": {
          "callingCode": [
            "234"
          ],
          "currency": [
            "NGN"
          ],
          "name": {"en":"Nigeria"}
        },
        "NI": {
          "callingCode": [
            "505"
          ],
          "currency": [
            "NIO"
          ],
          "name": {"en":"Nicaragua"}
        },
        "NL": {
          "callingCode": [
            "31"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Netherlands"}
        },
        "NO": {
          "callingCode": [
            "47"
          ],
          "currency": [
            "NOK"
          ],
          "name": {"en":"Norway"}
        },
        "NP": {
          "callingCode": [
            "977"
          ],
          "currency": [
            "NPR"
          ],
          "name": {"en":"Nepal"}
        },
        "NR": {
          "callingCode": [
            "674"
          ],
          "currency": [
            "AUD"
          ],
          "name": {"en":"Nauru"}
        },
        "NU": {
          "callingCode": [
            "683"
          ],
          "currency": [
            "NZD"
          ],
          "name": {"en":"Niue"}
        },
        "NZ": {
          "callingCode": [
            "64"
          ],
          "currency": [
            "NZD"
          ],
          "name": {"en":"New Zealand"}
        },
        "OM": {
          "callingCode": [
            "968"
          ],
          "currency": [
            "OMR"
          ],
          "name": {"en":"Oman"}
        },
        "PA": {
          "callingCode": [
            "507"
          ],
          "currency": [
            "PAB",
            "USD"
          ],
          "name": {"en":"Panama"}
        },
        "PE": {
          "callingCode": [
            "51"
          ],
          "currency": [
            "PEN"
          ],
          "name": {"en":"Peru"}
        },
        "PF": {
          "callingCode": [
            "689"
          ],
          "currency": [
            "XPF"
          ],
          "name": {"en":"French Polynesia"}
        },
        "PG": {
          "callingCode": [
            "675"
          ],
          "currency": [
            "PGK"
          ],
          "name": {"en":"Papua New Guinea"}
        },
        "PH": {
          "callingCode": [
            "63"
          ],
          "currency": [
            "PHP"
          ],
          "name": {"en":"Philippines"}
        },
        "PK": {
          "callingCode": [
            "92"
          ],
          "currency": [
            "PKR"
          ],
          "name": {"en":"Pakistan"}
        },
        "PL": {
          "callingCode": [
            "48"
          ],
          "currency": [
            "PLN"
          ],
          "name": {"en":"Poland"}
        },
        "PM": {
          "callingCode": [
            "508"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Saint Pierre and Miquelon"}
        },
        "PN": {
          "callingCode": [
            "64"
          ],
          "currency": [
            "NZD"
          ],
          "name": {"en":"Pitcairn Islands"}
        },
        "PR": {
          "callingCode": [
            "1787",
            "1939"
          ],
          "currency": [
            "USD"
          ],
          "name": {"en":"Puerto Rico"}
        },
        "PS": {
          "callingCode": [
            "970"
          ],
          "currency": [
            "ILS"
          ],
          "name": {"en":"Palestine"}
        },
        "PT": {
          "callingCode": [
            "351"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Portugal"}
        },
        "PW": {
          "callingCode": [
            "680"
          ],
          "currency": [
            "USD"
          ],
          "name": {"en":"Palau"}
        },
        "PY": {
          "callingCode": [
            "595"
          ],
          "currency": [
            "PYG"
          ],
          "name": {"en":"Paraguay"}
        },
        "QA": {
          "callingCode": [
            "974"
          ],
          "currency": [
            "QAR"
          ],
          "name": {"en":"Qatar"}
        },
        "RE": {
          "callingCode": [
            "262"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Réunion"}
        },
        "RO": {
          "callingCode": [
            "40"
          ],
          "currency": [
            "RON"
          ],
          "name": {"en":"Romania"}
        },
        "RS": {
          "callingCode": [
            "381"
          ],
          "currency": [
            "RSD"
          ],
          "name": {"en":"Serbia"}
        },
        "RU": {
          "callingCode": [
            "7"
          ],
          "currency": [
            "RUB"
          ],
          "name": {"en":"Russia"}
        },
        "RW": {
          "callingCode": [
            "250"
          ],
          "currency": [
            "RWF"
          ],
          "name": {"en":"Rwanda"}
        },
        "SA": {
          "callingCode": [
            "966"
          ],
          "currency": [
            "SAR"
          ],
          "name": {"en":"Saudi Arabia"}
        },
        "SB": {
          "callingCode": [
            "677"
          ],
          "currency": [
            "SDB"
          ],
          "name": {"en":"Solomon Islands"}
        },
        "SC": {
          "callingCode": [
            "248"
          ],
          "currency": [
            "SCR"
          ],
          "name": {"en":"Seychelles"}
        },
        "SD": {
          "callingCode": [
            "249"
          ],
          "currency": [
            "SDG"
          ],
          "name": {"en":"Sudan"}
        },
        "SE": {
          "callingCode": [
            "46"
          ],
          "currency": [
            "SEK"
          ],
          "name": {"en":"Sweden"}
        },
        "SG": {
          "callingCode": [
            "65"
          ],
          "currency": [
            "SGD"
          ],
          "name": {"en":"Singapore"}
        },
        "SH": {
          "callingCode": [
            "290"
          ],
          "currency": [
            "SHP"
          ],
          "name": {"en":"Saint Helena, Ascension and Tristan da Cunha"}
        },
        "SI": {
          "callingCode": [
            "386"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Slovenia"}
        },
        "SJ": {
          "callingCode": [
            "4779"
          ],
          "currency": [
            "NOK"
          ],
          "name": {"en":"Svalbard and Jan Mayen"}
        },
        "SK": {
          "callingCode": [
            "421"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Slovakia"}
        },
        "SL": {
          "callingCode": [
            "232"
          ],
          "currency": [
            "SLL"
          ],
          "name": {"en":"Sierra Leone"}
        },
        "SM": {
          "callingCode": [
            "378"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"San Marino"}
        },
        "SN": {
          "callingCode": [
            "221"
          ],
          "currency": [
            "XOF"
          ],
          "name": {"en":"Senegal"}
        },
        "SO": {
          "callingCode": [
            "252"
          ],
          "currency": [
            "SOS"
          ],
          "name": {"en":"Somalia"}
        },
        "SR": {
          "callingCode": [
            "597"
          ],
          "currency": [
            "SRD"
          ],
          "name": {"en":"Suriname"}
        },
        "SS": {
          "callingCode": [
            "211"
          ],
          "currency": [
            "SSP"
          ],
          "name": {"en":"South Sudan"}
        },
        "ST": {
          "callingCode": [
            "239"
          ],
          "currency": [
            "STD"
          ],
          "name": {"en":"São Tomé and Príncipe"}
        },
        "SV": {
          "callingCode": [
            "503"
          ],
          "currency": [
            "SVC",
            "USD"
          ],
          "name": {"en":"El Salvador"}
        },
        "SX": {
          "callingCode": [
            "1721"
          ],
          "currency": [
            "ANG"
          ],
          "name": {"en":"Sint Maarten"}
        },
        "SY": {
          "callingCode": [
            "963"
          ],
          "currency": [
            "SYP"
          ],
          "name": {"en":"Syria"}
        },
        "SZ": {
          "callingCode": [
            "268"
          ],
          "currency": [
            "SZL"
          ],
          "name": {"en":"Swaziland"}
        },
        "TC": {
          "callingCode": [
            "1649"
          ],
          "currency": [
            "USD"
          ],
          "name": {"en":"Turks and Caicos Islands"}
        },
        "TD": {
          "callingCode": [
            "235"
          ],
          "currency": [
            "XAF"
          ],
          "name": {"en":"Chad"}
        },
        "TF": {
          "currency": [
            "EUR"
          ],
          "name": {"en":"French Southern and Antarctic Lands"}
        },
        "TG": {
          "callingCode": [
            "228"
          ],
          "currency": [
            "XOF"
          ],
          "name": {"en":"Togo"}
        },
        "TH": {
          "callingCode": [
            "66"
          ],
          "currency": [
            "THB"
          ],
          "name": {"en":"Thailand"}
        },
        "TJ": {
          "callingCode": [
            "992"
          ],
          "currency": [
            "TJS"
          ],
          "name": {"en":"Tajikistan"}
        },
        "TK": {
          "callingCode": [
            "690"
          ],
          "currency": [
            "NZD"
          ],
          "name": {"en":"Tokelau"}
        },
        "TL": {
          "callingCode": [
            "670"
          ],
          "currency": [
            "USD"
          ],
          "name": {"en":"Timor-Leste"}
        },
        "TM": {
          "callingCode": [
            "993"
          ],
          "currency": [
            "TMT"
          ],
          "name": {"en":"Turkmenistan"}
        },
        "TN": {
          "callingCode": [
            "216"
          ],
          "currency": [
            "TND"
          ],
          "name": {"en":"Tunisia"}
        },
        "TO": {
          "callingCode": [
            "676"
          ],
          "currency": [
            "TOP"
          ],
          "name": {"en":"Tonga"}
        },
        "TR": {
          "callingCode": [
            "90"
          ],
          "currency": [
            "TRY"
          ],
          "name": {"en":"Turkey"}
        },
        "TT": {
          "callingCode": [
            "1868"
          ],
          "currency": [
            "TTD"
          ],
          "name": {"en":"Trinidad and Tobago"}
        },
        "TV": {
          "callingCode": [
            "688"
          ],
          "currency": [
            "AUD"
          ],
          "name": {"en":"Tuvalu"}
        },
        "TW": {
          "callingCode": [
            "886"
          ],
          "currency": [
            "TWD"
          ],
          "name": {"en":"Taiwan"}
        },
        "TZ": {
          "callingCode": [
            "255"
          ],
          "currency": [
            "TZS"
          ],
          "name": {"en":"Tanzania"}
        },
        "UA": {
          "callingCode": [
            "380"
          ],
          "currency": [
            "UAH"
          ],
          "name": {"en":"Ukraine"}
        },
        "UG": {
          "callingCode": [
            "256"
          ],
          "currency": [
            "UGX"
          ],
          "name": {"en":"Uganda"}
        },
        "UM": {
          "currency": [
            "USD"
          ],
          "name": {"en":"United States Minor Outlying Islands"}
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
          "name": {"en":"United States"}
        },
        "UY": {
          "callingCode": [
            "598"
          ],
          "currency": [
            "UYI",
            "UYU"
          ],
          "name": {"en":"Uruguay"}
        },
        "UZ": {
          "callingCode": [
            "998"
          ],
          "currency": [
            "UZS"
          ],
          "name": {"en":"Uzbekistan"}
        },
        "VA": {
          "callingCode": [
            "3906698",
            "379"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Vatican City"}
        },
        "VC": {
          "callingCode": [
            "1784"
          ],
          "currency": [
            "XCD"
          ],
          "name": {"en":"Saint Vincent and the Grenadines"}
        },
        "VE": {
          "callingCode": [
            "58"
          ],
          "currency": [
            "VEF"
          ],
          "name": {"en":"Venezuela"}
        },
        "VG": {
          "callingCode": [
            "1284"
          ],
          "currency": [
            "USD"
          ],
          "name": {"en":"British Virgin Islands"}
        },
        "VI": {
          "callingCode": [
            "1340"
          ],
          "currency": [
            "USD"
          ],
          "name": {"en":"United States Virgin Islands"}
        },
        "VN": {
          "callingCode": [
            "84"
          ],
          "currency": [
            "VND"
          ],
          "name": {"en":"Vietnam"}
        },
        "VU": {
          "callingCode": [
            "678"
          ],
          "currency": [
            "VUV"
          ],
          "name": {"en":"Vanuatu"}
        },
        "WF": {
          "callingCode": [
            "681"
          ],
          "currency": [
            "XPF"
          ],
          "name": {"en":"Wallis and Futuna"}
        },
        "WS": {
          "callingCode": [
            "685"
          ],
          "currency": [
            "WST"
          ],
          "name": {"en":"Samoa"}
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
          "name": {"en":"Kosovo"}
        },
        "YE": {
          "callingCode": [
            "967"
          ],
          "currency": [
            "YER"
          ],
          "name": {"en":"Yemen"}
        },
        "YT": {
          "callingCode": [
            "262"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"en":"Mayotte"}
        },
        "ZA": {
          "callingCode": [
            "27"
          ],
          "currency": [
            "ZAR"
          ],
          "name": {"en":"South Africa"}
        },
        "ZM": {
          "callingCode": [
            "260"
          ],
          "currency": [
            "ZMK"
          ],
          "name": {"en":"Zambia"}
        },
        "ZW": {
          "callingCode": [
            "263"
          ],
          "currency": [
            "ZWL"
          ],
          "name": {"en":"Zimbabwe"}
        }
      })

    ]).then(function () {

      // add supported currencies - ISO 4217
      return currency.setPool({
          USD : {
              symbol : '$',
              name : {"en":"United States Dollar"}
          },
          GBP : {
              symbol : '£',
              name : {"en":"British Sterling"}
          },
          AUD : {
              symbol : '$',
              name : {"en":"Australian Dollar"},
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
              name : {"en":"Euro"}
          }
      }).then(function() {

        // use native alert box if available
        if (navigator.notification && navigator.notification.alert)
            window.alert = navigator.notification.alert;

        // adds route.* files as a route provider
        router.addProvider({
            handles:function(path) { 
                return true; 
            },
            url : params.repo,
            fetch:function(o) {
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
        events.on('core.debug','handle', function (o) {
            if (displaying || (typeof o === 'object' && o.value && o.value.error === 0))
                return;
            displaying = true;
            var msg = params.appconf.loaderr;
            try {
                new ModalDialog().alert({
                    message: msg
                }).then(function() {
                    displaying = false;
                });
            } catch (e) {
                alert(msg['en-US']);
                displaying = false;
            } 
            return debug.log.append(o.value,o.name,o.event);
        });

        // handle router errors
        router.managers.event.on('to-error', function (o) {
            var v = o.value;
            if (typeof v === 'object' && v.value)
              v = v.value;
            if (! v) 
              return;
            //invalid route
            if (v.error === 404)
                return new ModalDialog().alert({
                    message: {"en":"The page you requested does not exist."}
                });
            // invalid url
            if (v.uri)
                return new ModalDialog().alert({
                    message: language.substitute({"en":"A problem with the URL was detected and loading aborted prematurely.\\n\\nError: %d"},o.uri)
                });
            return router.managers.debug.handle(o);
        });

        // capture 401 xhr errors (unauthorized) and begin oauth if for account
        var replay = [];

        events.on('instance.xhr','response', function(p) {
            var o = p.x;
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
        events.on('instance.xhr','error', function (o) {
            var xhr = o.x.xhr,
                c = xhr.getResponseHeader("Content-Type");
            if (self.expectedContentType && c && c.indexOf('/'+o.expectedContentType) === -1) {
                new Toast({
                    message:{"en":"Invalid Response"}
                });
                return;
            }
            new Toast({
                message:xhr.status === 0 && xhr.responseText.length === 0? {"en":"Connection Refused"} : xhr.statusText
            });
        });

        events.on('','state.init', function() {      
            events.remove(this);
            // load initial routes
            return router.root.addChildren({ 
                list:['header','location','main','footer'] 
            }).then(function(m) {
                m.forEach(function(v) {
                    if (v.autoShow) 
                        v.show(); 
                });
                router.current = router.base = m[2];
                // handle error here
                return events.dispatch('','state.base').then(function() {
                  
                  return events.dispatch('','state.root');
                }).catch(function (e) {
                  if (e !== 0) // connection issues are handled by a pageMessage
                    return debug.handle(e);
                });
                
            });
        });

      });

  });

};

})();
