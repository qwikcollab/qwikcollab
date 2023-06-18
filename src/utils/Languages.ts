import JsSvg from '../assets/lang/js.svg';
import PythonSvg from '../assets/lang/python.svg';
import TsSvg from '../assets/lang/ts.svg';
import JavaSvg from '../assets/lang/java.svg';
import PHPSvg from '../assets/lang/php.svg';

export enum Langs {
  JS = 'javascript',
  TS = 'typescript',
  PYTHON = 'python',
  PHP = 'php',
  JAVA = 'java'
}

export const languages = {
  [Langs.JAVA]: {
    slug: Langs.JAVA,
    icon: JavaSvg
  },
  [Langs.TS]: {
    slug: Langs.TS,
    icon: TsSvg
  },
  [Langs.PHP]: {
    slug: Langs.PHP,
    icon: PHPSvg
  },
  [Langs.JS]: {
    slug: Langs.JS,
    icon: JsSvg
  },
  [Langs.PYTHON]: {
    slug: Langs.PYTHON,
    icon: PythonSvg
  }
};
