import { 
  State, District, Taluka, Village, LandRecord, SearchRequest,
  InsertState, InsertDistrict, InsertTaluka, InsertVillage, 
  InsertLandRecord, InsertSearchRequest 
} from "@shared/schema";

export interface IStorage {
  // States
  getAllStates(): Promise<State[]>;
  getStateById(id: number): Promise<State | undefined>;
  getStateByCode(code: string): Promise<State | undefined>;

  // Districts
  getDistrictsByStateId(stateId: number): Promise<District[]>;
  getDistrictById(id: number): Promise<District | undefined>;

  // Talukas
  getTalukasByDistrictId(districtId: number): Promise<Taluka[]>;
  getTalukaById(id: number): Promise<Taluka | undefined>;

  // Villages
  getVillagesByTalukaId(talukaId: number): Promise<Village[]>;
  getVillageById(id: number): Promise<Village | undefined>;

  // Land Records
  getLandRecordsByVillageAndSurvey(villageId: number, surveyNumber: string, subdivisionNumber?: string): Promise<LandRecord[]>;
  getLandRecordByPropertyUid(propertyUid: string): Promise<LandRecord | undefined>;
  searchLandRecordsByOwner(villageId: number, ownerName: string): Promise<LandRecord[]>;
  createLandRecord(record: InsertLandRecord): Promise<LandRecord>;

  // Search Requests
  createSearchRequest(request: InsertSearchRequest): Promise<SearchRequest>;
  getSearchRequestById(id: number): Promise<SearchRequest | undefined>;
}

export class MemStorage implements IStorage {
  private states: Map<number, State> = new Map();
  private districts: Map<number, District> = new Map();
  private talukas: Map<number, Taluka> = new Map();
  private villages: Map<number, Village> = new Map();
  private landRecords: Map<number, LandRecord> = new Map();
  private searchRequests: Map<number, SearchRequest> = new Map();
  
  private currentStateId = 1;
  private currentDistrictId = 1;
  private currentTalukaId = 1;
  private currentVillageId = 1;
  private currentLandRecordId = 1;
  private currentSearchRequestId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize Indian states
    const statesData = [
      { code: "AP", nameEn: "Andhra Pradesh", nameHi: "आंध्र प्रदेश", nameLocal: "ఆంధ్ర ప్రదేశ్" },
      { code: "AR", nameEn: "Arunachal Pradesh", nameHi: "अरुणाचल प्रदेश", nameLocal: "Arunachal Pradesh" },
      { code: "AS", nameEn: "Assam", nameHi: "असम", nameLocal: "অসম" },
      { code: "BR", nameEn: "Bihar", nameHi: "बिहार", nameLocal: "बिहार" },
      { code: "CG", nameEn: "Chhattisgarh", nameHi: "छत्तीसगढ़", nameLocal: "छत्तीसगढ़" },
      { code: "GA", nameEn: "Goa", nameHi: "गोवा", nameLocal: "गोंय" },
      { code: "GJ", nameEn: "Gujarat", nameHi: "गुजरात", nameLocal: "ગુજરાત" },
      { code: "HR", nameEn: "Haryana", nameHi: "हरियाणा", nameLocal: "हरियाणा" },
      { code: "HP", nameEn: "Himachal Pradesh", nameHi: "हिमाचल प्रदेश", nameLocal: "हिमाचल प्रदेश" },
      { code: "JH", nameEn: "Jharkhand", nameHi: "झारखंड", nameLocal: "झारखंड" },
      { code: "KA", nameEn: "Karnataka", nameHi: "कर्नाटक", nameLocal: "ಕರ್ನಾಟಕ" },
      { code: "KL", nameEn: "Kerala", nameHi: "केरल", nameLocal: "കേരളം" },
      { code: "MP", nameEn: "Madhya Pradesh", nameHi: "मध्य प्रदेश", nameLocal: "मध्य प्रदेश" },
      { code: "MH", nameEn: "Maharashtra", nameHi: "महाराष्ट्र", nameLocal: "महाराष्ट्र" },
      { code: "MN", nameEn: "Manipur", nameHi: "मणिपुर", nameLocal: "মণিপুর" },
      { code: "ML", nameEn: "Meghalaya", nameHi: "मेघालय", nameLocal: "Meghalaya" },
      { code: "MZ", nameEn: "Mizoram", nameHi: "मिजोरम", nameLocal: "Mizoram" },
      { code: "NL", nameEn: "Nagaland", nameHi: "नगालैंड", nameLocal: "Nagaland" },
      { code: "OR", nameEn: "Odisha", nameHi: "ओडिशा", nameLocal: "ଓଡ଼ିଶା" },
      { code: "PB", nameEn: "Punjab", nameHi: "पंजाब", nameLocal: "ਪੰਜਾਬ" },
      { code: "RJ", nameEn: "Rajasthan", nameHi: "राजस्थान", nameLocal: "राजस्थान" },
      { code: "SK", nameEn: "Sikkim", nameHi: "सिक्किम", nameLocal: "སི་ཀིམ་" },
      { code: "TN", nameEn: "Tamil Nadu", nameHi: "तमिलनाडु", nameLocal: "தமிழ் நாடு" },
      { code: "TG", nameEn: "Telangana", nameHi: "तेलंगाना", nameLocal: "తెలంగాణ" },
      { code: "TR", nameEn: "Tripura", nameHi: "त्रिपुरा", nameLocal: "ত্রিপুরা" },
      { code: "UK", nameEn: "Uttarakhand", nameHi: "उत्तराखंड", nameLocal: "उत्तराखंड" },
      { code: "UP", nameEn: "Uttar Pradesh", nameHi: "उत्तर प्रदेश", nameLocal: "उत्तर प्रदेश" },
      { code: "WB", nameEn: "West Bengal", nameHi: "पश्चिम बंगाल", nameLocal: "পশ্চিমবঙ্গ" },
      // Union Territories
      { code: "AN", nameEn: "Andaman and Nicobar Islands", nameHi: "अंडमान और निकोबार द्वीप समूह", nameLocal: "Andaman and Nicobar Islands" },
      { code: "CH", nameEn: "Chandigarh", nameHi: "चंडीगढ़", nameLocal: "ਚੰਡੀਗੜ੍ਹ" },
      { code: "DH", nameEn: "Dadra and Nagar Haveli and Daman and Diu", nameHi: "दादरा और नगर हवेली और दमन और दीव", nameLocal: "દાદરા અને નગર હવેલી અને દમણ અને દીવ" },
      { code: "DL", nameEn: "Delhi", nameHi: "दिल्ली", nameLocal: "दिल्ली" },
      { code: "JK", nameEn: "Jammu and Kashmir", nameHi: "जम्मू और कश्मीर", nameLocal: "جموں و کشمیر" },
      { code: "LA", nameEn: "Ladakh", nameHi: "लद्दाख", nameLocal: "ལ་དྭགས་" },
      { code: "LD", nameEn: "Lakshadweep", nameHi: "लक्षद्वीप", nameLocal: "ലക്ഷദ്വീപ്" },
      { code: "PY", nameEn: "Puducherry", nameHi: "पुदुचेरी", nameLocal: "புதுச்சேরி" },
    ];

