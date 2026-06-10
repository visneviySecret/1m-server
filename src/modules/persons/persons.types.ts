export type Person = {
  id: number;
  age: number;
  name: string;
  selected: boolean;
};

export type SortOrder = "asc" | "desc";

export type GetPersonsParams = {
  page?: unknown;
  limit?: unknown;
  id?: unknown;
  sort?: unknown;
  selected: boolean;
};

export type PersonsPage = {
  items: Person[];
  hasNext: boolean;
};

export type CreatePersonParams = {
  id: number;
};

export type UpdatePersonSelectedParams = {
  id: number;
  selected: boolean;
};
