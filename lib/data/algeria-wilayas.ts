export interface Wilaya {
  code: string;
  name: string;
  nameAr: string;
  stopDeskFee: number;
  homeDeliveryFee: number;
  communes: string[];
}

export const ALGERIA_WILAYAS: Wilaya[] = [
  {
    code: "01",
    name: "Adrar",
    nameAr: "أدرار",
    stopDeskFee: 700,
    homeDeliveryFee: 1100,
    communes: ["Adrar", "Tamest", "Charouine", "Reggane", "In Zghmir", "Tit", "Timimoun", "Bordj Badji Mokhtar", "Aoulef", "Timekten"]
  },
  {
    code: "02",
    name: "Chlef",
    nameAr: "الشلف",
    stopDeskFee: 450,
    homeDeliveryFee: 750,
    communes: ["Chlef", "Ténès", "Boukadir", "Oued Fodda", "El Karimia", "Taougrite", "Béni Haoua", "Ain Merane", "Zeboudja", "Ouled Ben Abdelkader"]
  },
  {
    code: "03",
    name: "Laghouat",
    nameAr: "الأغواط",
    stopDeskFee: 550,
    homeDeliveryFee: 850,
    communes: ["Laghouat", "Ksar El Hirane", "Aflou", "Ain Madhi", "Hassi R'Mel", "El Ghicha", "Brida", "Sidi Makhlouf"]
  },
  {
    code: "04",
    name: "Oum El Bouaghi",
    nameAr: "أم البواقي",
    stopDeskFee: 450,
    homeDeliveryFee: 750,
    communes: ["Oum El Bouaghi", "Ain Beida", "Ain M'lila", "Sigus", "Ain Babouche", "Meskiana", "Ain Fakroun", "Dhalaa"]
  },
  {
    code: "05",
    name: "Batna",
    nameAr: "باتنة",
    stopDeskFee: 450,
    homeDeliveryFee: 750,
    communes: ["Batna", "Barika", "Merouana", "Ain Touta", "Arris", "Tazoult", "N'Gaous", "Ras El Aioun", "Chemora"]
  },
  {
    code: "06",
    name: "Béjaïa",
    nameAr: "بجاية",
    stopDeskFee: 450,
    homeDeliveryFee: 750,
    communes: ["Béjaïa", "Amizour", "Akbou", "El Kseur", "Sidi Aïch", "Tichy", "Aokas", "Kherrata", "Tazmalt", "Adekar"]
  },
  {
    code: "07",
    name: "Biskra",
    nameAr: "بسكرة",
    stopDeskFee: 500,
    homeDeliveryFee: 800,
    communes: ["Biskra", "Tolga", "Sidi Okba", "Chetma", "Ouled Djellal", "Zeribet El Oued", "El Kantara", "M'Chouneche"]
  },
  {
    code: "08",
    name: "Béchar",
    nameAr: "بشار",
    stopDeskFee: 700,
    homeDeliveryFee: 1100,
    communes: ["Béchar", "Abadla", "Kenadsa", "Béni Abbès", "Taghit", "Tabelbala", "Igli"]
  },
  {
    code: "09",
    name: "Blida",
    nameAr: "البليدة",
    stopDeskFee: 350,
    homeDeliveryFee: 550,
    communes: ["Blida", "Boufarik", "Ouled Yaich", "Larbaa", "Bouinan", "El Affroun", "Mouzaia", "Meftah", "Chebli", "Oued Alleug"]
  },
  {
    code: "10",
    name: "Bouira",
    nameAr: "البويرة",
    stopDeskFee: 400,
    homeDeliveryFee: 650,
    communes: ["Bouira", "Lakhdaria", "Sour El Ghozlane", "Ain Bessem", "M'Chedallah", "Kadiria", "Bechloul", "Haizer"]
  },
  {
    code: "11",
    name: "Tamanrasset",
    nameAr: "تمنراست",
    stopDeskFee: 900,
    homeDeliveryFee: 1400,
    communes: ["Tamanrasset", "Abalessa", "In Ghar", "In Salah", "Tazrouk", "Idles"]
  },
  {
    code: "12",
    name: "Tébessa",
    nameAr: "تبسة",
    stopDeskFee: 500,
    homeDeliveryFee: 800,
    communes: ["Tébessa", "Cheria", "El Aouinet", "Ouenza", "Bir El Ater", "Morsott", "Negrine", "El Kouif"]
  },
  {
    code: "13",
    name: "Tlemcen",
    nameAr: "تلمسان",
    stopDeskFee: 450,
    homeDeliveryFee: 750,
    communes: ["Tlemcen", "Mansourah", "Chetouane", "Maghnia", "Remchi", "Ghazaouet", "Nedroma", "Sebdou", "Hennaya", "Beni Saf"]
  },
  {
    code: "14",
    name: "Tiaret",
    nameAr: "تيارت",
    stopDeskFee: 500,
    homeDeliveryFee: 800,
    communes: ["Tiaret", "Sougueur", "Frenda", "Ksar Chellala", "Mahdia", "Rahouia", "Mechraa Sfa", "Oued Lilli"]
  },
  {
    code: "15",
    name: "Tizi Ouzou",
    nameAr: "تيزي وزو",
    stopDeskFee: 400,
    homeDeliveryFee: 650,
    communes: ["Tizi Ouzou", "Azazga", "Draa Ben Khedda", "Tigzirt", "Larbaa Nath Irathen", "Boghni", "Ouadhia", "Azeffoun", "Ain El Hammam"]
  },
  {
    code: "16",
    name: "Alger",
    nameAr: "الجزائر",
    stopDeskFee: 300,
    homeDeliveryFee: 500,
    communes: [
      "Alger Centre", "Sidi M'Hamed", "El Madania", "Belouizdad", "Bab El Oued", "Bologhine", "Casbah", "Oued Koriche", 
      "Bir Mourad Rais", "El Biar", "Bouzareah", "Hydra", "Ben Aknoun", "Kouba", "Hussein Dey", "El Harrach", 
      "Baraki", "Dar El Beida", "Bab Ezzouar", "Bordj El Kiffan", "Bordj El Bahri", "Ain Taya", "Rouiba", "Reghaia", 
      "Zeralda", "Staoueli", "Ain Benian", "Cheraga", "Dely Ibrahim", "Draria", "Baba Hassen", "Saoula", "Birtouta"
    ]
  },
  {
    code: "17",
    name: "Djelfa",
    nameAr: "الجلفة",
    stopDeskFee: 550,
    homeDeliveryFee: 850,
    communes: ["Djelfa", "Ain Oussera", "Messaad", "Hassi Bahbah", "Dar Chioukh", "Charef", "Birine", "El Idrissia"]
  },
  {
    code: "18",
    name: "Jijel",
    nameAr: "جيجل",
    stopDeskFee: 450,
    homeDeliveryFee: 750,
    communes: ["Jijel", "Taher", "El Milia", "Chekfa", "El Ancer", "Sidi Abdelaziz", "Ziama Mansouriah", "Texenna"]
  },
  {
    code: "19",
    name: "Sétif",
    nameAr: "سطيف",
    stopDeskFee: 400,
    homeDeliveryFee: 700,
    communes: ["Sétif", "El Eulma", "Ain Oulmene", "Ain Arnat", "Bougaa", "Ain Azel", "Beni Aziz", "Babor", "Guellal"]
  },
  {
    code: "20",
    name: "Saïda",
    nameAr: "سعيدة",
    stopDeskFee: 500,
    homeDeliveryFee: 800,
    communes: ["Saïda", "Ain El Hadjar", "Youb", "Sidi Boubekeur", "El Hassasna", "Ouled Brahim"]
  },
  {
    code: "21",
    name: "Skikda",
    nameAr: "سكيكدة",
    stopDeskFee: 450,
    homeDeliveryFee: 750,
    communes: ["Skikda", "El Hadaiek", "Azzaba", "Collo", "Tamalous", "Harrouche", "Ben Azzouz", "Ramdane Djamel"]
  },
  {
    code: "22",
    name: "Sidi Bel Abbès",
    nameAr: "سيدي بلعباس",
    stopDeskFee: 450,
    homeDeliveryFee: 750,
    communes: ["Sidi Bel Abbès", "Telagh", "Sfisef", "Ben Badis", "Ras El Ma", "Marhoum", "Sidi Lahcene", "Ain El Berd"]
  },
  {
    code: "23",
    name: "Annaba",
    nameAr: "عنابة",
    stopDeskFee: 450,
    homeDeliveryFee: 750,
    communes: ["Annaba", "El Bouni", "El Hadjar", "Sidi Amar", "Berrahal", "Ain El Berda", "Chetaibi", "Seraidi"]
  },
  {
    code: "24",
    name: "Guelma",
    nameAr: "قالمة",
    stopDeskFee: 450,
    homeDeliveryFee: 750,
    communes: ["Guelma", "Oued Zenati", "Bouchegouf", "Héliopolis", "Guelaat Bou Sbaa", "Ain Makhlouf", "Hammam Debagh"]
  },
  {
    code: "25",
    name: "Constantine",
    nameAr: "قسنطينة",
    stopDeskFee: 400,
    homeDeliveryFee: 700,
    communes: ["Constantine", "El Khroub", "Hamma Bouziane", "Didouche Mourad", "Zighoud Youcef", "Ain Smara", "Ouled Rahmoune", "Ali Mendjeli"]
  },
  {
    code: "26",
    name: "Médéa",
    nameAr: "المدية",
    stopDeskFee: 400,
    homeDeliveryFee: 650,
    communes: ["Médéa", "Berrouaghia", "Ksar El Boukhari", "Beni Slimane", "Tablat", "El Omaria", "Ouamri", "Ain Boucif"]
  },
  {
    code: "27",
    name: "Mostaganem",
    nameAr: "مستغانم",
    stopDeskFee: 450,
    homeDeliveryFee: 750,
    communes: ["Mostaganem", "Ain Nouissy", "Hassi Mameche", "Ain Tedeles", "Sidi Ali", "Bouguirat", "Achaacha", "Mesra"]
  },
  {
    code: "28",
    name: "M'Sila",
    nameAr: "المسيلة",
    stopDeskFee: 450,
    homeDeliveryFee: 750,
    communes: ["M'Sila", "Bou Saada", "Sidi Aissa", "Ain El Melh", "Magra", "Hammam Dhalaa", "Ben Srour", "Ouled Derradj"]
  },
  {
    code: "29",
    name: "Mascara",
    nameAr: "معسكر",
    stopDeskFee: 450,
    homeDeliveryFee: 750,
    communes: ["Mascara", "Sig", "Mohammadia", "Tighennif", "Ghriss", "Oued El Abtal", "Bouhanifia", "Zahana"]
  },
  {
    code: "30",
    name: "Ouargla",
    nameAr: "ورقلة",
    stopDeskFee: 600,
    homeDeliveryFee: 950,
    communes: ["Ouargla", "Hassi Messaoud", "Touggourt", "Rouissat", "Taibet", "Temacine", "N'Goussa", "El Hadjira"]
  },
  {
    code: "31",
    name: "Oran",
    nameAr: "وهران",
    stopDeskFee: 400,
    homeDeliveryFee: 650,
    communes: ["Oran", "Bir El Djir", "Es Senia", "Arzew", "Ain El Turk", "Bethioua", "Gdyel", "Oued Tlelat", "Misserghin", "Boufatis"]
  },
  {
    code: "32",
    name: "El Bayadh",
    nameAr: "البيض",
    stopDeskFee: 650,
    homeDeliveryFee: 1000,
    communes: ["El Bayadh", "Rogassa", "Brezina", "Bougtob", "El Abiodh Sidi Cheikh", "Labiodh Sidi Cheikh"]
  },
  {
    code: "33",
    name: "Illizi",
    nameAr: "إليزي",
    stopDeskFee: 900,
    homeDeliveryFee: 1400,
    communes: ["Illizi", "Djanet", "Debdeb", "In Amenas", "Bordj Omar Driss"]
  },
  {
    code: "34",
    name: "Bordj Bou Arréridj",
    nameAr: "برج بوعريريج",
    stopDeskFee: 400,
    homeDeliveryFee: 700,
    communes: ["Bordj Bou Arréridj", "Ras El Oued", "Bordj Zemoura", "Mansoura", "Ain Taghrout", "Bir Kasdali", "El Achir"]
  },
  {
    code: "35",
    name: "Boumerdès",
    nameAr: "بومرداس",
    stopDeskFee: 350,
    homeDeliveryFee: 550,
    communes: ["Boumerdès", "Zemmouri", "Dellys", "Bordj Menaiel", "Khemis El Khechna", "Isser", "Thénia", "Corso", "Tidjelabine", "Hammedi"]
  },
  {
    code: "36",
    name: "El Tarf",
    nameAr: "الطارف",
    stopDeskFee: 500,
    homeDeliveryFee: 800,
    communes: ["El Tarf", "El Kala", "Ben M'Hidi", "Drean", "Bouhadjar", "Besbes", "Ain El Assel"]
  },
  {
    code: "37",
    name: "Tindouf",
    nameAr: "تندوف",
    stopDeskFee: 900,
    homeDeliveryFee: 1400,
    communes: ["Tindouf", "Oum El Assel"]
  },
  {
    code: "38",
    name: "Tissemsilt",
    nameAr: "تيسمسيلت",
    stopDeskFee: 500,
    homeDeliveryFee: 800,
    communes: ["Tissemsilt", "Theniet El Had", "Lardjem", "Bordj Bounaama", "Khemisti", "Ammari"]
  },
  {
    code: "39",
    name: "El Oued",
    nameAr: "الوادي",
    stopDeskFee: 600,
    homeDeliveryFee: 950,
    communes: ["El Oued", "Robbah", "Guemar", "Debila", "Magrane", "Bayadha", "Taleb Larbi", "Hassi Khalifa"]
  },
  {
    code: "40",
    name: "Khenchela",
    nameAr: "خنشلة",
    stopDeskFee: 500,
    homeDeliveryFee: 800,
    communes: ["Khenchela", "Kais", "Chechar", "Bouhmama", "El Hamma", "Babar", "Ouled Rechache"]
  },
  {
    code: "41",
    name: "Souk Ahras",
    nameAr: "سوق أهراس",
    stopDeskFee: 500,
    homeDeliveryFee: 800,
    communes: ["Souk Ahras", "Sedrata", "Mechroha", "M'Daourouch", "Taoura", "Heddada", "Merahna"]
  },
  {
    code: "42",
    name: "Tipaza",
    nameAr: "تيبازة",
    stopDeskFee: 350,
    homeDeliveryFee: 550,
    communes: ["Tipaza", "Kolea", "Cherchell", "Hadjout", "Bou Ismail", "Fouka", "Douaouda", "Ahmer El Ain", "Gouraya", "Sidi Amar"]
  },
  {
    code: "43",
    name: "Mila",
    nameAr: "ميلة",
    stopDeskFee: 450,
    homeDeliveryFee: 750,
    communes: ["Mila", "Chelghoum Laid", "Tadjenanet", "Ferdjioua", "Grarem Gouga", "Oued Endja", "Teleghma", "Sidi Merouane"]
  },
  {
    code: "44",
    name: "Aïn Defla",
    nameAr: "عين الدفلى",
    stopDeskFee: 400,
    homeDeliveryFee: 650,
    communes: ["Aïn Defla", "Khemis Miliana", "Miliana", "El Attaf", "Djelida", "Djendel", "Hammam Righa", "Boumedfaa"]
  },
  {
    code: "45",
    name: "Naâma",
    nameAr: "النعامة",
    stopDeskFee: 650,
    homeDeliveryFee: 1000,
    communes: ["Naâma", "Mécheria", "Ain Sefra", "Tiout", "Sfissifa", "Moghrar", "Asla"]
  },
  {
    code: "46",
    name: "Aïn Témouchent",
    nameAr: "عين تموشنت",
    stopDeskFee: 450,
    homeDeliveryFee: 750,
    communes: ["Aïn Témouchent", "Beni Saf", "Hammam Bou Hadjar", "El Malah", "Ain El Arbaa", "El Amria", "Oulhassa Gheraba"]
  },
  {
    code: "47",
    name: "Ghardaïa",
    nameAr: "غرداية",
    stopDeskFee: 600,
    homeDeliveryFee: 950,
    communes: ["Ghardaïa", "El Guerrara", "Metlili", "Bounoura", "Dhayet Bendhahoua", "Zelfana", "Berriane", "El Atteuf"]
  },
  {
    code: "48",
    name: "Relizane",
    nameAr: "غليزان",
    stopDeskFee: 450,
    homeDeliveryFee: 750,
    communes: ["Relizane", "Oued Rhiou", "Mazouna", "Yellel", "Zemmora", "Ammi Moussa", "Djidiouia", "El Matmar"]
  },
  {
    code: "49",
    name: "Timimoun",
    nameAr: "تيميمون",
    stopDeskFee: 750,
    homeDeliveryFee: 1200,
    communes: ["Timimoun", "Aougrout", "Deldoul", "Ksar Kaddour", "Charouine", "Ouled Said"]
  },
  {
    code: "50",
    name: "Bordj Badji Mokhtar",
    nameAr: "برج باجي مختار",
    stopDeskFee: 900,
    homeDeliveryFee: 1400,
    communes: ["Bordj Badji Mokhtar", "Timiaouine"]
  },
  {
    code: "51",
    name: "Ouled Djellal",
    nameAr: "أولاد جلال",
    stopDeskFee: 550,
    homeDeliveryFee: 850,
    communes: ["Ouled Djellal", "Sidi Khaled", "Ras El Miad", "Besbes", "Doucen", "Chaiba"]
  },
  {
    code: "52",
    name: "Béni Abbès",
    nameAr: "بني عباس",
    stopDeskFee: 750,
    homeDeliveryFee: 1200,
    communes: ["Béni Abbès", "Kerzaz", "Timoudi", "El Ouata", "Tabelbala", "Igli"]
  },
  {
    code: "53",
    name: "In Salah",
    nameAr: "عين صالح",
    stopDeskFee: 850,
    homeDeliveryFee: 1300,
    communes: ["In Salah", "In Ghar", "Foggaret Ezzaouia"]
  },
  {
    code: "54",
    name: "In Guezzam",
    nameAr: "عين قزام",
    stopDeskFee: 950,
    homeDeliveryFee: 1500,
    communes: ["In Guezzam", "Tin Zaouatine"]
  },
  {
    code: "55",
    name: "Touggourt",
    nameAr: "تقرت",
    stopDeskFee: 600,
    homeDeliveryFee: 950,
    communes: ["Touggourt", "Temacine", "Megarine", "Taibet", "Nezla", "Tebesbest", "Zaouia El Abidia"]
  },
  {
    code: "56",
    name: "Djanet",
    nameAr: "جانت",
    stopDeskFee: 950,
    homeDeliveryFee: 1500,
    communes: ["Djanet", "Bordj El Haouas"]
  },
  {
    code: "57",
    name: "El M'Ghair",
    nameAr: "المغير",
    stopDeskFee: 600,
    homeDeliveryFee: 950,
    communes: ["El M'Ghair", "Djamaa", "Oum Touyour", "Sidi Amrane", "Still", "Tendla"]
  },
  {
    code: "58",
    name: "El Meniaa",
    nameAr: "المنيعة",
    stopDeskFee: 700,
    homeDeliveryFee: 1100,
    communes: ["El Meniaa", "Hassi Gara", "Hassi Fehal"]
  }
];
