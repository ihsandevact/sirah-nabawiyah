import { Coordinate } from "@/types/sirah";

export interface ExploreLocation {
  id: string;
  name: {
    id: string;
    en: string;
    ar: string;
  };
  coordinates: Coordinate;
  description: {
    id: string;
    en: string;
    ar: string;
  };
  era: "makkiyah" | "madaniyah" | "both";
}

export const exploreLocations: ExploreLocation[] = [
  {
    id: "makkah",
    coordinates: [39.8261, 21.4225],
    era: "both",
    name: {
      id: "Makkah Al-Mukarramah",
      en: "Makkah Al-Mukarramah",
      ar: "مكة المكرمة"
    },
    description: {
      id: "Pusat dari peradaban Islam dan tempat turunnya wahyu pertama. Terdapat Ka'bah sebagai kiblat umat Muslim di seluruh dunia.",
      en: "The center of Islamic civilization and the place of the first revelation. It contains the Kaaba, the Qibla for Muslims worldwide.",
      ar: "مركز الحضارة الإسلامية ومكان نزول الوحي الأول. يوجد بها الكعبة المشرفة، قبلة المسلمين في جميع أنحاء العالم."
    }
  },
  {
    id: "madinah",
    coordinates: [39.6111, 24.4672],
    era: "madaniyah",
    name: {
      id: "Madinah (Yatsrib)",
      en: "Madinah (Yathrib)",
      ar: "المدينة المنورة (يثرب)"
    },
    description: {
      id: "Kota tujuan Hijrah Rasulullah ﷺ. Basis pertama berdirinya pemerintahan dan masyarakat Islam yang berdaulat.",
      en: "The destination city of the Prophet's ﷺ Hijrah. The first base for the establishment of a sovereign Islamic state and society.",
      ar: "المدينة التي هاجر إليها رسول الله ﷺ. القاعدة الأولى لتأسيس الدولة والمجتمع الإسلامي ذي السيادة."
    }
  },
  {
    id: "thaif",
    coordinates: [40.4063, 21.2643],
    era: "makkiyah",
    name: {
      id: "Thaif",
      en: "Taif",
      ar: "الطائف"
    },
    description: {
      id: "Kota di dataran tinggi tempat Nabi ﷺ mencari perlindungan namun ditolak dengan lemparan batu, hingga kemudian penduduknya masuk Islam.",
      en: "A highland city where the Prophet ﷺ sought refuge but was rejected with stones, until its people later embraced Islam.",
      ar: "مدينة جبلية بحث فيها النبي ﷺ عن الحماية لكنه رُفض بالحجارة، حتى أسلم أهلها لاحقاً."
    }
  },
  {
    id: "badar",
    coordinates: [38.7844, 23.7344],
    era: "madaniyah",
    name: {
      id: "Lembah Badar",
      en: "Badr Valley",
      ar: "وادي بدر"
    },
    description: {
      id: "Lokasi pertempuran besar pertama (Perang Badar Kubra) yang menjadi penentu kemenangan eksistensial umat Islam.",
      en: "The location of the first major battle (The Great Battle of Badr) which secured the existential victory of the Muslims.",
      ar: "موقع أول معركة كبرى (غزوة بدر الكبرى) التي حسمت النصر الوجودي للمسلمين."
    }
  },
  {
    id: "uhud",
    coordinates: [39.612, 24.502],
    era: "madaniyah",
    name: {
      id: "Gunung Uhud",
      en: "Mount Uhud",
      ar: "جبل أحد"
    },
    description: {
      id: "Medan Perang Uhud di mana pasukan Muslim diuji dengan kekalahan akibat pelanggaran instruksi oleh pasukan pemanah.",
      en: "The battlefield of Uhud where the Muslim army was tested with defeat due to a breach of orders by the archers.",
      ar: "ميدان غزوة أحد حيث اختُبر الجيش الإسلامي بالهزيمة بسبب مخالفة الرماة للأوامر."
    }
  },
  {
    id: "khaibar",
    coordinates: [39.2947, 25.6983],
    era: "madaniyah",
    name: {
      id: "Benteng Khaibar",
      en: "Fortress of Khaybar",
      ar: "حصن خيبر"
    },
    description: {
      id: "Area benteng strategis kaum Yahudi yang ditaklukkan oleh Ali bin Abi Thalib dalam Perang Khaibar.",
      en: "A strategic fortress area of the Jews conquered by Ali bin Abi Talib in the Battle of Khaybar.",
      ar: "منطقة الحصون الاستراتيجية لليهود التي فتحها علي بن أبي طالب في غزوة خيبر."
    }
  },
  {
    id: "tabuk",
    coordinates: [36.5715, 28.3835],
    era: "madaniyah",
    name: {
      id: "Tabuk",
      en: "Tabuk",
      ar: "تبوك"
    },
    description: {
      id: "Lokasi ekspedisi militer terakhir Rasulullah ﷺ menghadapi ancaman Kekaisaran Romawi (Bizantium).",
      en: "The location of the last military expedition of the Prophet ﷺ facing the threat of the Roman (Byzantine) Empire.",
      ar: "موقع آخر غزوة عسكرية لرسول الله ﷺ لمواجهة تهديد الإمبراطورية الرومانية (البيزنطية)."
    }
  }
];

export const exploreTribes = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Bani Nadhir", color: "#eab308" }, // yellow
      geometry: {
        type: "Polygon",
        coordinates: [
          [[39.60, 24.41], [39.64, 24.41], [39.64, 24.44], [39.60, 24.44], [39.60, 24.41]]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "Bani Qainuqa", color: "#ef4444" }, // red
      geometry: {
        type: "Polygon",
        coordinates: [
          [[39.60, 24.45], [39.62, 24.45], [39.62, 24.47], [39.60, 24.47], [39.60, 24.45]]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "Bani Quraizhah", color: "#3b82f6" }, // blue
      geometry: {
        type: "Polygon",
        coordinates: [
          [[39.63, 24.42], [39.68, 24.42], [39.68, 24.46], [39.63, 24.46], [39.63, 24.42]]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "Quraisy (Makkah)", color: "#10b981" }, // green
      geometry: {
        type: "Polygon",
        coordinates: [
          [[39.50, 21.10], [40.20, 21.10], [40.20, 21.70], [39.50, 21.70], [39.50, 21.10]]
        ]
      }
    }
  ]
};

export const exploreRoutes = {
  hijrah: {
    type: "Feature",
    properties: { name: "Rute Hijrah (Jalur Pantai)" },
    geometry: {
      type: "LineString",
      coordinates: [
        [39.8261, 21.4225], // Makkah
        [39.8400, 21.3700], // Gua Tsur (approx)
        [39.2000, 21.5000], // Ke arah pantai barat
        [38.8000, 22.5000], // Menyusuri pantai
        [38.5000, 23.5000], // Terus utara
        [39.0000, 24.0000], // Berbelok ke timur
        [39.6111, 24.4672]  // Madinah
      ]
    }
  },
  tabuk: {
    type: "Feature",
    properties: { name: "Rute Pasukan Tabuk" },
    geometry: {
      type: "LineString",
      coordinates: [
        [39.6111, 24.4672], // Madinah
        [38.5000, 26.0000], // Lembah Al-Qura
        [37.5000, 27.5000], // Hijr
        [36.5715, 28.3835]  // Tabuk
      ]
    }
  }
};
