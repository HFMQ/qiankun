import moment from 'moment';
import nzh from 'nzh/cn';
import {
  parse,
  stringify
} from 'qs';
import {
  Notify
} from 'quasar';
import {
  Base64
} from '@/utils/base64';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(
        moment(
          `${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`
        ).valueOf() - 1000
      )
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(
      route => route !== item && getRelation(route, item) === 1
    );
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = `${result}万`;
  }
  return result;
}

export function formatSelectDisplay(options, selected, defaultDisplay) {
  let display = defaultDisplay || '请选择';
  let val;
  let option;

  if (!selected) {
    return display;
  }
  if (!Array.isArray(options)) {
    return selected;
  }

  if (Array.isArray(selected)) {
    val = selected.map(sel => (sel.value ? sel.value : sel));
    option = options.filter(option => val.indexOf(option.value) > -1);
    return option;
  }

  val = selected.value ? selected.value : selected;
  option = options.find(option => option.value === val);

  if (!option) {
    return display;
  }
  return option.label;
}

function flatOption(obj, name) {
  if (!obj) {
    return {
      label: '',
      value: ''
    };
  }
  return {
    ...obj,
    label: obj[name],
    value: obj.id
  };
}
export function formatOption(obj, name) {
  name = name || 'name';
  if (Array.isArray(obj)) {
    return obj.map(each => flatOption(each, name));
  }
  return flatOption(obj, name);
}

export function wrapOptionsTotal(options) {
  return [{
      label: '全部',
      value: 'total'
    },
    ...options
  ];
}

export function successNotify(message) {
  let setting = {
    color: 'positive',
    icon: 'check_circle_outline',
    position: 'top',
    classes: 'notify-inline'
  };

  if (typeof message === 'string') {
    setting.message = message;
  } else {
    Object.assign(setting, message);
  }
  Notify.create(setting);
}

export function errorNotify(message) {
  let setting = {
    color: 'negative',
    icon: 'cancel',
    position: 'top'
  };

  if (typeof message === 'string') {
    if (message.includes('未配置映射值')) {
      setting.html = true;
      let msg = '';
      message.split('\n').forEach(rowMsg => {
        msg += `<div>${rowMsg}</div>`;
      });
      setting.timeout = 5000;
      setting.message = msg;
    } else {
      setting.message = message;
    }
  } else {
    Object.assign(setting, message);
  }
  Notify.create(setting);
}

export async function resolveResponseError(request) {
  let response = await request();
  if (response.status !== 'error') {
    return response;
  } else {
    let {
      code,
      msg
    } = response;
    if (code === '502' || code === '503') {
      msg = '系统维护中，请稍后重试...';
    }
    errorNotify(msg);

    const error = new Error(msg);
    error.name = code;
    error.response = response;
    throw error;
  }
}

export function validate(ref) {
  if (Array.isArray(ref)) {
    ref.forEach(each => {
      if (each && each.validate) {
        each.validate();
      }
    });
  } else {
    for (let el in ref) {
      if (ref.hasOwnProperty(el)) {
        if (ref[el].validate) {
          ref[el].validate();
        }
      }
    }
  }
}

export function deepClone(obj) {
  let objClone = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === 'object') {
    for (let key in obj) {
      // 判断obj子元素是否为对象， 如果是，递归复制
      if (obj.hasOwnProperty(key)) {
        objClone[key] = JSON.parse(JSON.stringify(obj[key]));
      } else {
        objClone[key] = obj[key];
      }
    }
  }
  return objClone;
}

export function isValidReleaseDate(beginDate, endDate, addDate = 3) {
  if (beginDate) {
    if (new Date(beginDate) == 'Invalid Date') {
      // 20190426
      beginDate =
        beginDate.slice(0, 4) +
        '-' +
        beginDate.slice(4, 6) +
        '-' +
        beginDate.slice(6, 8);
    }
    beginDate = new Date(beginDate);
  }
  if (endDate) {
    if (new Date(endDate) == 'Invalid Date') {
      endDate =
        endDate.slice(0, 4) +
        '-' +
        endDate.slice(4, 6) +
        '-' +
        endDate.slice(6, 8);
    }
    endDate = new Date(endDate);
  } else {
    endDate = new Date();
    endDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000 * addDate);
  }
  endDate = moment(endDate).format('YYYYMMDD');
  beginDate = moment(beginDate).format('YYYYMMDD');
  return beginDate >= endDate;
}