    statesData.forEach(state => {
      const id = this.currentStateId++;
      this.states.set(id, { id, ...state });
    });

    // Initialize sample districts for Maharashtra (can be expanded)
    const maharashtraId = Array.from(this.states.values()).find(s => s.code === "MH")?.id!;
    const maharashtraDistricts = [
      { stateId: maharashtraId, code: "MUM", nameEn: "Mumbai", nameHi: "मुंबई", nameLocal: "मुंबई" },
      { stateId: maharashtraId, code: "PUN", nameEn: "Pune", nameHi: "पुणे", nameLocal: "पुणे" },
      { stateId: maharashtraId, code: "NAG", nameEn: "Nagpur", nameHi: "नागपूर", nameLocal: "नागपूर" },
      { stateId: maharashtraId, code: "AUR", nameEn: "Aurangabad", nameHi: "औरंगाबाद", nameLocal: "औरंगाबाद" },
      { stateId: maharashtraId, code: "NAS", nameEn: "Nashik", nameHi: "नाशिक", nameLocal: "नाशिक" },
    ];

    maharashtraDistricts.forEach(district => {
      const id = this.currentDistrictId++;
      this.districts.set(id, { id, ...district });
    });

    // Initialize sample talukas for Mumbai
    const mumbaiId = Array.from(this.districts.values()).find(d => d.code === "MUM")?.id!;
    const mumbaiTalukas = [
      { districtId: mumbaiId, code: "AND", nameEn: "Andheri", nameHi: "अंधेरी", nameLocal: "अंधेरी" },
      { districtId: mumbaiId, code: "BAN", nameEn: "Bandra", nameHi: "बांद्रा", nameLocal: "बांद्रा" },
      { districtId: mumbaiId, code: "BOR", nameEn: "Borivali", nameHi: "बोरिवली", nameLocal: "बोरिवली" },
    ];

    mumbaiTalukas.forEach(taluka => {
      const id = this.currentTalukaId++;
      this.talukas.set(id, { id, ...taluka });
    });

    // Initialize sample villages for Andheri
    const andheriId = Array.from(this.talukas.values()).find(t => t.code === "AND")?.id!;
    const andheriVillages = [
      { talukaId: andheriId, code: "JUH", nameEn: "Juhu", nameHi: "जुहू", nameLocal: "जुहू" },
      { talukaId: andheriId, code: "VER", nameEn: "Versova", nameHi: "वर्सोवा", nameLocal: "वर्सोवा" },
      { talukaId: andheriId, code: "LOK", nameEn: "Lokhandwala", nameHi: "लोकहंडवाला", nameLocal: "लोकहंडवाला" },
    ];

