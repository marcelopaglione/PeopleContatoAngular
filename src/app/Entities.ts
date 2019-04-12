
  export interface PageContent {
      id: number;
      name: string;
      rg: string;
      birthDate: Date;
  }

  export interface Page {
      content: PageContent[];
      first: boolean;
      last: boolean;
      totalElements: number;
      totalPages: number;
      number: number;
      size: number;
      numberOfElements: number;
      empty: boolean;
  }

  export interface Person {
    id: number;
    name: string;
    rg: string;
    birthDate: Date;
  }

  export interface Contato {
    id: number;
    name: string;
    person: Person;
  }

  export interface ReponseMessage {
    status: string;
    message: string;
  }

  export interface PersonContatoEntity {
    person: Person;
    contatos: Contato[];
  }


