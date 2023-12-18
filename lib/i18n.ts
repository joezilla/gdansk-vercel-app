export const defaultLocale = "en-US";
export const locales = ["en-US", "de"] as const;
export type ValidLocale = typeof locales[number];

// logging
import { log } from 'next-axiom'

/*
// i18n.ts
const dictionaries: Record<string, any> = {
  "en-US": () => import("../public/locales/en-US/common.json").then((module) => module.default),
  "de": () => import("../public/locales/de/common.json").then((module) => module.default),
} as const;


function getTranslation(key: string, dictionary: Record<string, any>) {
  return key
    .split(".")
    .reduce((obj, key) => obj && obj[key], dictionary);
}

export const getTranslator = async (locale: string) => {
  const dictionary = await dictionaries[locale]();
  const fallback = await dictionaries[fallbackLocale]();
  return (key: string, params?: { [key: string]: string | number }) => {
    let translation = getTranslation(key, dictionary);
    if (!translation) {
      log.warn("Cannot find static i18n entry " + key + " for locale: " + locale);
      translation = getTranslation(key, fallback);
    }
    // dang
    if (!translation) {
      log.error("Cannot find static i18n entry anywhere: " + key);
      return key;
    }
    if (params && Object.entries(params).length) {
      Object.entries(params).forEach(([key, value]) => {
        translation = translation!.replace(`{{ ${key} }}`, String(value));
      });
    }
    return translation;
  };
};*/

export class I18N {
  // i18n.ts
  private dictionaries: Record<string, any>;
  private locale: string;
  private fallbackLocale = "en-US";

  constructor(locale: string) {
    this.locale = locale;
  }

  public async init() {
    this.dictionaries = {
      "en-US": () => import("../public/locales/en-US/common.json").then((module) => module.default),
      "de": () => import("../public/locales/de/common.json").then((module) => module.default),
    } as const;
  }

  private getTranslation(key: string, dictionary: Record<string, any>) {
    return key
      .split(".")
      .reduce((obj, key) => obj && obj[key], dictionary);
  }

  public getTranslator = () => {
    const dictionary =  this.dictionaries[this.locale]();
    const fallback = this.dictionaries[this.fallbackLocale]();
    return (key: string, params?: { [key: string]: string | number }) => {
      let translation = this.getTranslation(key, dictionary);
      if (!translation) {
        log.warn("Cannot find static i18n entry " + key + " for locale: " + this.locale);
        translation = this.getTranslation(key, fallback);
      }
      // dang
      if (!translation) {
        log.error("Cannot find static i18n entry anywhere: " + key);
        return key;
      }
      if (params && Object.entries(params).length) {
        Object.entries(params).forEach(([key, value]) => {
          translation = translation!.replace(`{{ ${key} }}`, String(value));
        });
      }
      return translation;
    };
  };

}