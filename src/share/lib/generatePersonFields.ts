const alphabet = Array.from({ length: 26 }, (_, index) =>
  String.fromCharCode(65 + index)
);

export function generatePersonAge() {
  return Math.trunc(Math.random() * 99 + 1);
}

export function generatePersonName() {
  return alphabet[Math.trunc(Math.random() * alphabet.length)]!;
}

export function generatePersonFields() {
  return {
    age: generatePersonAge(),
    name: generatePersonName(),
  };
}
