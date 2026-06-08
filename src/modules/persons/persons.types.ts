export type Person = {
  id: number;
  age: number;
  name: string;
  selected: boolean;
};

export type GetPersonsParams = {
  page?: unknown;
  limit?: unknown;
};
