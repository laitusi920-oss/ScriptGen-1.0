
export interface Character {
  name: string;
  age: number;
  description: string;
  costume: string;
}

export interface Scene {
  sceneNumber: number;
  location: string;
  time: string;
  action: string;
  dialogues: Array<{
    character: string;
    text: string;
    parenthetical?: string;
  }>;
  editingNote?: string;
}

export interface Script {
  title: string;
  writer: string;
  characters: Character[];
  scenes: Scene[];
  summary: string;
}
