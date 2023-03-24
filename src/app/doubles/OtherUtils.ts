export type stringInfo = {
  lowerCase: string;
  upperCase: string;
  characters: string[];
  length: number;
  extraInfo: Object | undefined;
};

export function calculateComplexity(stringInfo: stringInfo) {
  return Object.keys(stringInfo.extraInfo).length * stringInfo.length;
}

// Fakes: Simplified working implementations of different functionalities that we use.
type LoggerServiceCallback = (_: string) => void;

export function toUpperCaseWithCallback(
  arg: string,
  callback: LoggerServiceCallback
) {
  if (!arg) {
    callback("Invalid argument!");
    return;
  }

  callback(`Called function with ${arg}`);
  return arg.toUpperCase();
}
