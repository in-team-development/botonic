import { SearchPosition, TextEdit, TextRange } from '../../src/nlp/edit';

test('hack because webstorm does not recognize test.each', () => {});

test.each<any>([
  [
    ['hey', 'buenas tardes'],
    'buenas tardes teneis zapatos?',
    new TextRange(0, 14)
  ],
  [['buenas tardes'], 'buenas zapatillas', undefined]
])(
  `TEST: search [%s] starts with '%s'`,
  (needles: string[], haystack: string, expected: TextRange | undefined) => {
    const sut = new TextEdit('es', needles);
    const range = sut.search(haystack, SearchPosition.START);
    expect(range).toEqual(expected);
  }
);

test.each<any>([
  [['deu', 'hasta luego'], 'gracias  .Hasta  luego', new TextRange(1, 3)],
  [['hasta luego'], 'hasta', undefined],
  [['hasta luego'], 'luego', undefined]
])(
  `TEST: search [%s] ends with '%s'`,
  (needles: string[], haystack: string, expected: TextRange | undefined) => {
    const sut = new TextEdit('es', needles);
    const range = sut.search(haystack, SearchPosition.END);
    expect(range).toEqual(expected);
  }
);

test.each<any>([
  [
    SearchPosition.START,
    ['buenos días'],
    ' Buenos  dias, teneis zapatos?',
    'teneis zapatos?'
  ]
  // [
  //   SearchPosition.END,
  //   ['deu', 'hasta luego'],
  //   'hey amigos.Hasta  luego',
  //   ['hey', 'amig']
  // ],
  // [SearchPosition.START, ['hasta luego'], 'hasta', ['hast']]
])(
  `TEST: strip [%s] from '%s'`,
  (
    pos: SearchPosition,
    needles: string[],
    haystack: string,
    expected: TextRange | undefined
  ) => {
    const sut = new TextEdit('es', needles);
    expect(sut.strip(haystack, pos)).toEqual(expected);
  }
);