    andheriVillages.forEach(village => {
      const id = this.currentVillageId++;
      this.villages.set(id, { id, ...village });
    });

    // Initialize sample land records
    const juhuId = Array.from(this.villages.values()).find(v => v.code === "JUH")?.id!;
    const sampleLandRecords = [
      {
        propertyUid: "12345678901",
        villageId: juhuId,
        surveyNumber: "123",
        subdivisionNumber: "1",
        ownerName: "राम शर्मा",
        fatherName: "श्याम शर्मा",
        area: "500 sq ft",
        classification: "Residential",
        type: "7-12",
        recordData: {
          ownershipType: "Individual",
          landType: "Urban",
          registrationDate: "2020-01-15",
          lastUpdated: "2023-12-01"
        }
      },
      {
        propertyUid: "12345678902",
        villageId: juhuId,
        surveyNumber: "124",
        subdivisionNumber: "2",
        ownerName: "सीता पटेल",
        fatherName: "गीता पटेल",
        area: "750 sq ft",
        classification: "Commercial",
        type: "property-card",
        recordData: {
          ownershipType: "Individual",
          landType: "Urban",
          registrationDate: "2019-05-20",
          lastUpdated: "2023-11-15"
        }
      }
    ];

    sampleLandRecords.forEach(record => {
      const id = this.currentLandRecordId++;
      this.landRecords.set(id, { id, ...record, createdAt: new Date() });
    });
  }

  async getAllStates(): Promise<State[]> {
    return Array.from(this.states.values());
  }

  async getStateById(id: number): Promise<State | undefined> {
    return this.states.get(id);
  }

  async getStateByCode(code: string): Promise<State | undefined> {
    return Array.from(this.states.values()).find(s => s.code === code);
  }

  async getDistrictsByStateId(stateId: number): Promise<District[]> {
    return Array.from(this.districts.values()).filter(d => d.stateId === stateId);
  }

  async getDistrictById(id: number): Promise<District | undefined> {
    return this.districts.get(id);
  }

  async getTalukasByDistrictId(districtId: number): Promise<Taluka[]> {
    return Array.from(this.talukas.values()).filter(t => t.districtId === districtId);
  }

  async getTalukaById(id: number): Promise<Taluka | undefined> {
    return this.talukas.get(id);
  }

  async getVillagesByTalukaId(talukaId: number): Promise<Village[]> {
    return Array.from(this.villages.values()).filter(v => v.talukaId === talukaId);
  }

  async getVillageById(id: number): Promise<Village | undefined> {
    return this.villages.get(id);
  }

  async getLandRecordsByVillageAndSurvey(villageId: number, surveyNumber: string, subdivisionNumber?: string): Promise<LandRecord[]> {
    return Array.from(this.landRecords.values()).filter(lr => 
      lr.villageId === villageId && 
      lr.surveyNumber === surveyNumber && 
      (!subdivisionNumber || lr.subdivisionNumber === subdivisionNumber)
    );
  }

  async getLandRecordByPropertyUid(propertyUid: string): Promise<LandRecord | undefined> {
    return Array.from(this.landRecords.values()).find(lr => lr.propertyUid === propertyUid);
  }

  async searchLandRecordsByOwner(villageId: number, ownerName: string): Promise<LandRecord[]> {
    return Array.from(this.landRecords.values()).filter(lr => 
      lr.villageId === villageId && 
      lr.ownerName.toLowerCase().includes(ownerName.toLowerCase())
    );
  }

  async createLandRecord(record: InsertLandRecord): Promise<LandRecord> {
    const id = this.currentLandRecordId++;
    const newRecord: LandRecord = { 
      id, 
      ...record,
      area: record.area ?? null,
      propertyUid: record.propertyUid ?? null,
      subdivisionNumber: record.subdivisionNumber ?? null,
      fatherName: record.fatherName ?? null,
      classification: record.classification ?? null,
      recordData: record.recordData ?? null,
      createdAt: new Date() 
    };
    this.landRecords.set(id, newRecord);
    return newRecord;
  }

  async createSearchRequest(request: InsertSearchRequest): Promise<SearchRequest> {
    const id = this.currentSearchRequestId++;
    const newRequest: SearchRequest = { 
      id, 
      ...request,
      stateId: request.stateId ?? null,
      districtId: request.districtId ?? null,
      talukaId: request.talukaId ?? null,
      villageId: request.villageId ?? null,
      surveyNumber: request.surveyNumber ?? null,
      subdivisionNumber: request.subdivisionNumber ?? null,
      ownerName: request.ownerName ?? null,
      propertyUid: request.propertyUid ?? null,
      status: "pending",
      createdAt: new Date() 
    };
    this.searchRequests.set(id, newRequest);
    return newRequest;
  }

  async getSearchRequestById(id: number): Promise<SearchRequest | undefined> {
    return this.searchRequests.get(id);
  }
}

export const storage = new MemStorage();
