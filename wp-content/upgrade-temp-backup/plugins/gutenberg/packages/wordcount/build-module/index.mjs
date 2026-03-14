// packages/wordcount/src/index.ts
import { defaultSettings } from "./defaultSettings.mjs";
import stripTags from "./stripTags.mjs";
import transposeAstralsToCountableChar from "./transposeAstralsToCountableChar.mjs";
import stripHTMLEntities from "./stripHTMLEntities.mjs";
import stripConnectors from "./stripConnectors.mjs";
import stripRemovables from "./stripRemovables.mjs";
import stripHTMLComments from "./stripHTMLComments.mjs";
import stripShortcodes from "./stripShortcodes.mjs";
import stripSpaces from "./stripSpaces.mjs";
import transposeHTMLEntitiesToCountableChars from "./transposeHTMLEntitiesToCountableChars.mjs";
function loadSettings(type = "words", userSettings = {}) {
  const mergedSettings = { ...defaultSettings, ...userSettings };
  const settings = {
    ...mergedSettings,
    type,
    shortcodes: []
  };
  settings.shortcodes = settings.l10n?.shortcodes ?? [];
  if (settings.shortcodes && settings.shortcodes.length) {
    settings.shortcodesRegExp = new RegExp(
      "\\[\\/?(?:" + settings.shortcodes.join("|") + ")[^\\]]*?\\]",
      "g"
    );
  }
  if (settings.type !== "characters_excluding_spaces" && settings.type !== "characters_including_spaces") {
    settings.type = "words";
  }
  return settings;
}
function countWords(text, regex, settings) {
  text = [
    stripTags.bind(null, settings),
    stripHTMLComments.bind(null, settings),
    stripShortcodes.bind(null, settings),
    stripSpaces.bind(null, settings),
    stripHTMLEntities.bind(null, settings),
    stripConnectors.bind(null, settings),
    stripRemovables.bind(null, settings)
  ].reduce((result, fn) => fn(result), text);
  text = text + "\n";
  return text.match(regex)?.length ?? 0;
}
function countCharacters(text, regex, settings) {
  text = [
    stripTags.bind(null, settings),
    stripHTMLComments.bind(null, settings),
    stripShortcodes.bind(null, settings),
    transposeAstralsToCountableChar.bind(null, settings),
    stripSpaces.bind(null, settings),
    transposeHTMLEntitiesToCountableChars.bind(null, settings)
  ].reduce((result, fn) => fn(result), text);
  text = text + "\n";
  return text.match(regex)?.length ?? 0;
}
function count(text, type, userSettings) {
  const settings = loadSettings(type, userSettings);
  let matchRegExp;
  switch (settings.type) {
    case "words":
      matchRegExp = settings.wordsRegExp;
      return countWords(text, matchRegExp, settings);
    case "characters_including_spaces":
      matchRegExp = settings.characters_including_spacesRegExp;
      return countCharacters(text, matchRegExp, settings);
    case "characters_excluding_spaces":
      matchRegExp = settings.characters_excluding_spacesRegExp;
      return countCharacters(text, matchRegExp, settings);
    default:
      return 0;
  }
}
export {
  count
};
//# sourceMappingURL=index.mjs.map