let groupObj = {};
let parentGroupObj = {};
export function getGroupFullName(groupList, groupId, hasParent, labelAdd) {
  let groupArr = groupList.filter(item => {
    return item.id == groupId;
  });
  groupObj = groupArr.length > 0 ? groupArr[0] : {};
  if (groupObj.parent_id) {
    let parentGroupArr = groupList.filter(item => {
      return item.id == groupObj.parent_id;
    });
    parentGroupObj = parentGroupArr.length > 0 ? parentGroupArr[0] : {};
    groupObj.newLabel = parentGroupObj ?
      parentGroupObj.label + '-' + groupObj.label :
      groupObj.label;
    if (parentGroupObj.parent_id) {
      parentGroupObj.newLabel = parentGroupObj.label + '-' + groupObj.name;
      labelAdd = labelAdd ?
        parentGroupObj.newLabel + '-' + labelAdd :
        parentGroupObj.newLabel;
      return getGroupFullName(
        groupList,
        parentGroupObj.parent_id,
        'hasParent',
        labelAdd
      );
    } else {
      groupObj.newLabel = labelAdd ?
        groupObj.newLabel + '-' + labelAdd :
        groupObj.newLabel;
      return groupObj.newLabel;
    }
  } else {
    if (!hasParent) {
      groupObj.newLabel = groupObj.name;
    } else if (labelAdd) {
      groupObj.newLabel = `${groupObj.name}-${labelAdd}`;
    }
    return groupObj.newLabel;
  }
}

export function getGroupOf2dLabel(groupList, groupId) {
  let groupObj = groupList.find(item => {
    return item.id == groupId;
  });
  if (groupObj.parent_id) {
    let parentGroupObj = groupList.find(item => {
      return item.id == groupObj.parent_id;
    });
    groupObj.label = `${parentGroupObj.name}-${groupObj.label}`;
  }
  return groupObj;
}

// list => [arr1,arr2,obj,string,arr[string],arr[obj]...]
export function getIdsFormList(list) {
  let ids = [];
  if (!Array.isArray(list)) {
    return [];
  }
  list.forEach(arr => {
    if (arr && Array.isArray(arr) && arr.length > 0) {
      arr.map(item => {
        if (item && typeof item === 'object') {
          ids.push(item.id);
        } else if (item && typeof item === 'string') {
          ids.push(item);
        }
        return ids;
      });
    } else if (arr && typeof arr === 'object') {
      ids = arr.id ? ids.concat(arr.id) : ids;
    } else if (arr && typeof arr === 'string') {
      ids.push(arr);
    }
  });
  return ids;
}

export function getBase64queryString(params) {
  let base = new Base64();
  let str = JSON.stringify(params);
  let result = base.encode(str);
  return result;
}

export function appendNode(parent, set, depth) {
  if (!Array.isArray(parent) || !Array.isArray(set)) {
    return [];
  }
  if (parent.length === 0 || set.length === 0) {
    return [];
  }
  if (depth === 0) {
    return parent;
  }
  const child = parent.reduce((pre, next) => {
    const nodes = set.filter(group => group.parent === next.id);
    nodes.forEach(node => (node.header = 'nodes'));

    next.children = nodes;
    return pre.concat(nodes);
  }, []);

  if (child.length > 0) {
    appendNode(child, set, --depth);
  }
  return parent;
}


export function exportExcel(response, filename, format) {
  /* 文件格式 */
  format = format ? format : response.headers['content-type'];
  let file = response.data;

  if (!file.size) {
    file = new Blob([file], {
      type: format
    });
  }

  const reader = new FileReader();
  reader.readAsText(file, 'utf-8');
  reader.onload = () => {
    try {
      const error = JSON.parse(reader.result);
      errorNotify(error.msg);
    } catch {
      /* 文件名 */
      if (!filename) {
        const resFilename = response.headers['content-disposition'];
        filename = decodeURI(
          resFilename.substring(resFilename.indexOf('=') + 1)
        );
      }

      if (isIE()) {
        window.navigator.msSaveOrOpenBlob(file, filename);
      } else {
        const link = document.createElement('a');
        const URL = window.URL.createObjectURL(file);

        link.href = URL;
        link.download = filename;
        document.body.appendChild(link);

        link.click();

        window.URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
        successNotify('下载成功！');
      }
    }
  };
}

export function isIE() {
  return !!window.ActiveXObject;
}
export function addAttribute(data) {
  if (!Array.isArray(data)) {
    return data;
  }
  return data.map(item => {
    return {
      ...item,
      children: addAttribute(item.children)
    };
  });
}

export function goBack() {
  window.history.back();
}