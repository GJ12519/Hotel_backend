/** 这个文件封装了一些常用的工具函数 **/

const tools = {
  /**
   * 保留N位小数
   * 最终返回的是字符串
   * 若转换失败，返回参数原值
   * @param str - 数字或字符串
   * @param x   - 保留几位小数点
   */
  pointX(str: string | number, x = 0): string | number {
    if (!str && str !== 0) {
      return str;
    }
    const temp = Number(str);
    if (temp === 0) {
      return temp.toFixed(x);
    }
    return temp ? temp.toFixed(x) : str;
  },

  /**
   * 去掉字符串两端空格
   * @param str - 待处理的字符串
   */
  trim(str: string): string {
    const reg = /^\s*|\s*$/g;
    return str.replace(reg, "");
  },

  /**
   * 给字符串打马赛克
   * 如：将123456转换为1****6，最多将字符串中间6个字符变成*
   * 如果字符串长度小于等于2，将不会有效果
   * @param str - 待处理的字符串
   */
  addMosaic(str: string): string {
    const s = String(str);
    const lenth = s.length;
    const howmuch = ((): number => {
      if (s.length <= 2) {
        return 0;
      }
      const l = s.length - 2;
      if (l <= 6) {
        return l;
      }
      return 6;
    })();
    const start = Math.floor((lenth - howmuch) / 2);
    const ret = s.split("").map((v, i) => {
      if (i >= start && i < start + howmuch) {
        return "*";
      }
      return v;
    });
    return ret.join("");
  },

  /**
   * 验证字符串
   * 只能为字母、数字、下划线
   * 可以为空
   * @param str - 待处理的字符串
   * **/
  checkStr(str: string): boolean {
    if (str === "") {
      return true;
    }
    const rex = /^[_a-zA-Z0-9]+$/;
    return rex.test(str);
  },

  /**
   * 验证字符串
   * 只能为数字
   * 可以为空
   * @param str - 待处理的字符串
   * **/
  checkNumber(str: string): boolean {
    if (!str) {
      return true;
    }
    const rex = /^\d*$/;
    return rex.test(str);
  },

  /**
   * 正则 手机号验证
   * @param str - 待处理的字符串或数字
   * **/
  checkPhone(str: string | number): boolean {
    const rex = /^1[34578]\d{9}$/;
    return rex.test(String(str));
  },

  /**
 * 正则 身份证验证
 * @param str - 待处理的字符串
 * **/
  checkIDCard(str: string | number): boolean {
    // 正则表达式匹配15位或18位身份证号码  
    // 15位：全部数字  
    // 18位：前17位数字，最后一位可以是数字或X（不区分大小写）  
    const pattern = /^\d{15}|\d{17}(\d|X|x)$/;

    // 使用test方法进行匹配  
    if (!pattern.test(str)) {
      return false;
    }

    // 如果是15位身份证，直接返回true  
    if (str.length === 15) {
      return true;
    }

    // 如果是18位身份证，需要进一步验证最后一位校验码  
    if (str.length === 18) {
      // 提取前17位和最后一位校验码  
      const body = str.substring(0, 17);
      const checkDigit = str.charAt(17).toUpperCase();

      // 18位身份证的校验码计算  
      const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

      let sum = 0;
      for (let i = 0; i < body.length; i++) {
        sum += parseInt(body.charAt(i)) * weights[i];
      }

      return checkCodes[sum % 11] === checkDigit;
    }

    // 如果既不是15位也不是18位，返回false  
    return false;
  },

  /**
   * 正则 邮箱验证
   * @param str - 待处理的字符串
   * **/
  checkEmail(str: string): boolean {
    const rex =
      /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
    return rex.test(str);
  },

  /**
   * 字符串加密
   * 简单的加密方法
   * @param code - 待处理的字符串
   */
  compile(code: string): string {
    let c = String.fromCharCode(code.charCodeAt(0) + code.length);
    for (let i = 1; i < code.length; i++) {
      c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
    }
    return c;
  },

  /**
   * 字符串解谜
   * 对应上面的字符串加密方法
   * @param code - 待处理的字符串
   */
  uncompile(code: string): string {
    let c = String.fromCharCode(code.charCodeAt(0) - code.length);
    for (let i = 1; i < code.length; i++) {
      c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
    }
    return c;
  },

  /**
   * 清除一个对象中那些属性为空值的属性
   * 0 算有效值
   * @param {Object} obj  待处理的对象
   * **/
  clearNull<T>(obj: T): T {
    const temp: any = { ...obj };
    for (const key in temp) {
      if (temp.hasOwnProperty(key)) {
        const value = temp[key];
        if (value === null || value === undefined) {
          delete temp[key];
        }
      }
    }
    return temp as T;
  },
  /* 时间处理，不足半天按半天算，超过半天按一天算 */
  calculateDaysDifference(inputTimeString: string): number {
    const inputTime = new Date(inputTimeString);
    const now = new Date();
    const diffInMilliseconds = now - inputTime;
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)); // 完整的天数  
    const remainingMilliseconds = diffInMilliseconds % (1000 * 60 * 60 * 24); // 剩余毫秒数  
    const remainingHours = Math.floor(remainingMilliseconds / (1000 * 60 * 60)); // 剩余小时数  

    let days = diffInDays;

    // 如果剩余小时数大于半天（12小时），则增加一天  
    if (remainingHours >= 12) {
      days += 1;
    }
    // 如果剩余小时数大于等于半天的一半（6小时），则增加半天  
    else if (remainingHours >= 6) {
      days += 0.5;
    }

    return days;
  },

  // 预定时间段的加减
  comparisontime(stime: string, etime: string): number {
    const Stime = new Date(stime);
    const Etime = new Date(etime);
    const diffInMilliseconds = Etime - Stime;
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)); // 完整的天数  
    const remainingMilliseconds = diffInMilliseconds % (1000 * 60 * 60 * 24); // 剩余毫秒数  
    const remainingHours = Math.floor(remainingMilliseconds / (1000 * 60 * 60)); // 剩余小时数  

    let days = diffInDays;

    // 如果剩余小时数大于半天（12小时），则增加一天  
    if (remainingHours >= 12) {
      days += 1;
    }
    // 如果剩余小时数大于等于半天的一半（6小时），则增加半天  
    else if (remainingHours >= 6) {
      days += 0.5;
    }

    return days;
  }
};


export default tools;
