import md5 from './modules/md5';
import URL from './modules/url';
import {
  stringToUTC,
  utcToString,
  dateformat
} from './modules/utc';
import {
  oneOf,
  getRouterObjByName,
  setCurrentPath,
  openNewPage,
  toDefaultPage
} from './modules/other';

import dict from "./modules/dict";

import generator from "./modules/generator";

const Util = {
  oneOf,
  getRouterObjByName,
  setCurrentPath,
  openNewPage,
  toDefaultPage,

  stringToUTC,
  utcToString,
  dateformat,
  
  md5,
  parseURL: URL,
  dict2array: dict,
  generator
}

export default Util;