export interface GlossaryItem {
  terms: string[];
  definition: {
    id: string;
    en: string;
    ar: string;
  };
}

export const glossaryData: GlossaryItem[] = [
  {
    terms: ["ghanimah", "harta rampasan"],
    definition: {
      id: "Harta rampasan perang yang didapatkan dari musuh setelah pertempuran usai dan musuh menyerah/kalah.",
      en: "War booty acquired from the enemy after a battle is won and the enemy surrenders or is defeated.",
      ar: "ما يؤخذ من أموال الكفار بحق في الحرب."
    }
  },
  {
    terms: ["fai'"],
    definition: {
      id: "Harta rampasan perang yang didapatkan tanpa melalui pertempuran fisik (musuh menyerah sebelum berperang).",
      en: "Booty gained without fighting (when the enemy surrenders before a physical clash).",
      ar: "ما حصل للمسلمين من أموال الكفار من غير قتال."
    }
  },
  {
    terms: ["bai'at", "baiat", "baiat aqabah"],
    definition: {
      id: "Sumpah setia atau janji ketaatan yang diberikan kepada seorang pemimpin (Rasulullah ﷺ).",
      en: "Pledge of allegiance or oath of loyalty given to a leader (The Prophet ﷺ).",
      ar: "العهد والمعاهدة على الطاعة."
    }
  },
  {
    terms: ["anshar", "kaum anshar"],
    definition: {
      id: "Penduduk asli Madinah (suku Aus dan Khazraj) yang menerima, menolong, dan melindungi Rasulullah ﷺ serta kaum Muhajirin.",
      en: "The native inhabitants of Madinah (Aus and Khazraj tribes) who welcomed and protected the Prophet ﷺ and the Muhajirin.",
      ar: "أهل المدينة من الأوس والخزرج الذين نصروا رسول الله ﷺ."
    }
  },
  {
    terms: ["muhajirin", "kaum muhajirin"],
    definition: {
      id: "Umat Islam Makkah yang berhijrah (berpindah) ke Madinah demi mempertahankan akidah mereka.",
      en: "The Muslims of Makkah who migrated to Madinah to preserve their faith.",
      ar: "المسلمون الذين هاجروا من مكة إلى المدينة."
    }
  },
  {
    terms: ["jizyah"],
    definition: {
      id: "Pajak perlindungan yang dibayarkan oleh warga non-Muslim (Ahlu Dzimmah) yang hidup di bawah pemerintahan Islam.",
      en: "A protection tax paid by non-Muslim citizens (Ahl al-Dhimmah) living under an Islamic government.",
      ar: "ما يؤخذ من أهل الذمة مقابل حمايتهم."
    }
  },
  {
    terms: ["khandaq", "parit"],
    definition: {
      id: "Parit pertahanan berukuran raksasa. Strategi ini diusulkan oleh Salman Al-Farisi pada Perang Ahzab.",
      en: "A massive defensive trench. This strategy was proposed by Salman the Persian during the Battle of the Confederates.",
      ar: "خندق دفاعي عميق، اقترحه سلمان الفارسي في غزوة الأحزاب."
    }
  }
];
