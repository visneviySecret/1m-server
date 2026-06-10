export type Person = {
  id: number;
  age: number;
  name: string;
  selected: boolean;
};

export type GetPersonsParams = {
  page?: unknown;
  limit?: unknown;
  id?: unknown;
  selected: boolean;
};

export type PersonsPage = {
  items: Person[];
  hasNext: boolean;
};

export type CreatePersonParams = {
  id: number;
};
