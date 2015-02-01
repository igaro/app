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
          "name": {"fr":"","en":"Andorra"}
        },
        "AE": {
          "callingCode": [
            "971"
          ],
          "currency": [
            "AED"
          ],
          "name": {"fr":"","en":"United Arab Emirates"},
        },
        "AF": {
          "callingCode": [
            "93"
          ],
          "currency": [
            "AFN"
          ],
          "name": {"fr":"","en":"Afghanistan"}
        },
        "AG": {
          "callingCode": [
            "1268"
          ],
          "currency": [
            "XCD"
          ],
          "name": {"fr":"","en":"Antigua and Barbuda"}
        },
        "AI": {
          "callingCode": [
            "1264"
          ],
          "currency": [
            "XCD"
          ],
          "name": {"fr":"","en":"Anguilla"},
        },
        "AL": {
          "callingCode": [
            "355"
          ],
          "currency": [
            "ALL"
          ],
          "name": {"fr":"","en":"Albania"}
        },
        "AM": {
          "callingCode": [
            "374"
          ],
          "currency": [
            "AMD"
          ],
          "name": {"fr":"","en":"Armenia"}
        },
        "AO": {
          "callingCode": [
            "244"
          ],
          "currency": [
            "AOA"
          ],
          "name": {"fr":"","en":"Angola"}
        },
        "AQ": {
          "name": {"fr":"","en":"Antarctica"}
        },
        "AR": {
          "callingCode": [
            "54"
          ],
          "currency": [
            "ARS"
          ],
          "name": {"fr":"","en":"Argentina"},
        },
        "AS": {
          "callingCode": [
            "1684"
          ],
          "currency": [
            "USD"
          ],
          "name": {"fr":"","en":"American Samoa"}
        },
        "AT": {
          "callingCode": [
            "43"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Austria"}
        },
        "AU": {
          "callingCode": [
            "61"
          ],
          "currency": [
            "AUD"
          ],
          "name": {"fr":"","en":"Australia"}
        },
        "AW": {
          "callingCode": [
            "297"
          ],
          "currency": [
            "AWG"
          ],
          "name": {"fr":"","en":"Aruba"}
        },
        "AX": {
          "callingCode": [
            "358"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Åland Islands"}
        },
        "AZ": {
          "callingCode": [
            "994"
          ],
          "currency": [
            "AZN"
          ],
          "name": {"fr":"","en":"Azerbaijan"}
        },
        "BA": {
          "callingCode": [
            "387"
          ],
          "currency": [
            "BAM"
          ],
          "name": {"fr":"","en":"Bosnia and Herzegovina"}
        },
        "BB": {
          "callingCode": [
            "1246"
          ],
          "currency": [
            "BBD"
          ],
          "name": {"fr":"","en":"Barbados"}
        },
        "BD": {
          "callingCode": [
            "880"
          ],
          "currency": [
            "BDT"
          ],
          "name": {"fr":"","en":"Bangladesh"}
        },
        "BE": {
          "callingCode": [
            "32"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Belgium"}
        },
        "BF": {
          "callingCode": [
            "226"
          ],
          "currency": [
            "XOF"
          ],
          "name": {"fr":"","en":"Burkina Faso"}
        },
        "BG": {
          "callingCode": [
            "359"
          ],
          "currency": [
            "BGN"
          ],
          "name": {"fr":"","en":"Bulgaria"}
        },
        "BH": {
          "callingCode": [
            "973"
          ],
          "currency": [
            "BHD"
          ],
          "name": {"fr":"","en":"Bahrain"}
        },
        "BI": {
          "callingCode": [
            "257"
          ],
          "currency": [
            "BIF"
          ],
          "name": {"fr":"","en":"Burundi"}
        },
        "BJ": {
          "callingCode": [
            "229"
          ],
          "currency": [
            "XOF"
          ],
          "name": {"fr":"","en":"Benin"}
        },
        "BL": {
          "callingCode": [
            "590"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Saint Barthélemy"}
        },
        "BM": {
          "callingCode": [
            "1441"
          ],
          "currency": [
            "BMD"
          ],
          "name": {"fr":"","en":"Bermuda"}
        },
        "BN": {
          "callingCode": [
            "673"
          ],
          "currency": [
            "BND"
          ],
          "name": {"fr":"","en":"Brunei"}
        },
        "BO": {
          "callingCode": [
            "591"
          ],
          "currency": [
            "BOB",
            "BOV"
          ],
          "name": {"fr":"","en":"Bolivia"}
        },
        "BQ": {
          "callingCode": [
            "5997"
          ],
          "currency": [
            "USD"
          ],
          "name": {"fr":"","en":"Bonaire"}
        },
        "BR": {
          "callingCode": [
            "55"
          ],
          "currency": [
            "BRL"
          ],
          "name": {"fr":"","en":"Brazil"}
        },
        "BS": {
          "callingCode": [
            "1242"
          ],
          "currency": [
            "BSD"
          ],
          "name": {"fr":"","en":"Bahamas"},
        },
        "BT": {
          "callingCode": [
            "975"
          ],
          "currency": [
            "BTN",
            "INR"
          ],
          "name": {"fr":"","en":"Bhutan"}
        },
        "BV": {
          "currency": [
            "NOK"
          ],
          "name": {"fr":"","en":"Bouvet Island"}
        },
        "BW": {
          "callingCode": [
            "267"
          ],
          "currency": [
            "BWP"
          ],
          "name": {"fr":"","en":"Botswana"}
        },
        "BY": {
          "callingCode": [
            "375"
          ],
          "currency": [
            "BYR"
          ],
          "name": {"fr":"","en":"Belarus"}
        },
        "BZ": {
          "callingCode": [
            "501"
          ],
          "currency": [
            "BZD"
          ],
          "name": {"fr":"","en":"Belize"}
        },
        "CA": {
          "callingCode": [
            "1"
          ],
          "currency": [
            "CAD"
          ],
          "name": {"fr":"","en":"Canada"}
        },
        "CC": {
          "callingCode": [
            "61"
          ],
          "currency": [
            "AUD"
          ],
          "name": {"fr":"","en":"Cocos (Keeling) Islands"}
        },
        "CD": {
          "callingCode": [
            "243"
          ],
          "currency": [
            "CDF"
          ],
          "name": {"fr":"","en":"DR Congo"}
        },
        "CF": {
          "callingCode": [
            "236"
          ],
          "currency": [
            "XAF"
          ],
          "name": {"fr":"","en":"Central African Republic"}
        },
        "CG": {
          "callingCode": [
            "242"
          ],
          "currency": [
            "XAF"
          ],
          "name": {"fr":"","en":"Republic of the Congo"}
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
          "name": {"fr":"","en":"Switzerland"}
        },
        "CI": {
          "callingCode": [
            "225"
          ],
          "currency": [
            "XOF"
          ],
          "name": {"fr":"","en":"Ivory Coast"}
        },
        "CK": {
          "callingCode": [
            "682"
          ],
          "currency": [
            "NZD"
          ],
          "name": {"fr":"","en":"Cook Islands"}
        },
        "CL": {
          "callingCode": [
            "56"
          ],
          "currency": [
            "CLF",
            "CLP"
          ],
          "name": {"fr":"","en":"Chile"}
        },
        "CM": {
          "callingCode": [
            "237"
          ],
          "currency": [
            "XAF"
          ],
          "name": {"fr":"","en":"Cameroon"}
        },
        "CN": {
          "callingCode": [
            "86"
          ],
          "currency": [
            "CNY"
          ],
          "name": {"fr":"","en":"China"}
        },
        "CO": {
          "callingCode": [
            "57"
          ],
          "currency": [
            "COP"
          ],
          "name": {"fr":"","en":"Colombia"}
        },
        "CR": {
          "callingCode": [
            "506"
          ],
          "currency": [
            "CRC"
          ],
          "name": {"fr":"","en":"Costa Rica"}
        },
        "CU": {
          "callingCode": [
            "53"
          ],
          "currency": [
            "CUC",
            "CUP"
          ],
          "name": {"fr":"","en":"Cuba"}
        },
        "CV": {
          "callingCode": [
            "238"
          ],
          "currency": [
            "CVE"
          ],
          "name": {"fr":"","en":"Cape Verde"}
        },
        "CW": {
          "callingCode": [
            "5999"
          ],
          "currency": [
            "ANG"
          ],
          "name": {"fr":"","en":"Curaçao"}
        },
        "CX": {
          "callingCode": [
            "61"
          ],
          "currency": [
            "AUD"
          ],
          "name": {"fr":"","en":"Christmas Island"}
        },
        "CY": {
          "callingCode": [
            "357"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Cyprus"}
        },
        "CZ": {
          "callingCode": [
            "420"
          ],
          "currency": [
            "CZK"
          ],
          "name": {"fr":"","en":"Czech Republic"}
        },
        "DE": {
          "callingCode": [
            "49"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Germany"}
        },
        "DJ": {
          "callingCode": [
            "253"
          ],
          "currency": [
            "DJF"
          ],
          "name": {"fr":"","en":"Djibouti"}
        },
        "DK": {
          "callingCode": [
            "45"
          ],
          "currency": [
            "DKK"
          ],
          "name": {"fr":"","en":"Denmark"}
        },
        "DM": {
          "callingCode": [
            "1767"
          ],
          "currency": [
            "XCD"
          ],
          "name": {"fr":"","en":"Dominica"}
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
          "name": {"fr":"","en":"Dominican Republic"}
        },
        "DZ": {
          "callingCode": [
            "213"
          ],
          "currency": [
            "DZD"
          ],
          "name": {"fr":"","en":"Algeria"}
        },
        "EC": {
          "callingCode": [
            "593"
          ],
          "currency": [
            "USD"
          ],
          "name": {"fr":"","en":"Ecuador"}
        },
        "EE": {
          "callingCode": [
            "372"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Estonia"}
        },
        "EG": {
          "callingCode": [
            "20"
          ],
          "currency": [
            "EGP"
          ],
          "name": {"fr":"","en":"Egypt"}
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
          "name": {"fr":"","en":"Western Sahara"}
        },
        "ER": {
          "callingCode": [
            "291"
          ],
          "currency": [
            "ERN"
          ],
          "name": {"fr":"","en":"Eritrea"}
        },
        "ES": {
          "callingCode": [
            "34"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Spain"}
        },
        "ET": {
          "callingCode": [
            "251"
          ],
          "currency": [
            "ETB"
          ],
          "name": {"fr":"","en":"Ethiopia"}
        },
        "FI": {
          "callingCode": [
            "358"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Finland"}
        },
        "FJ": {
          "callingCode": [
            "679"
          ],
          "currency": [
            "FJD"
          ],
          "name": {"fr":"","en":"Fiji"}
        },
        "FK": {
          "callingCode": [
            "500"
          ],
          "currency": [
            "FKP"
          ],
          "name": {"fr":"","en":"Falkland Islands"}
        },
        "FM": {
          "callingCode": [
            "691"
          ],
          "currency": [
            "USD"
          ],
          "name": {"fr":"","en":"Micronesia"}
        },
        "FO": {
          "callingCode": [
            "298"
          ],
          "currency": [
            "DKK"
          ],
          "name": {"fr":"","en":"Faroe Islands"}
        },
        "FR": {
          "callingCode": [
            "33"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"France"}
        },
        "GA": {
          "callingCode": [
            "241"
          ],
          "currency": [
            "XAF"
          ],
          "name": {"fr":"","en":"Gabon"}
        },
        "GB": {
          "callingCode": [
            "44"
          ],
          "currency": [
            "GBP"
          ],
          "name": {"fr":"","en":"United Kingdom"}
        },
        "GD": {
          "callingCode": [
            "1473"
          ],
          "currency": [
            "XCD"
          ],
          "name": {"fr":"","en":"Grenada"}
        },
        "GE": {
          "callingCode": [
            "995"
          ],
          "currency": [
            "GEL"
          ],
          "name": {"fr":"","en":"Georgia"}
        },
        "GF": {
          "callingCode": [
            "594"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"French Guiana"}
        },
        "GG": {
          "callingCode": [
            "44"
          ],
          "currency": [
            "GBP"
          ],
          "name": {"fr":"","en":"Guernsey"}
        },
        "GH": {
          "callingCode": [
            "233"
          ],
          "currency": [
            "GHS"
          ],
          "name": {"fr":"","en":"Ghana"}
        },
        "GI": {
          "callingCode": [
            "350"
          ],
          "currency": [
            "GIP"
          ],
          "name": {"fr":"","en":"Gibraltar"}
        },
        "GL": {
          "callingCode": [
            "299"
          ],
          "currency": [
            "DKK"
          ],
          "name": {"fr":"","en":"Greenland"}
        },
        "GM": {
          "callingCode": [
            "220"
          ],
          "currency": [
            "GMD"
          ],
          "name": {"fr":"","en":"Gambia"}
        },
        "GN": {
          "callingCode": [
            "224"
          ],
          "currency": [
            "GNF"
          ],
          "name": {"fr":"","en":"Guinea"}
        },
        "GP": {
          "callingCode": [
            "590"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Guadeloupe"}
        },
        "GQ": {
          "callingCode": [
            "240"
          ],
          "currency": [
            "XAF"
          ],
          "name": {"fr":"","en":"Equatorial Guinea"}
        },
        "GR": {
          "callingCode": [
            "30"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Greece"}
        },
        "GS": {
          "callingCode": [
            "500"
          ],
          "currency": [
            "GBP"
          ],
          "name": {"fr":"","en":"South Georgia"}
        },
        "GT": {
          "callingCode": [
            "502"
          ],
          "currency": [
            "GTQ"
          ],
          "name": {"fr":"","en":"Guatemala"}
        },
        "GU": {
          "callingCode": [
            "1671"
          ],
          "currency": [
            "USD"
          ],
          "name": {"fr":"","en":"Guam"}
        },
        "GW": {
          "callingCode": [
            "245"
          ],
          "currency": [
            "XOF"
          ],
          "name": {"fr":"","en":"Guinea-Bissau"}
        },
        "GY": {
          "callingCode": [
            "592"
          ],
          "currency": [
            "GYD"
          ],
          "name": {"fr":"","en":"Guyana"}
        },
        "HK": {
          "callingCode": [
            "852"
          ],
          "currency": [
            "HKD"
          ],
          "name": {"fr":"","en":"Hong Kong"}
        },
        "HM": {
          "currency": [
            "AUD"
          ],
          "name": {"fr":"","en":"Heard Island and McDonald Islands"}
        },
        "HN": {
          "callingCode": [
            "504"
          ],
          "currency": [
            "HNL"
          ],
          "name": {"fr":"","en":"Honduras"}
        },
        "HR": {
          "callingCode": [
            "385"
          ],
          "currency": [
            "HRK"
          ],
          "name": {"fr":"","en":"Croatia"}
        },
        "HT": {
          "callingCode": [
            "509"
          ],
          "currency": [
            "HTG",
            "USD"
          ],
          "name": {"fr":"","en":"Haiti"}
        },
        "HU": {
          "callingCode": [
            "36"
          ],
          "currency": [
            "HUF"
          ],
          "name": {"fr":"","en":"Hungary"}
        },
        "ID": {
          "callingCode": [
            "62"
          ],
          "currency": [
            "IDR"
          ],
          "name": {"fr":"","en":"Indonesia"}
        },
        "IE": {
          "callingCode": [
            "353"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Ireland"}
        },
        "IL": {
          "callingCode": [
            "972"
          ],
          "currency": [
            "ILS"
          ],
          "name": {"fr":"","en":"Israel"}
        },
        "IM": {
          "callingCode": [
            "44"
          ],
          "currency": [
            "GBP"
          ],
          "name": {"fr":"","en":"Isle of Man"}
        },
        "IN": {
          "callingCode": [
            "91"
          ],
          "currency": [
            "INR"
          ],
          "name": {"fr":"","en":"India"}
        },
        "IO": {
          "callingCode": [
            "246"
          ],
          "currency": [
            "USD"
          ],
          "name": {"fr":"","en":"British Indian Ocean Territory"}
        },
        "IQ": {
          "callingCode": [
            "964"
          ],
          "currency": [
            "IQD"
          ],
          "name": {"fr":"","en":"Iraq"}
        },
        "IR": {
          "callingCode": [
            "98"
          ],
          "currency": [
            "IRR"
          ],
          "name": {"fr":"","en":"Iran"}
        },
        "IS": {
          "callingCode": [
            "354"
          ],
          "currency": [
            "ISK"
          ],
          "name": {"fr":"","en":"Iceland"}
        },
        "IT": {
          "callingCode": [
            "39"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Italy"}
        },
        "JE": {
          "callingCode": [
            "44"
          ],
          "currency": [
            "GBP"
          ],
          "name": {"fr":"","en":"Jersey"}
        },
        "JM": {
          "callingCode": [
            "1876"
          ],
          "currency": [
            "JMD"
          ],
          "name": {"fr":"","en":"Jamaica"}
        },
        "JO": {
          "callingCode": [
            "962"
          ],
          "currency": [
            "JOD"
          ],
          "name": {"fr":"","en":"Jordan"}
        },
        "JP": {
          "callingCode": [
            "81"
          ],
          "currency": [
            "JPY"
          ],
          "name": {"fr":"","en":"Japan"}
        },
        "KE": {
          "callingCode": [
            "254"
          ],
          "currency": [
            "KES"
          ],
          "name": {"fr":"","en":"Kenya"}
        },
        "KG": {
          "callingCode": [
            "996"
          ],
          "currency": [
            "KGS"
          ],
          "name": {"fr":"","en":"Kyrgyzstan"}
        },
        "KH": {
          "callingCode": [
            "855"
          ],
          "currency": [
            "KHR"
          ],
          "name": {"fr":"","en":"Cambodia"}
        },
        "KI": {
          "callingCode": [
            "686"
          ],
          "currency": [
            "AUD"
          ],
          "name": {"fr":"","en":"Kiribati"}
        },
        "KM": {
          "callingCode": [
            "269"
          ],
          "currency": [
            "KMF"
          ],
          "name": {"fr":"","en":"Comoros"}
        },
        "KN": {
          "callingCode": [
            "1869"
          ],
          "currency": [
            "XCD"
          ],
          "name": {"fr":"","en":"Saint Kitts and Nevis"},
        },
        "KP": {
          "callingCode": [
            "850"
          ],
          "currency": [
            "KPW"
          ],
          "name": {"fr":"","en":"North Korea"},
        },
        "KR": {
          "callingCode": [
            "82"
          ],
          "currency": [
            "KRW"
          ],
          "name": {"fr":"","en":"South Korea"}
        },
        "KW": {
          "callingCode": [
            "965"
          ],
          "currency": [
            "KWD"
          ],
          "name": {"fr":"","en":"Kuwait"}
        },
        "KY": {
          "callingCode": [
            "1345"
          ],
          "currency": [
            "KYD"
          ],
          "name": {"fr":"","en":"Cayman Islands"}
        },
        "KZ": {
          "callingCode": [
            "76",
            "77"
          ],
          "currency": [
            "KZT"
          ],
          "name": {"fr":"","en":"Kazakhstan"}
        },
        "LA": {
          "callingCode": [
            "856"
          ],
          "currency": [
            "LAK"
          ],
          "name": {"fr":"","en":"Laos"}
        },
        "LB": {
          "callingCode": [
            "961"
          ],
          "currency": [
            "LBP"
          ],
          "name": {"fr":"","en":"Lebanon"}
        },
        "LC": {
          "callingCode": [
            "1758"
          ],
          "currency": [
            "XCD"
          ],
          "name": {"fr":"","en":"Saint Lucia"}
        },
        "LI": {
          "callingCode": [
            "423"
          ],
          "currency": [
            "CHF"
          ],
          "name": {"fr":"","en":"Liechtenstein"}
        },
        "LK": {
          "callingCode": [
            "94"
          ],
          "currency": [
            "LKR"
          ],
          "name": {"fr":"","en":"Sri Lanka"}
        },
        "LR": {
          "callingCode": [
            "231"
          ],
          "currency": [
            "LRD"
          ],
          "name": {"fr":"","en":"Liberia"}
        },
        "LS": {
          "callingCode": [
            "266"
          ],
          "currency": [
            "LSL",
            "ZAR"
          ],
          "name": {"fr":"","en":"Lesotho"}
        },
        "LT": {
          "callingCode": [
            "370"
          ],
          "currency": [
            "LTL"
          ],
          "name": {"fr":"","en":"Lithuania"}
        },
        "LU": {
          "callingCode": [
            "352"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Luxembourg"}
        },
        "LV": {
          "callingCode": [
            "371"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Latvia"}
        },
        "LY": {
          "callingCode": [
            "218"
          ],
          "currency": [
            "LYD"
          ],
          "name": {"fr":"","en":"Libya"}
        },
        "MA": {
          "callingCode": [
            "212"
          ],
          "currency": [
            "MAD"
          ],
          "name": {"fr":"","en":"Morocco"}
        },
        "MC": {
          "callingCode": [
            "377"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Monaco"}
        },
        "MD": {
          "callingCode": [
            "373"
          ],
          "currency": [
            "MDL"
          ],
          "name": {"fr":"","en":"Moldova"}
        },
        "ME": {
          "callingCode": [
            "382"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Montenegro"}
        },
        "MF": {
          "callingCode": [
            "590"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Saint Martin"}
        },
        "MG": {
          "callingCode": [
            "261"
          ],
          "currency": [
            "MGA"
          ],
          "name": {"fr":"","en":"Madagascar"}
        },
        "MH": {
          "callingCode": [
            "692"
          ],
          "currency": [
            "USD"
          ],
          "name": {"fr":"","en":"Marshall Islands"}
        },
        "MK": {
          "callingCode": [
            "389"
          ],
          "currency": [
            "MKD"
          ],
          "name": {"fr":"","en":"Macedonia"}
        },
        "ML": {
          "callingCode": [
            "223"
          ],
          "currency": [
            "XOF"
          ],
          "name": {"fr":"","en":"Mali"}
        },
        "MM": {
          "callingCode": [
            "95"
          ],
          "currency": [
            "MMK"
          ],
          "name": {"fr":"","en":"Myanmar"}
        },
        "MN": {
          "callingCode": [
            "976"
          ],
          "currency": [
            "MNT"
          ],
          "name": {"fr":"","en":"Mongolia"}
        },
        "MO": {
          "callingCode": [
            "853"
          ],
          "currency": [
            "MOP"
          ],
          "name": {"fr":"","en":"Macau"}
        },
        "MP": {
          "callingCode": [
            "1670"
          ],
          "currency": [
            "USD"
          ],
          "name": {"fr":"","en":"Northern Mariana Islands"}
        },
        "MQ": {
          "callingCode": [
            "596"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Martinique"}
        },
        "MR": {
          "callingCode": [
            "222"
          ],
          "currency": [
            "MRO"
          ],
          "name": {"fr":"","en":"Mauritania"}
        },
        "MS": {
          "callingCode": [
            "1664"
          ],
          "currency": [
            "XCD"
          ],
          "name": {"fr":"","en":"Montserrat"}
        },
        "MT": {
          "callingCode": [
            "356"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Malta"}
        },
        "MU": {
          "callingCode": [
            "230"
          ],
          "currency": [
            "MUR"
          ],
          "name": {"fr":"","en":"Mauritius"}
        },
        "MV": {
          "callingCode": [
            "960"
          ],
          "currency": [
            "MVR"
          ],
          "name": {"fr":"","en":"Maldives"}
        },
        "MW": {
          "callingCode": [
            "265"
          ],
          "currency": [
            "MWK"
          ],
          "name": {"fr":"","en":"Malawi"}
        },
        "MX": {
          "callingCode": [
            "52"
          ],
          "currency": [
            "MXN"
          ],
          "name": {"fr":"","en":"Mexico"}
        },
        "MY": {
          "callingCode": [
            "60"
          ],
          "currency": [
            "MYR"
          ],
          "name": {"fr":"","en":"Malaysia"}
        },
        "MZ": {
          "callingCode": [
            "258"
          ],
          "currency": [
            "MZN"
          ],
          "name": {"fr":"","en":"Mozambique"}
        },
        "NA": {
          "callingCode": [
            "264"
          ],
          "currency": [
            "NAD",
            "ZAR"
          ],
          "name": {"fr":"","en":"Namibia"}
        },
        "NC": {
          "callingCode": [
            "687"
          ],
          "currency": [
            "XPF"
          ],
          "name": {"fr":"","en":"New Caledonia"}
        },
        "NE": {
          "callingCode": [
            "227"
          ],
          "currency": [
            "XOF"
          ],
          "name": {"fr":"","en":"Niger"}
        },
        "NF": {
          "callingCode": [
            "672"
          ],
          "currency": [
            "AUD"
          ],
          "name": {"fr":"","en":"Norfolk Island"}
        },
        "NG": {
          "callingCode": [
            "234"
          ],
          "currency": [
            "NGN"
          ],
          "name": {"fr":"","en":"Nigeria"}
        },
        "NI": {
          "callingCode": [
            "505"
          ],
          "currency": [
            "NIO"
          ],
          "name": {"fr":"","en":"Nicaragua"}
        },
        "NL": {
          "callingCode": [
            "31"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Netherlands"}
        },
        "NO": {
          "callingCode": [
            "47"
          ],
          "currency": [
            "NOK"
          ],
          "name": {"fr":"","en":"Norway"}
        },
        "NP": {
          "callingCode": [
            "977"
          ],
          "currency": [
            "NPR"
          ],
          "name": {"fr":"","en":"Nepal"}
        },
        "NR": {
          "callingCode": [
            "674"
          ],
          "currency": [
            "AUD"
          ],
          "name": {"fr":"","en":"Nauru"}
        },
        "NU": {
          "callingCode": [
            "683"
          ],
          "currency": [
            "NZD"
          ],
          "name": {"fr":"","en":"Niue"}
        },
        "NZ": {
          "callingCode": [
            "64"
          ],
          "currency": [
            "NZD"
          ],
          "name": {"fr":"","en":"New Zealand"}
        },
        "OM": {
          "callingCode": [
            "968"
          ],
          "currency": [
            "OMR"
          ],
          "name": {"fr":"","en":"Oman"}
        },
        "PA": {
          "callingCode": [
            "507"
          ],
          "currency": [
            "PAB",
            "USD"
          ],
          "name": {"fr":"","en":"Panama"}
        },
        "PE": {
          "callingCode": [
            "51"
          ],
          "currency": [
            "PEN"
          ],
          "name": {"fr":"","en":"Peru"}
        },
        "PF": {
          "callingCode": [
            "689"
          ],
          "currency": [
            "XPF"
          ],
          "name": {"fr":"","en":"French Polynesia"}
        },
        "PG": {
          "callingCode": [
            "675"
          ],
          "currency": [
            "PGK"
          ],
          "name": {"fr":"","en":"Papua New Guinea"}
        },
        "PH": {
          "callingCode": [
            "63"
          ],
          "currency": [
            "PHP"
          ],
          "name": {"fr":"","en":"Philippines"}
        },
        "PK": {
          "callingCode": [
            "92"
          ],
          "currency": [
            "PKR"
          ],
          "name": {"fr":"","en":"Pakistan"}
        },
        "PL": {
          "callingCode": [
            "48"
          ],
          "currency": [
            "PLN"
          ],
          "name": {"fr":"","en":"Poland"}
        },
        "PM": {
          "callingCode": [
            "508"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Saint Pierre and Miquelon"}
        },
        "PN": {
          "callingCode": [
            "64"
          ],
          "currency": [
            "NZD"
          ],
          "name": {"fr":"","en":"Pitcairn Islands"}
        },
        "PR": {
          "callingCode": [
            "1787",
            "1939"
          ],
          "currency": [
            "USD"
          ],
          "name": {"fr":"","en":"Puerto Rico"}
        },
        "PS": {
          "callingCode": [
            "970"
          ],
          "currency": [
            "ILS"
          ],
          "name": {"fr":"","en":"Palestine"}
        },
        "PT": {
          "callingCode": [
            "351"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Portugal"}
        },
        "PW": {
          "callingCode": [
            "680"
          ],
          "currency": [
            "USD"
          ],
          "name": {"fr":"","en":"Palau"}
        },
        "PY": {
          "callingCode": [
            "595"
          ],
          "currency": [
            "PYG"
          ],
          "name": {"fr":"","en":"Paraguay"}
        },
        "QA": {
          "callingCode": [
            "974"
          ],
          "currency": [
            "QAR"
          ],
          "name": {"fr":"","en":"Qatar"}
        },
        "RE": {
          "callingCode": [
            "262"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Réunion"}
        },
        "RO": {
          "callingCode": [
            "40"
          ],
          "currency": [
            "RON"
          ],
          "name": {"fr":"","en":"Romania"}
        },
        "RS": {
          "callingCode": [
            "381"
          ],
          "currency": [
            "RSD"
          ],
          "name": {"fr":"","en":"Serbia"}
        },
        "RU": {
          "callingCode": [
            "7"
          ],
          "currency": [
            "RUB"
          ],
          "name": {"fr":"","en":"Russia"}
        },
        "RW": {
          "callingCode": [
            "250"
          ],
          "currency": [
            "RWF"
          ],
          "name": {"fr":"","en":"Rwanda"}
        },
        "SA": {
          "callingCode": [
            "966"
          ],
          "currency": [
            "SAR"
          ],
          "name": {"fr":"","en":"Saudi Arabia"}
        },
        "SB": {
          "callingCode": [
            "677"
          ],
          "currency": [
            "SDB"
          ],
          "name": {"fr":"","en":"Solomon Islands"}
        },
        "SC": {
          "callingCode": [
            "248"
          ],
          "currency": [
            "SCR"
          ],
          "name": {"fr":"","en":"Seychelles"}
        },
        "SD": {
          "callingCode": [
            "249"
          ],
          "currency": [
            "SDG"
          ],
          "name": {"fr":"","en":"Sudan"}
        },
        "SE": {
          "callingCode": [
            "46"
          ],
          "currency": [
            "SEK"
          ],
          "name": {"fr":"","en":"Sweden"}
        },
        "SG": {
          "callingCode": [
            "65"
          ],
          "currency": [
            "SGD"
          ],
          "name": {"fr":"","en":"Singapore"}
        },
        "SH": {
          "callingCode": [
            "290"
          ],
          "currency": [
            "SHP"
          ],
          "name": {"fr":"","en":"Saint Helena, Ascension and Tristan da Cunha"}
        },
        "SI": {
          "callingCode": [
            "386"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Slovenia"}
        },
        "SJ": {
          "callingCode": [
            "4779"
          ],
          "currency": [
            "NOK"
          ],
          "name": {"fr":"","en":"Svalbard and Jan Mayen"}
        },
        "SK": {
          "callingCode": [
            "421"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Slovakia"}
        },
        "SL": {
          "callingCode": [
            "232"
          ],
          "currency": [
            "SLL"
          ],
          "name": {"fr":"","en":"Sierra Leone"}
        },
        "SM": {
          "callingCode": [
            "378"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"San Marino"}
        },
        "SN": {
          "callingCode": [
            "221"
          ],
          "currency": [
            "XOF"
          ],
          "name": {"fr":"","en":"Senegal"}
        },
        "SO": {
          "callingCode": [
            "252"
          ],
          "currency": [
            "SOS"
          ],
          "name": {"fr":"","en":"Somalia"}
        },
        "SR": {
          "callingCode": [
            "597"
          ],
          "currency": [
            "SRD"
          ],
          "name": {"fr":"","en":"Suriname"}
        },
        "SS": {
          "callingCode": [
            "211"
          ],
          "currency": [
            "SSP"
          ],
          "name": {"fr":"","en":"South Sudan"}
        },
        "ST": {
          "callingCode": [
            "239"
          ],
          "currency": [
            "STD"
          ],
          "name": {"fr":"","en":"São Tomé and Príncipe"}
        },
        "SV": {
          "callingCode": [
            "503"
          ],
          "currency": [
            "SVC",
            "USD"
          ],
          "name": {"fr":"","en":"El Salvador"}
        },
        "SX": {
          "callingCode": [
            "1721"
          ],
          "currency": [
            "ANG"
          ],
          "name": {"fr":"","en":"Sint Maarten"}
        },
        "SY": {
          "callingCode": [
            "963"
          ],
          "currency": [
            "SYP"
          ],
          "name": {"fr":"","en":"Syria"}
        },
        "SZ": {
          "callingCode": [
            "268"
          ],
          "currency": [
            "SZL"
          ],
          "name": {"fr":"","en":"Swaziland"}
        },
        "TC": {
          "callingCode": [
            "1649"
          ],
          "currency": [
            "USD"
          ],
          "name": {"fr":"","en":"Turks and Caicos Islands"}
        },
        "TD": {
          "callingCode": [
            "235"
          ],
          "currency": [
            "XAF"
          ],
          "name": {"fr":"","en":"Chad"}
        },
        "TF": {
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"French Southern and Antarctic Lands"}
        },
        "TG": {
          "callingCode": [
            "228"
          ],
          "currency": [
            "XOF"
          ],
          "name": {"fr":"","en":"Togo"}
        },
        "TH": {
          "callingCode": [
            "66"
          ],
          "currency": [
            "THB"
          ],
          "name": {"fr":"","en":"Thailand"}
        },
        "TJ": {
          "callingCode": [
            "992"
          ],
          "currency": [
            "TJS"
          ],
          "name": {"fr":"","en":"Tajikistan"}
        },
        "TK": {
          "callingCode": [
            "690"
          ],
          "currency": [
            "NZD"
          ],
          "name": {"fr":"","en":"Tokelau"}
        },
        "TL": {
          "callingCode": [
            "670"
          ],
          "currency": [
            "USD"
          ],
          "name": {"fr":"","en":"Timor-Leste"}
        },
        "TM": {
          "callingCode": [
            "993"
          ],
          "currency": [
            "TMT"
          ],
          "name": {"fr":"","en":"Turkmenistan"}
        },
        "TN": {
          "callingCode": [
            "216"
          ],
          "currency": [
            "TND"
          ],
          "name": {"fr":"","en":"Tunisia"}
        },
        "TO": {
          "callingCode": [
            "676"
          ],
          "currency": [
            "TOP"
          ],
          "name": {"fr":"","en":"Tonga"}
        },
        "TR": {
          "callingCode": [
            "90"
          ],
          "currency": [
            "TRY"
          ],
          "name": {"fr":"","en":"Turkey"}
        },
        "TT": {
          "callingCode": [
            "1868"
          ],
          "currency": [
            "TTD"
          ],
          "name": {"fr":"","en":"Trinidad and Tobago"}
        },
        "TV": {
          "callingCode": [
            "688"
          ],
          "currency": [
            "AUD"
          ],
          "name": {"fr":"","en":"Tuvalu"}
        },
        "TW": {
          "callingCode": [
            "886"
          ],
          "currency": [
            "TWD"
          ],
          "name": {"fr":"","en":"Taiwan"}
        },
        "TZ": {
          "callingCode": [
            "255"
          ],
          "currency": [
            "TZS"
          ],
          "name": {"fr":"","en":"Tanzania"}
        },
        "UA": {
          "callingCode": [
            "380"
          ],
          "currency": [
            "UAH"
          ],
          "name": {"fr":"","en":"Ukraine"}
        },
        "UG": {
          "callingCode": [
            "256"
          ],
          "currency": [
            "UGX"
          ],
          "name": {"fr":"","en":"Uganda"}
        },
        "UM": {
          "currency": [
            "USD"
          ],
          "name": {"fr":"","en":"United States Minor Outlying Islands"}
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
          "name": {"fr":"","en":"United States"}
        },
        "UY": {
          "callingCode": [
            "598"
          ],
          "currency": [
            "UYI",
            "UYU"
          ],
          "name": {"fr":"","en":"Uruguay"}
        },
        "UZ": {
          "callingCode": [
            "998"
          ],
          "currency": [
            "UZS"
          ],
          "name": {"fr":"","en":"Uzbekistan"}
        },
        "VA": {
          "callingCode": [
            "3906698",
            "379"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Vatican City"}
        },
        "VC": {
          "callingCode": [
            "1784"
          ],
          "currency": [
            "XCD"
          ],
          "name": {"fr":"","en":"Saint Vincent and the Grenadines"}
        },
        "VE": {
          "callingCode": [
            "58"
          ],
          "currency": [
            "VEF"
          ],
          "name": {"fr":"","en":"Venezuela"}
        },
        "VG": {
          "callingCode": [
            "1284"
          ],
          "currency": [
            "USD"
          ],
          "name": {"fr":"","en":"British Virgin Islands"}
        },
        "VI": {
          "callingCode": [
            "1340"
          ],
          "currency": [
            "USD"
          ],
          "name": {"fr":"","en":"United States Virgin Islands"}
        },
        "VN": {
          "callingCode": [
            "84"
          ],
          "currency": [
            "VND"
          ],
          "name": {"fr":"","en":"Vietnam"}
        },
        "VU": {
          "callingCode": [
            "678"
          ],
          "currency": [
            "VUV"
          ],
          "name": {"fr":"","en":"Vanuatu"}
        },
        "WF": {
          "callingCode": [
            "681"
          ],
          "currency": [
            "XPF"
          ],
          "name": {"fr":"","en":"Wallis and Futuna"}
        },
        "WS": {
          "callingCode": [
            "685"
          ],
          "currency": [
            "WST"
          ],
          "name": {"fr":"","en":"Samoa"}
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
          "name": {"fr":"","en":"Kosovo"}
        },
        "YE": {
          "callingCode": [
            "967"
          ],
          "currency": [
            "YER"
          ],
          "name": {"fr":"","en":"Yemen"}
        },
        "YT": {
          "callingCode": [
            "262"
          ],
          "currency": [
            "EUR"
          ],
          "name": {"fr":"","en":"Mayotte"}
        },
        "ZA": {
          "callingCode": [
            "27"
          ],
          "currency": [
            "ZAR"
          ],
          "name": {"fr":"","en":"South Africa"}
        },
        "ZM": {
          "callingCode": [
            "260"
          ],
          "currency": [
            "ZMK"
          ],
          "name": {"fr":"","en":"Zambia"}
        },
        "ZW": {
          "callingCode": [
            "263"
          ],
          "currency": [
            "ZWL"
          ],
          "name": {"fr":"","en":"Zimbabwe"}
        }
      })

    ]).then(function () {

      // add supported currencies - ISO 4217
      return currency.setPool({
          USD : {
              symbol : '$',
              name : {"fr":"","en":"United States Dollar"}
          },
          GBP : {
              symbol : '£',
              name : {"fr":"","en":"British Sterling"}
          },
          AUD : {
              symbol : '$',
              name : {"fr":"","en":"Australian Dollar"},
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
              name : {"fr":"","en":"Euro"}
          }
      }).then(function() {

        // use native alert box if available
        if (navigator.notification && navigator.notification.alert)
            window.alert = navigator.notification.alert;

        // adds route.* files as a router source
        router.source.append({
            defaultCacheLevel:2,
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
                    message: {"fr":"","en":"The page you requested does not exist."}
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
                    message:{"fr":"","en":"Invalid Response"}
                });
                return;
            }
            new Toast({
                message:xhr.status === 0 && xhr.responseText.length === 0? {"fr":"","en":"Connection Refused"} : xhr.statusText
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