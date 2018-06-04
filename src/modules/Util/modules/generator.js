import {
  stringToUTC,
  utcToString,
  dateformat
} from './utc';

export default {
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

  createActionColumn: (title, width, actions)=> {
    return {
      title:title,
      key: "show_more",
      align: "center",
      width: 150,
      render: (h, params) => {
        let buttons=[];
        actions.forEach(acition=>{
          buttons.push(h('Button', {props: {type: 'text',size: 'small'},on:{click:action.click}}, action.text));
        });
        return h('div',buttons);
      }
    }
  }
}
