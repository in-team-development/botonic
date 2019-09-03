// import { equalArrays } from '../util/arrays';
// import { Locale } from './index';
//
// export enum SearchPosition {
//   START = 0,
//   END = 1
// }
//
// export class TokenRange {
//   constructor(readonly from: number, readonly to: number) {}
// }
//
// export class TextEdit {
//   needles: string[][];
//   locale: Locale;
//
//   constructor(locale: Locale, needles: string[]) {
//     this.locale = locale;
//     // TODO maybe needles should also be tokenized outside
//     this.needles = needles.map(n => this.tokenize(n));
//   }
//
//   /**
//    *
//    * @param tokens do not to previously remove stopwords which may occur in needles
//    */
//   search(tokens: string[], pos: SearchPosition): TokenRange | undefined {
//     for (const needle of this.needles) {
//       let range: TokenRange;
//       if (pos === SearchPosition.START) {
//         range = new TokenRange(0, needle.length);
//       } else if (pos === SearchPosition.END) {
//         range = new TokenRange(tokens.length - needle.length, tokens.length);
//       } else {
//         throw new Error(`Invalid search position ${pos}`);
//       }
//       const chunk = tokens.slice(range.from, range.to);
//       if (equalArrays(chunk, needle)) {
//         return range;
//       }
//     }
//     return undefined;
//   }
//
//   /**
//    * @return the stripped text in lower case
//    */
//   strip(text: string, pos: SearchPosition): string {
//     const tokens = this.tokenize(text);
//     const range = this.search(tokens, pos);
//     if (!range) {
//       return text;
//     }
//     let start = 0;
//     let end = 0;
//     if (pos == SearchPosition.START) {
//       start = text.indexOf(tokens[range.from]);
//       for (let r = range.from; r < range.to; r++) {
//         end = text.indexOf(tokens[r], end);
//         if (end < 0) {
//           console.error(
//             `Not found ${tokens[r]} within ${text} at pos ${start}`
//           );
//           return text;
//         }
//         end += tokens[r].length;
//       }
//     }
//     return (text.slice(0, start) + text.slice(end)).trim();
//   }
//
//   tokenize(text: string) {
//     return text.toLowerCase().split(/[ ,.]/);
//   }
// }
