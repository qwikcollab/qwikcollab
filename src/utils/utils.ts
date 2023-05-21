import jwtDecode from 'jwt-decode';
import JsSvg from "../assets/lang/js.svg";
import PythonSvg from "../assets/lang/python.svg";

export const isFinite = (a: number | null | undefined) => {
  return !(a === null || a === undefined);
};

export const insertString = (targetString: string, position: number, stringToInsert: string) => {
  return (
    targetString.substring(0, position) +
    stringToInsert +
    targetString.substring(position, targetString.length)
  );
};

export const deleteKeyFromMap = (map: Map<string, any>, key: string) => {
  map.delete(key);
  return map;
};


// public static cursorColors = [
//   { color: '#ef4444', colorLight: '#fca5a5' }, // bg-red-500 and bg-red-300
//   { color: '#3b82f6', colorLight: '#93c5fd' }, // bg-blue-500 and bg-blue-300
//   { color: '#22c55e', colorLight: '#86efac' }, // bg-green-500 and bg-green-300
//   { color: '#eab308', colorLight: '#fde047' }, // bg-yellow-500 and bg-yellow-300
//   { color: '#8b5cf6', colorLight: '#c4b5fd' }, // bg-purple-500 and bg-purple-300
//   { color: '#ec4899', colorLight: '#f9a8d4' }, // bg-pink-500 and bg-pink-300
//   { color: '#14b8a6', colorLight: '#5eead4' }, // bg-teal-500 and bg-teal-300
//   { color: '#06b6d4', colorLight: '#67e8f9' }, // bg-cyan-500 and bg-cyan-300
//   { color: '#84cc16', colorLight: '#bef264' }, // bg-lime-500 and bg-lime-300
// ];

export const COLOR_MAP: Record<string, string> = {
  red: '#ef4444',
  green: '#22c55e',
  blue: '#3b82f6',
  yellow: '#eab308',
  purple: '#8b5cf6',
  pink: '#ec4899',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  lime: '#84cc16',
};

export const isTokenExpired = (token: string | null) => {
  if (!token) return true;
  const decoded = jwtDecode(token); // decode the token
  // @ts-ignore
  const exp = decoded.exp; // get the expiration time
  return Date.now() >= exp * 1000; // compare with current time
};

export const languages = [
  {
    name: 'Python',
    icon: PythonSvg,
    slug: 'python'
  },
  {
    name: 'JavaScript',
    icon: JsSvg,
    slug: 'javascript'
  }
]

export const getLangSvg = (lang: string) => {
  const langObj = languages.find((l) => l.slug === lang);
  if (langObj) {
    return langObj.icon;
  }
  return JsSvg;
}
