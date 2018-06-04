import {
  stringToUTC,
  utcToString,
  dateformat
} from './utc';

export default {
  /**
   * 创建可以自动将UTC时间转为标准日期的列（iView Table Column)
   * @param {string} key 列绑定的字段名称
   * @param {string} title 列标题
   * @param {number} width [可选] 列宽度，默认为150 
   * @return {JSON} iView table标准column参数
   */
  createDateColumn: (key, title, width) => {
    return { 
      key:key,
      title:title,
      width:width|| 150,
      render: function(h, params) {
        return h("div",utcToString(params.row[key], "yyyy-MM-dd hh:mm:ss"));
      }
    }
  },
  /**
   * 创建包含功能按钮的列（iView Table Column)
   * @param {string} title 列标题
   * @param {number} width [可选] 列宽度，默认为150 
   * @param {function} actions 返回功能按钮定义
   * @return {JSON} iView table标准column参数
   * @example actions 参数示例：
   * 01:(params)=>
   * 02:{
   * 03:   return [
   * 04:      { 
   * 05:        text:'编辑',
   * 06:        click:()=>{
   * 07:          // todo sumething... 
   * 08:        }
   * 09:      }
   * 10:   ];
   * 11:}
   */
  createActionColumn: (title, width, actions)=> {
    const parseActions = (h,params)=>{
      let _actions = actions(params);
      let buttons=[];
      _actions.forEach(action=>{
          buttons.push(h('Button', {props: {type: 'text',size: 'small'},on:{click:action.click}}, action.text));
        });
      return h('div',buttons);
    }
    return {
      title:title,
      key: "show_more",
      align: "center",
      width: 150,
      render: parseActions
    }
  }
}
