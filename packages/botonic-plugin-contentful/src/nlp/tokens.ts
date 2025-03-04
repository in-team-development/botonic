import { Locale, tokenizeAndStem } from './index';
import { StemmingEscaper } from './node-nlp';

export const BLANK = ' ';

export function substringIsBlankSeparated(
  haystack: string,
  needle: string
): boolean {
  //not using regex because recompiling them for each keyword might be expensive
  const foundAt = haystack.indexOf(needle);
  if (foundAt < 0) {
    return false;
  }
  if (foundAt > 0 && haystack[foundAt - 1] != BLANK) {
    return false;
  }
  if (
    foundAt < haystack.length - needle.length &&
    haystack[foundAt + needle.length] != BLANK
  ) {
    return false;
  }
  return true;
}

export function countOccurrences(haystack: string, needle: string): number {
  let n = 0;
  let pos = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    pos = haystack.indexOf(needle, pos);
    if (pos >= 0) {
      ++n;
      pos += needle.length;
    } else break;
  }
  return n;
}

export class Tokenizer {
  constructor(readonly stemEscaper?: StemmingEscaper) {}

  tokenize(locale: Locale, inputText: string): string[] {
    const escaper = this.stemEscaper;
    if (!escaper) {
      return tokenizeAndStem(locale, inputText);
    }
    const escaped = escaper.escape(inputText);
    const stems = tokenizeAndStem(locale, escaped);
    return stems.map(stem => escaper.unescape(stem));
  }
}
