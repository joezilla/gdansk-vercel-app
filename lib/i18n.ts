/**
 * Simple resource bundle for static text that implements fallback 
 * logic to default locale as well as text formatting with parameter 
 * replacement.
 */
export const defaultLocale = "en-US";
export const locales = ["en-US", "de"] as const;
export type ValidLocale = typeof locales[number];

// logging
import { log } from 'next-axiom'

import de_dict from '../public/resources/locales/de/common.json';
import en_dict from '../public/resources/locales/en/common.json';

export class I18N {
  // i18n.ts
  private dictionaries: Record<string, any> =  {
    "en-US": en_dict,
    "de": de_dict
  };
  private locale: string;
  private fallbackLocale = "en-US";

  constructor(locale: string) {
    this.locale = locale;
  }

  private getTranslation(key: string, dictionary: Record<string, any>) {
   return key
      .split(".")
      .reduce((obj, key) => obj && obj[key], dictionary);
  }

  public getTranslator = () => {
    const dictionary =  this.dictionaries[this.locale];
    const fallback = this.dictionaries[this.fallbackLocale];
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
      return typeof translation === "string" ? translation : "oops";
    };
  };

}