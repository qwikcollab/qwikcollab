import { python } from '@codemirror/legacy-modes/mode/python';
import { javascript, typescript } from '@codemirror/legacy-modes/mode/javascript';
import { php } from '@codemirror/lang-php';
import { java } from '@codemirror/lang-java';
import { Langs } from '../../../utils/Languages';
import { StreamLanguage } from '@codemirror/language';

export const getLangExtension = (lang: Langs) => {
  switch (lang) {
    case Langs.JS:
      return StreamLanguage.define(javascript);
    case Langs.PYTHON:
      return StreamLanguage.define(python);
    case Langs.TS:
      return StreamLanguage.define(typescript);
    case Langs.JAVA:
      return java();
    case Langs.PHP:
      return php();
    default:
      return StreamLanguage.define(javascript);
  }
};
