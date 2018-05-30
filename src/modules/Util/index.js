import MD5 from './modules/md5';
import URL from './modules/url';
import {
  stringToUTC,
  utcToString,
  dateformat
} from './modules/utc';
import {
  title,
  inOf,
  oneOf,
  showThisRoute,
  getRouterObjByName,
  handleTitle,
  setCurrentPath,
  openNewPage,
  toDefaultPage,
  fullscreenEvent
} from './modules/other';

import dict from "./modules/dict";

const Util = {
  title,
  inOf,
  oneOf,
  showThisRoute,
  getRouterObjByName,
  handleTitle,
  setCurrentPath,
  openNewPage,
  toDefaultPage,
  fullscreenEvent,

  stringToUTC,
  utcToString,
  dateformat,

  md5: MD5,
  parseURL: URL,
  dict2array: dict
}

export default Util;