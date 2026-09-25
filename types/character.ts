export interface CharacterBio {
  id: string;
  names: string[];
  status: string;
  bio: {
    id: string;
    en: string;
    ar: string;
  };
}
