// ===== संपादन योग्य विवरण / EDIT WEDDING DETAILS HERE =====
window.WEDDING = {
  groom: "आयुष", bride: "पूजा",
  weddingDate: "2026-11-24",
  ceremonyTime: "19:00",            // शुभ विवाह: शाम 7:00 बजे से (IST) — countdown target
  place: "बक्सर, बिहार", placeShort: "बक्सर, बिहार",
  venueName: "", venueAddress: "",   // पुष्टि होने पर भरें
  mapLink: "https://maps.app.goo.gl/qQh5LSsYfrFuSfwdA",
  parentsHeading: "माता-पिता का स्नेह एवं आशीर्वाद",
  parents: "",
  parentsNote: "आपके स्नेह एवं आशीर्वाद से ही यह मंगल अवसर संभव हुआ है।",
  familyHeading: "निमंत्रण",
  familyText: "समस्त साहनी परिवार की ओर से ।",

  // ===== वधू / वर परिचय — विवरण यहाँ जोड़ें/बदलें (खाली/अनुपलब्ध पंक्तियाँ छिप जाती हैं) =====
  brideIntro: {
    name: "आयुष्मती पूजा कुमारी", 
    details: [
      "सुपुत्री: स्व० अयोध्या साहनी",
      "एवं",
      "श्रीमती सुनीता देवी",
      "ग्राम: प्रधानपुर, रसड़ा ",
      "जिला: बलिया"
    ]
  },
  groomIntro: {
    name: "चिरंजीवी आयुष कुमार साहनी",
    details: [
      "सुपुत्र: श्री जगदम्बा साहनी",
      "एवं",
      "श्रीमती पार्वती देवी",
      "ग्राम: मित्रलोक कॉलोनी, पांडेयपट्टी",
      "जिला: बक्सर"
    ]
  },

  // ===== कार्यक्रम की तस्वीरें (वैकल्पिक) — assets/ में रखें; खाली/अनुपलब्ध हो तो रंगीन हेडर दिखता रहेगा =====
  eventImgs: {
    tilak:  "assets/tilak.jpg",
    haldi:  "assets/haldi.jpg",
    vivah:  "assets/subh-vivah.jpg",
    swagat: "assets/swagat.jpg"
  },
  help: { number: "919931501506", message: "नमस्ते! मैं आयुष और पूजा के विवाह समारोह के संबंध में सहायता चाहता/चाहती हूँ। कृपया समारोह के समय, स्थान या अन्य जानकारी देने में मदद करें।" },
  upi: { id: "9931501506@ybl", name: "Aayush Sahani" },   // कोई राशि तय नहीं — अतिथि स्वयं चुनते हैं
  footerLine: "स्नेह, आशीर्वाद एवं आत्मीयता सहित समस्त साहनी परिवार",
  audio: "assets/shehnai.mp3",
  events: [  // date: YYYY-MM-DD, time: 24-hour HH:MM (IST), fromTime: true => "...से"
    { id:"tilak",  name:"तिलक",          date:"2026-11-20", time:"18:00", venue:"", map:"", desc:"वर पक्ष का शुभ तिलक एवं आशीर्वाद समारोह।" },
    { id:"haldi",  name:"हल्दी",         date:"2026-11-24", time:"10:00", venue:"", map:"", desc:"हल्दी की रस्म — उमंग, गीत और पीले रंगों की मस्ती।" },
    { id:"vivah",  name:"शुभ विवाह",     date:"2026-11-24", time:"19:00", fromTime:true, venue:"", map:"", desc:"मंडप के नीचे सात फेरों का पावन संस्कार।" },
    { id:"swagat", name:"स्वागत समारोह", date:"2026-11-25", time:"11:00", venue:"", map:"", desc:"नव दम्पति को आशीर्वाद देने हेतु स्नेह-भोज।" }
  ]
};
