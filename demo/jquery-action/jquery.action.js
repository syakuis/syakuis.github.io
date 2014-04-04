/**
 * jQuery Action Library
 *
 * Copyright (c) Seok Kyun. Choi. 최석균
 * GNU Lesser General Public License
 * http://www.gnu.org/licenses/lgpl.html
 *
 * registered date 20080327
 * http://syaku.tistory.com
 */


/**
* jQuery Action Core
* @file ja.core.js
* @depends jQuery 1.3.2+
* @brief jQuery Action 공통 라이브러리

 * Copyright (c) 2010 Seok Kyun. Choi. 최석균
 * GNU Lesser General Public License
 * http://www.gnu.org/licenses/lgpl.html
*/

;jQuery.ja || (function($) {

  function ja() {
    this.version = '2.0.9';
    this.lang = 'ko';
    this.regional = { };

    this.regx = {
      'user_id' : function(val) {
        var reg = /^[a-zA-Z]+([_0-9a-zA-Z]+)*$/;
        return reg.test(val);
      }
      , 'dot_ip' : function(val) {
        reg = /^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/; 
        return reg.test(val);
      }
      , 'http_url' : function(val) {
        var reg = /^(http|https|ftp|mms|news|rss):\/\/[0-9a-z-]+(\.[_0-9a-z-\/\~]+)+(:[0-9]{2,4})*$/;
        return reg.test(val);
      }
      , 'url' : function(val) {
        var reg = /^[^(http|https|ftp|mms|news|rss):\/\/][0-9a-z-]+(\.[_0-9a-z-\/\~]+)+(:[0-9]{2,4})*$/;
        return reg.test(val);
      }
      , 'hyphen_contact' : function(val) {
        var reg = /^([0-9]+)*\-/; 
        return reg.test(val);
      }
      , 'replay_contact' : function(val) {
        var regExp = /([0]{3,4}|[1]{3,4}|[2]{3,4}|[3]{3,4}|[4]{3,4}|[5]{3,4}|[6]{3,4}|[7]{3,4}|[8]{3,4}|[9]{3,4})/;
        return !regExp.test(str);
      }
      , 'number' : function(val) {
        var reg = /^[0-9]*$/; 
        return reg.test(val);
      }
      , 'en' : function(val) {
        var reg = /^[a-zA-Z]*$/; 
        return reg.test(val);
      }
      , 'en_number' : function(val) {
        var reg = /^[a-zA-Z0-9]*$/; 
        return reg.test(val);
      }
      , 'en_number_mix' : function(val) {
        var reg = /[a-zA-Z]+/; 
        var reg2 = /[0-9]+/; 

        if (reg.test(val) && reg2.test(val)) {
          return true;
        } else {
          return false;
        }
      }
      , 'email' : function(val) {
        var reg = /^[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+)*@[0-9a-zA-Z-]+\.[\.0-9a-zA-Z-]+$/;
        return reg.test(val);
      }
      , 'notnull' : function(val) {
        return !$.ja.isEmpty(val);
      }

    };
  }

  // settings
  $.extend(ja.prototype, {
    /**
    * @func xmldoc(xmlpath) return object
    * @brief xml 문서를 브라우저에 맞게 불러온다.
    */
      xmldoc : function(xml) {
      var obj;

      if ($.browser.msie || $.browser.mozilla) {
        obj = this.xmlDocument();
        obj.async = false;
        obj.load(xml);
        return obj.documentElement;
      } else {
        obj = this.xmlHttpRequest();
        obj.open('GET',xml,false);
        obj.send(null);
        return obj.responseXML.documentElement;
      }

      return null;
    }

    /**
    * @func xmlDocument() return object
    * @brief XMLDOM 객체를 생성한다.
    */
    , xmlDocument : function() {
      if (document.implementation && document.implementation.createDocument) {
        return document.implementation.createDocument('','',null);
      } else if (typeof ActiveXObject != 'undefined') {
        try {
          return new ActiveXObject("Msxml2.DOMDocument");
        }
        catch (e) {
          return new ActiveXObject("Msxml.DOMDocument");
        }
      }
      return null;
    }

    /**
    * @func xmlHttpRequest() return object
    * @brief XMLHTTP 객체를 생성한다.
    */
    , xmlHttpRequest : function() {
      if (window.ActiveXObject) {
        try {
          return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
          return new ActiveXObject("Msxml.XMLHTTP");
        }
      }
      else if (window.XMLHttpRequest) { return new XMLHttpRequest(); }
      else { return null; }
    }

    /**
     * @func replaceAll(value,value,value) return value
     * @brief 문자열 치환
     */
    , replaceAll : function(val,str,change) {
      try { return val.split(str).join(change); }
      catch (e) { alert(e); }
    }

    /**
     * @func isEmpty(value) return boolean
     * @brief 빈값 여부 확인
     */
    , isEmpty : function(val) {
      var is_type = typeof val;

      if(val == null || val == undefined) { return true; }
      else if(is_type == 'string') {
        val = this.replaceAll(val,/\s+/g,'');
        if(val == '') { return true; }
      }

      return false;
    }

    /**
     * @func defString(value,value) return value
     * @brief 빈값을 원하는 값으로 치환
     */
    , defString : function(val,str) {
      return (this.isEmpty(val)) ? str : val;
    }

    /**
    * @func params2json(string) return json
    * @brief 파라메터형 문자열을 받아 json 으로 변형하여 반환한다. name=value 를 { name : name , value : value }
    */
    , params2json : function(query) {
      query = query.replace(/^&|\?/,'').split('&');
      var cnt = query.length;

      var obj = [];

      for (var i = 0; i < cnt; i++) {
        var pattern = query[i].split('=');
        obj[i] = {name : pattern[0] , value : unescape(pattern[1])};
      }

      return obj;
    }

    /**
    * @func getType(string) return string
    * @brief 크로스브라우징을 위해 관련된 INPUT TYPE을 하나로 통합한다.
    */
    , getCrossType : function(type) {
      switch(type) {
        case 'select' :
        case 'select-one' :
        case 'select-multiple' :
           return 'select';
        break;
        case 'checkbox' :
          return 'checkbox';
        break;
        case 'radio' :
          return 'radio';
        break;
        case 'text' :
        case 'hidden' :
        case 'password' :
        case 'textarea' :
        case 'number' :
          return 'text';
        break;
        default :
          return type;
        break;
      }
    }

    /**
    * @func getElement(string | element) return element
    * @brief document 의 엘리먼트를 찾아 반환한다.
    */
    , getElement : function(target) {
      return (typeof target == 'string') ? $(target) : target;
    }
    
    , getElementType : function(target) {
      target = this.getElement(target);
      var type = target.attr('type');
      
      if (type == undefined) {
        if (target.is('select')) {
          type = 'select';
        }
      } else {
        type = this.getCrossType(type);
      }
      
      return type;
    }

    /**
    * @func getValue(string | element) return string | array
    * @brief 엘리먼트의 값을 알아온다.
    */
    , getValue : function(target) {
      var value = null;

      target = this.getElement(target);
      switch (target.attr('type')) {

        case 'checkbox' :
        case 'radio' :
          var count = target.length;

          if (this.isEmpty(count)) {
            if (target.attr('checked')) {
              value = target.val();
            }
          } else {
            value = [];
            for (var i = 0; i < count;i++) {
              if (target[i].checked) {
                value.push(target[i].value);
              }
            }

            if ( value.length == 1) value = value[0];
          }

        break;
        default : value = target.val(); break;
      }

      return value;
    }

    /**
    * @func setValue(string | element , value | array)
    * @brief 엘리먼트의 값을 삽입한다.
    */
    , setValue : function(target,value) {
      target = this.getElement(target);
      var type = this.getElementType(target);
      switch (type) {
        case 'checkbox' :
        case 'radio' :
          var count = target.length;
          if (this.isEmpty(count)) {
            if (target.val() == value) {
              target.attr('checked',true);
            } else {
              target.attr('checked',false);
            }
          } else {
            var val_count = value.length;
            for (var i = 0; i < count;i++) {

              if (!this.isEmpty(val_count) && target.attr('type') == 'checkbox') {

                for (var x = 0; x < val_count;x++) {
                  if (target[i].value == value[x]) {
                    target[i].checked = true;
                  }
                }
                
              } else {
                if (target[i].value == value) {
                  jQuery(target[i]).attr('checked',true);
                }

              }

            }

          }

        break;
        
        case 'select' :
          if ( jQuery('option',target).is('[value=' + value + ']')) target.val(value); 
        break;

        default : target.val(value); break;
      }

    }

    /**
    * @func setValues(element | string ,object)
    * @brief 여러 엘리먼트의 값을 삽입한다. (다시정의 : 20100917)
    */
    , setValues : function(form,values) {
      form = this.getElement(form);

      var reg = /^#/;
      $.each(values, function(i, field){
        var name = field.name;
        name = (!reg.test(name)) ? '#' + name : name;

        var target = $(name,form);
        $.ja.setValue(target,field.value);
      });

    }


    /**
    * @func isRegnum(value) return boolean
    * @brief 대한민국 주민등록번호가 올바른지 판단한다.
    */
    , isRegnum : function(val) {
      val = val.replace(/[^0-9]+/g,'');

      var count = 1;
      var total = 0;

      for (var i =0; i < 12; i++) {
          if (count > 8) {
            count = 1;
            count++;
          } else {
            count++;
          }

          total +=parseInt(val.charAt(i))*count;
      }

      var mod = total%11;
      var check = 11 - mod;

      if (check == 10) { check = 0; }
      if (check == 11) { check = 1; }

      if (check == parseInt(val.charAt(12))) { return true; }
      else { return false; }
    }

    /**
    * @func isSelected( string|element , min|max , number|* ) return boolean
    * @brief 엘리먼트 선택수와 선택 요구수를 비교한다.
    */
    , isSelected : function(ele,mode,ea) {
      try {

        ele = this.getElement(ele);
        var count = ele.length;

        // 관련 엘리먼트의 조건이 성립하는 수
        var num = 0;

        for (var i = 0; i < count;i++) {
          var type = this.getCrossType(ele[i].type);
          switch (type) {
            case 'checkbox' :
            case 'radio' :
              if (ele[i].checked == true) { num++; }
            break;
            case 'select' :
              if (ele[i].selected == true) { num++; }
            break;
            default :
              if (!this.isEmpty(ele[i].value)) { num++; }
            break;
          }
        }

        switch (mode) {
          case 'min' :
            if (ea == '*' && count == num) { return true; }
            if (parseInt(ea) <= num) { return true; }
          break;
          case 'max' :
            if (ea == '*' && count == num) { return true; }
            if (parseInt(ea) >= num) { return true; }
          break;
        }

        return false;

      } catch (e) {
        alert('isSelected : ' + e);
        return false;
      }

    }

    /**
    * @func isCount(min|max|min_length|max_length , number , string ) return boolean
    * @brief 문자열 최대 길이와 최소길이를 판단한다.
    */
    , isCount : function(mode,num,val) {
      try {

        val = new String(val); 
        var len_val = val.length;
        if (len_val == 0) { return true; }

        num = parseInt(num);

        switch(mode) {
          case 'min_length' : 
          case 'min' :
            return (len_val >= num);
          break;
          case 'max_length' :
          case 'max' :
            return (len_val <= num);
          break;
        }

      } catch (e) {
        alert('isCount : ' + e);
      }

      return false;
    }

    /**
    * @func href(value) event
    * @brief url 로 이동한다.
    */
    , href : function(url) {
      document.location.href = url;
    }

    /**
    * @func isReg(string,value) return boolean
    * @brief 정규표현식을 이용하여 문자열을 판단한다.
    */
    , isReg : function(filter,val) {
      try {
        var o = eval("$.ja.regional.regx." + filter);
        return o(val);
      } catch (e) { return alert(e); true; }
    }

    /**
    * @func date(string,string) return string
    * @brief 문자열 날짜를 임의의 포맷으로 변환후 반환한다.
    * $1 년 $2 월 $3 일 $4 시 $5 분 $6초
    */
    , date : function(format,date) {
      date = date.replace(/[-_:.\/\s]/,'-');
      var reg = /([0-9]{0,4})[-]{0,1}([0-9]{0,2})[-]{0,1}([0-9]{0,2})\s{0,1}([0-9]{0,2})[-]{0,1}([0-9]{0,2})[-]{0,1}([0-9]{0,2})(.*)$/;
      return date.replace(reg,format);
    }

    , setCookie : function(name, value, expires, path, domain, secure) {
      var todayDate = new Date();
      todayDate.setDate(todayDate.getDate() + expires);

      var curCookie = name + "=" + escape(value) +
      ((expires) ? "; expires=" + todayDate.toGMTString() : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
      document.cookie = curCookie;
    }

    , getCookie : function(name) {
      var dc = document.cookie;
      var prefix = name + "=";
      var begin = dc.indexOf("; " + prefix);
      if (begin == -1) {
       begin = dc.indexOf(prefix);
       if (begin != 0) return null;
      } else
       begin += 2;
      var end = document.cookie.indexOf(";", begin);
      if (end == -1)
       end = dc.length;
      return unescape(dc.substring(begin + prefix.length, end));
    }
    

    /**
    * @func dateFormat(string,date) return string
    * @brief 날짜형식을 포맷으로 변환후 반환한다.
    yy - year (two digit)
    yyyy - year (four digit)
    m - month of the year (no leading zero)
    mm - month of the year (two digit)
    M - month name short
    MM - month name long
    d - day of the month (no leading zero)
    dd - day of the month (two digit)
    D - day name short
    DD - day name long
    */
    , dateFormat : function(format,date) {
      var monthNames = $.ja.regional.action.date.month;
      var monthNamesShort = $.ja.regional.action.date.month_short;
      var dayNames = $.ja.regional.action.date.day;
      var dayNamesShort = $.ja.regional.action.date.day_short;

      date = date || null;

      var reg = '';
      if (date == null) {
        date = new Date();
      }
      
      var year,month,day;

      reg = /yyyy/g;
      if (reg.test(format)) {
        format = format.replace(reg,date.getFullYear());
      }

      reg = /yy/g;
      if (reg.test(format)) {
        year = String(date.getFullYear()).substring(2);
        format = format.replace(reg,year);
      }

      reg = /mm/g;
      if (reg.test(format)) {
        month = this.leftPad(date.getMonth()+1,2,'0');
        format = format.replace(reg,month);
      }

      reg = /m/g;
      if (reg.test(format)) {
        month = date.getMonth()+1;
        format = format.replace(reg,month);
      }

      reg = /MM/g;
      if (reg.test(format)) {
        month = monthNames[date.getMonth()];
        format = format.replace(reg,month);
      }

      reg = /M/g;
      if (reg.test(format)) {
        month = monthNamesShort[date.getMonth()];
        format = format.replace(reg,month);
      }

      reg = /dd/g;
      if (reg.test(format)) {
        day = this.leftPad(date.getDate(),2,'0');
        format = format.replace(reg,day);
      }

      reg = /d/g;
      if (reg.test(format)) {
        day = date.getDate();
        format = format.replace(reg,day);
      }

      reg = /DD/g;
      if (reg.test(format)) {
        day = dayNames[day.getDay()];
        format = format.replace(reg,day);
      }

      reg = /D/g;
      if (reg.test(format)) {
        day = dayNamesShort[day.getDay()];
        format = format.replace(reg,day);
      }

      return format;
    }

    /**
    * @func hyphen(element,contact|zipcode|jumin|calendar,string)
    * @brief 자동으로 임의의 문자열을 삽입한다.
    */
    , hyphen : function(ele,mode,str) {
      ele = this.getElement(ele);
      if (this.isEmpty(str)) str = '-';
      var val = ele.val();
      val = this.replaceAll(val,str,'');
      var len = val.length;

      var reg;

      if (len > 4) {

        switch (mode) {
          case 'contact' :
            reg = /(^02|031|032|033|041|042|043|051|052|053|054|055|061|062|063|064|060|070|080|010|011|012|013|014|015|016|017|018|019)([0-9]{3,4})([0-9]{1,4})$/;
            if (reg.test(val)) { 
              reg.exec(val,"g");
              var val1 = RegExp.$1;
              var val2 = RegExp.$2;
              var val3 = RegExp.$3;
              var val_len = val2 + val3;
              if (val_len.length == 7) {
                val = val1 + str +  val_len.substring(0,4) + str +  val_len.substring(4,7);
              } else {
                val = val1 + str +  val2 + str +  val3;
              }
            }
          break;
          case 'zipcode' : 
            reg = /(^[0-9]{3})([0-9]{3})$/;
            if (reg.test(val)) {
              reg.exec(val,"g");
              val = RegExp.$1 + str + RegExp.$2;
            }
          break;
          case 'jumin' : 
            reg = /(^[0-9]{6})([0-9]{7})$/;
            if (reg.test(val)) {
              reg.exec(val,"g");
              val = RegExp.$1 + str + RegExp.$2;
            }
          break;
          case 'calendar' : 
            reg =  /(^[0-9]{4})([0-9]{1}[0-2]{0,1})([0-3]{0,1}[0-9]{1})$/;
            if (reg.test(val)) {
              reg.exec(val,"g");
              var val1 = RegExp.$1;
              var val2 = RegExp.$2;
              var val3 = RegExp.$3;
              var val_len = val2 + val3;
              if (parseInt(val2) > 12) { val2 = val_len.substring(0,1); val3 = val_len.substring(1,val_len.length);}
              if (val2.length < 2) { val2 = '0' + val2; }
              if (val3.length < 2) { val3 = '0' + val3; }
              val = val1 + str + val2 + str + val3;
            }
          break;
        }

        ele.val(val);
      }
    }

    /**
    * @func checked(element,boolean)
    * @brief 모든 체크박스를 선택한다.
    */
    , checked : function(target,is,obj) {
      if (this.isEmpty(is) || is == false) {
        if (confirm($.ja.regional.action.question.checkbox_change['#cdata'])) { is = true; }
      }

      var cnt = $(target).length;
      $(target).each(function (i) {
        if (!$.ja.isEmpty(obj)) {
          this.checked = $(obj).attr("checked");
        } else {
          (this.checked == true && is) ? this.checked = false : this.checked = true;
        }

      });
    }

    /**
    * @func result(object)
    * @brief 결과를 받아 처리한다.
    */
    , result : function(ja) {
      if (!this.isEmpty(ja.message)) { 

        switch (ja.display) {
          case 'alert' :
            alert(ja.message);
          break;
          case 'right-span' : 
            var show = ja.target.parent();

            if (!$('span',show).is('span')) {
              ja.target.after(" <span class='right-span'>" + ja.message + "</span>");
            } else {
              $('span',show).text(ja.message);
            }
          break;
          default : 
            if (/^(\#|\.|\:)/g.test(ja.display)) {
              $(ja.display).text(ja.message).show();
            }
          break;
        }
      }

      switch (ja.action) {
        case 'focus' :
          if (ja.target.attr('type') != 'hidden') { ja.target.focus(); }

        break;
        case 'url' :
          location.href = ja.source;
        break;
        case 'javascript' :
          eval(ja.source);
        break;
      }
    }

    , get_result : function(options) {
      var xml = options.data;
      var afterSend =options.afterSend;

      var error = $.ja.defString($(xml).find('error').text(),"false");
      var ja = {
          message : $(xml).find('message').text() 
        , error : error
        , action : $(xml).find('action').text() 
        , source : $(xml).find('source').text() 
        , target : $(xml).find('target').text()
        , display : $(xml).find('display').text() 
      };
      
      var con = true;

      if (error == 'false') {
        if ($.isFunction(afterSend)) {
          con = afterSend(xml); // 반환이 false 인 경우 종료.
        }
      }

      if (con) {
        $.ja.result(ja);
      }

      return eval(error);

    }

    /**
    * @func nudeHtml(string) return string
    * @brief HTML 소스에서 문자열을 제외하고 모두 지워서 반환한다.
    */
    , nudeHtml : function(source) {
      source = source.replace(/\&nbsp;/ig,' ');
      var reg = /(<{1}\/{0,1})[^<>]*(\/{0,1}>{1})/ig;
      return source.replace(reg,'');
    }

    /**
    * @func leftPad(string,int,char) return string
    * @brief 반복수만큼 왼쪽에 문자를 채워서 반환한다.
    */
    , leftPad : function(str,repeat,chr) {
      var ext = '';
      var count = String(str).length;

      count = (repeat+1) - count;
      if (count <= 0) { return str; }

      for (var i = 1; i < count; i++) {
        ext += chr;
      }

      return ext + str;
    }

    /**
    * @func offset(int,int,layer|popup) return object
    * @brief 해당 엘리먼트를 기준으로 offset 값을 반환한다.
    */
    , offset : function(w,h,m) {
      var width = 0;
      var height = 0;

      var obj = {width:0 , height:0 , scrollTop:0 , scrollLeft:0 , scrollWidth:0 , scrollHeight:0 , top:0 , left:0};

      // 현재 화면의 크기
      var dom = document.documentElement;
      var doc = $(document);

      try {

        if ($.browser.msie) {
          obj.width = parseInt(dom.offsetWidth);
          obj.height = parseInt(dom.offsetHeight);
        } else {
          obj.width = parseInt(window.innerWidth);
          obj.height = parseInt(window.innerHeight);
        }

      } catch (e) { // ie6
        obj.width = doc.width();
        obj.height = doc.css('height','100%').height();
      }

      // 스크롤의 위치
      if ($.browser.msie && Number($.browser.version) < 9) {
        obj.scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
        obj.scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
      } else {
        obj.scrollLeft = parseInt(doc.scrollLeft());
        obj.scrollTop = parseInt(doc.scrollTop());
      }

      // 현재 화면의 전체 크기 (스크롤 포함)
      if ($.browser.msie) { // 20 오차발생
        obj.scrollWidth = parseInt(doc.width()) - 20;
      } else {
        obj.scrollWidth = parseInt(doc.width());
      }
      obj.scrollHeight = parseInt(doc.height());

      // 모니터 중앙에 위치 값
      if (m == 'layer') {
        // 레이어창
        if (w > 0) obj.left = (obj.width - w)/2 + obj.scrollLeft;
        if (h > 0) obj.top = (obj.height - h)/2 + obj.scrollTop;
      } else {
        // 팝업창
        if (w > 0) obj.left = parseInt((obj.width - w)/2);
        if (h > 0) obj.top = parseInt((obj.height - h)/2);
      }

      if (obj.left < 0){ obj.left = -obj.left; }
      if (obj.top < 0){ obj.top = -obj.top; }

      return obj;
    }

    /**
    * @func popup(options)
    * @brief 팝업창을 호출한다.
    */
    , popup : function(options) {
      option = {
          url : null
        , name : null
        , width : 100
        , height : 100
        , scrollbars : 'no'
        , resizable : 'no'
        , toolbar : 'no'
        , directories : 'no'
        , top : 0
        , left : 0
        , status : 'no'
        , menubar : 'no'
        , center : false // 팝업창 호출을 중간에 할 경우
      };

      $.extend(option,options);

      if (!this.isEmpty(option.url)) { 

        // 위치 측정 후 top 과 left 적용
        if (option.center == true) {
          var xy = this.offset(option.width,option.height,"popup");
          option.top = xy.top;
          option.left = xy.left;
        }

        window.open(
            option.url
          , option.name
          , "width=" + option.width 
          + ",height=" + option.height 
          + ",scrollbars=" + option.scrollbars 
          + ",resizable=" + option.resizable 
          + ",toolbar=" + option.toolbar 
          + ",directories=" + option.directories 
          + ",status=" + option.status 
          + ",menubar=" + option.menubar 
          + ",top=" + option.top 
          + ",left=" + option.left
        );

      }
    }

    /**
    * @func layer(options)
    * @brief 레이어화면을 호출한다.
    */
    , layer : function(options) {
      o = {
          target : 'ja' // 레이어 id 명
        , width : 100
        , height : 100
        , top : 0
        , left : 0
        , type : 'iframe' // iframe | html
        , source : ''
        , open : true // 활성화 여부
        , center : false  // 레이어 위치를 중간에 할 경우
        , bgshow : true // 배경 활성화 여부
        , bgcolor : '#aaaaaa' // 배경색
        , reload : false // 프레임url 새로고침 여부
      };

      $.extend(o,options);

      var body = $(document.body);
      var ele = "#" + o.target;
      var t = $(ele,body);
      var b = $('#layer_bg',body);
      var ifr = null;
      var xy = this.offset(o.width,o.height,"layer");

      if (!b.is('#layer_bg')) {
        var w = xy.scrollWidth;
        var h = xy.scrollHeight;

        body.append("<div id='layer_bg' class='layerBg'></div>");
        b = $('#layer_bg',body);
        b.css('width',w);
        b.css('height',h);
        b.css('background',o.bgcolor);
      }

      b.hide();

      if (!t.is(ele)) {
        body.append("<div id='" + o.target + "'></div>");
        t = $(ele,body);
        t.css('position','absolute');
        t.css('width',o.width);
        t.css('height',o.height);
        t.css('z-index','1002');

        if (o.type == 'iframe') {
          t.append("<iframe id='ifr_" + o.target + "' frameborder='0' width='100%' height='100%' src='" + o.source + "'></iframe>");
        } else {
          t.append(o.source);
        }
      }

      t.hide();

      if (o.open) {
        if (o.reload) $('#ifr_' + o.target , t).attr('src',o.source);
        if (o.bgshow) b.show();

        // 위치 측정 후 top 과 left 적용
        if (o.center == true) {
          o.top = xy.top;
          o.left = xy.left;
        } else {
          o.top = parseInt(xy.scrollTop);
          o.left = parseInt(xy.scrollLeft);
        }

        t.css('top',o.top);
        t.css('left',o.left);

        t.show();
      }
    }

    , url2Json : function(url) {
      var domain = 'http://' + document.domain + '/';
      url = jQuery.ja.isEmpty(url) ? document.URL : url;
      url = url.replace(domain,'');
      var obj = {};
      obj['domain'] = domain;
      var url_div = url.split('?');
      var host = (url_div.length > 0) ? url_div[0] : null;
      obj['host'] = host;

      var parameter = (url_div.length > 1) ? url_div[1] : null;
      obj['parameter'] = parameter;
      if (parameter != null) {
        parameter_div = parameter.split('&');
        var parameter_count = parameter_div.length;
        
        for (var i = 0; i < parameter_count; i++) {
            var pattern = parameter_div[i].split('=');
            obj[pattern[0]] = pattern[1];
        }

      }

      return obj;
    }

    // loading show layer
    , _loading : function(mode,target) {
        
      if ($.ja.isEmpty(target)) {
        target = '#loading';
        if (!$("body " + target).is(target)) {
          var source = $($.ja.regional.action.loading.source_nuli['#cdata']);
          $('body').append(source);
        }
      }

      target = $(target);

      $('.contents',target).html($.ja.regional.action.loading.wait['#cdata']);

      var xy = this.offset(target.width(),target.height(),"layer");

      if (mode == 'hidden') {
        target.remove();
      } else if (mode == 'center') {
        target.css('left',xy.left);
        target.css('top',xy.top);
        target.show();
      } else if (mode == 'customer') {
        target.show();
      } else {
        target.css('left',"10px");
        target.css('top',xy.scrollTop + 10);
        target.show();
      }

    }

    , _loading_show : function(loading_target,mode) {
      $(document).bind('ajaxStart', function() {
        jQuery.ja._loading(mode,loading_target);
      }).bind('ajaxStop', function() {
        jQuery.ja._loading('hidden',loading_target);
      });
    }

    // settings
    , setDefaults : function(settings) {
      $.extend(true,this,settings);
      return this;
    }

  });

  $.ja = new ja(); // Singleton instance

})(jQuery);

/**
* jQuery Action 1.0.0
* @file ja.action.js
* @depends ja.core.js , ja.filter.js
* @brief 폼전송처리

* Copyright (c) 2010 Seok Kyun. Choi. 최석균
* GNU Lesser General Public License
* http://www.gnu.org/licenses/lgpl.html
*/

(function($) {

  // settings
  $.jaAction = {
      _default : { 
        send : 'ajax' // ajax | submit

      , form : null // form element (stter is not.)
      , formAttr : null // form attr changes
      , formAttrAction : '?' // form attr action (stter is not.)
      , formAttrMethod : 'get' // form attr method (stter is not.)
      , filter : null // input filtering
      , result : { } // action result (stter is not.)
      , prepare : null // only function
      , beforeAction : null // only function
      , beforeSend : null // only function
      , afterSend : null // only function and ajax
      , ajaxComplete : null // only function and ajax
      , values : null // input setValues
      , direct : null // direct parameter only, ajax only
      , param : null // parameter append, ajax or submit method get only
      , redirect : null // ajax is succes. redirect url, ajax only
      , rollback : { form : '' , input : '' } // input or form attr value rollback (stter is not.)
      , ask : '' // "confirm alert" message (ask or ask_msg)
      , ask_msg : '' // "confirm alert" custom message (ask or ask_msg)

      , loading : true // show loading layer and ajax
      , loading_mode : ''
      , loading_target : null

      , setAjax : { // jQuery ajax setting
          dataType : 'xml'
        , success : function(xml) {
          $.jaAction._reset();
          var redirect = $.jaAction.redirect;
          var error = $.ja.defString($(xml).find('error').text(),$.jaAction.result.error);
          var action = $.ja.defString($(xml).find('action').text(),$.jaAction.result.action);
          var source = $.ja.defString($(xml).find('source').text(),$.jaAction.result.source);
          var message = $.ja.defString($(xml).find('message').text(),$.jaAction.result.message);
          if (error == 'false') {
            if (!$.ja.isEmpty(redirect)) {
              action = 'url';
              source = redirect;
            }
          }

          $.extend($.jaAction.result , {
              message : message 
            , error : error 
            , action : action 
            , source : source 
            , target : $.ja.defString($(xml).find('target').text(),$.jaAction.result.target) 
            , title : $.ja.defString($(xml).find('title').text(),$.jaAction.result.title) 
            , display : $.ja.defString($(xml).find('display').text(),$.jaAction.result.display) 
          });

          $.ja.result($.jaAction.result);

          if (error == 'false') {
            // ajax complete function
            if ($.isFunction($.jaAction.afterSend)) {
              $.jaAction.afterSend($.jaAction);
            }
          }

          if ($.isFunction($.jaAction.ajaxComplete)) {
            $.jaAction.ajaxComplete($.jaAction);
          }

        }
      }

    }

      , _reset : function() {
        this.result = {
            message : '' 
          , error : 'false' 
          , action : '' 
          , source : '' 
          , target : '' 
          , title : '' 
          , display : '' 
        }
      }

    // form attr change
    , _formAttr : function() {

      if (this.formAttr != null) {
        var config = $.ja.params2json(this.formAttr);
        for (var i in config) { 
          this.rollback.form += '&' + config[i].name + '=' + this.form.attr(config[i].name);
          this.form.attr(config[i].name,config[i].value);
        }
      }

      this.formAttrAction = $.ja.defString(this.form.attr('action'),this.formAttrAction);
      this.formAttrMethod = $.ja.defString(this.form.attr('method'),this.formAttrMethod);
    }

    // input setValues
    , _values : function() {
      if (this.values == null) { return; }
      if (typeof this.values == 'string') this.values = $.ja.params2json(this.values);
      this.setValues(this.form,this.values);
    }

    // input value load
    , _parameter : function() {
      var parameter = this.direct;

      if (parameter == null) {
        parameter = $(':input',this.form).serialize();

        // 정적 파라메터 추가
        if (this.param != null) {
          parameter = parameter + '&' + this.param;
        }

      }

      return parameter;
    }

    , setValues : function(form,values) {
      $.each(values, function(i, field){
        var target = $('#'+field.name,form);
        $.ja.setValue(target,field.value);
      });

      return form;
    }

    , paramCreateInput : function(form,param) {
      if (typeof form == 'string') form = jQuery(form);
      if (typeof param == 'string') param = $.ja.params2json(param);
      if (param == null) { return; }
      $.each(param, function(i, field){
        var target = $('#'+field.name,form);
        if (!target.is('#'+field.name)) {
          $('<input type="hidden" />').attr('id',field.name).attr('name',field.name).attr('value',field.value).appendTo(form);
        }
      });
    }
    , paramRemoveInput : function(form,param) {
      if (param == null) { return; }
      if (typeof form == 'string') form = jQuery(form);
      if (typeof param == 'string') param = $.ja.params2json(param);

      $.each(param, function(i, field){
        var target = $('#'+field.name,form);
        if (!target.is('input')) {
          target.remove();
        }
      });
    }

    // confirm
    , _question : function(is) {
      if (!is) { return false; }
      var question = $('#ask',this.form).val() || this.ask;
      var isQuestion = !$.ja.isEmpty(question);
      var isAskMsg = !$.ja.isEmpty(this.ask_msg);

      if ((isAskMsg || isQuestion) && is == true) { 
        if (isQuestion) { question = eval("$.ja.regional.action.question." + question + "['#cdata']"); }
        if (isAskMsg) { question = this.ask_msg; }
        if (!confirm(question)) return false; 
      }
      return true;
    }

    // input or form attr rollback
    , _rollback : function() {
      try {
        // 롤백
        this.setValues(this.form,this.rollback.input);

        // 폼 속성 롤백
        if (this.rollback.form != null) {
          var config = $.ja.params2json(this.rollback.form);
          for (var i in config) { 
            this.form.attr(config[i].name,config[i].value);
          }
        }

        if (this.send == 'submit') {
          this.paramRemoveInput(this.form,this.param);
        }
      } catch (e) { }
    }

    // ajax
    , _ajax : function() {

      $.ajaxSetup(this.setAjax);

      var obj = this;

      $.ajax({
          url: this.formAttrAction
        , type: this.formAttrMethod
        , data: this._parameter()
        , error : function(xhr, status, error) {
          if (xhr.readyState != 4 && xhr.status != 200) {
            alert($.ja.regional.action.message.error['#cdata'] + "\n[ajax error]" + xhr.readyState + "JA" + xhr.status);
          }
        }
      });

    }

    // submit()
    , _submit : function() {
        this.form.submit();
    }

    // jaAction init
    , _init : function() {

      this._reset();

      var commit = true;
      this._formAttr();

      if ($.isFunction(this.prepare)) {
        this.prepare(this);
      }

      this.rollback.input = $(':input',this.form).serializeArray();
      this._values();

      // 액션이 시작되기전에 호출
      if ($.isFunction(this.beforeAction)) {
        if (this.beforeAction(this) == false) {
          this._rollback();
          return this;
        }
      }

      if (this.filter != null) {
        this.result = $(this.form).jaFilter({ filter : this.filter });
        commit = !this.result.error;
      }

      // 질문 출력 여부 확인
      commit = this._question(commit);

      if (commit) {
        
        // 액션이 전송되기 전에 호출
        if ($.isFunction(this.beforeSend)) {
          if (this.beforeSend(this) == false) {
            this._rollback();
            return this;
          }
        }

        if (this.send == 'submit') {
          this.paramCreateInput(this.form,this.param);
          this._submit();
        } else {

          // 로딩표시
          if (this.loading) {
            var obj = this;
            $(document).bind('ajaxStart', function() {
              jQuery.ja._loading(obj.loading_mode,obj.loading_target);
            }).bind('ajaxStop', function() {
              jQuery.ja._loading('hidden',obj.loading_target);
            });
          }
          this._ajax();
        }

      }

      this._rollback();
    }

    , setDefaults : function(settings) {
      $.extend(true,$.jaAction._default,settings);
      return this;
    }
  };

  // proc
  $.fn.jaAction = function(options) {

    $.extend($.jaAction,$.jaAction._default,{form : this},options);
    $.jaAction._init();

  };

})(jQuery);

/**
* jQuery Action Filter
* @file ja.filter.js
* @depend : ja.core.js
* @brief 폼데이터 유효성검사

* Copyright (c) 2010 Seok Kyun. Choi. 최석균
* GNU Lesser General Public License
* http://www.gnu.org/licenses/lgpl.html
*/
(function($) {
  $.jaFilter = {
      form : null
    , filter : null
    , target : null
    , params : null
    , value : null
    , type : null
    , ja : null
    , message : null
    , func_msg : null

     , _params2json : function(param) { // jaFilter only
        param = param.replace(/^&|^\?/,'').split('&');
        var count = param.length;

        var obj = {go : [] , message : 'message' ,title : '' , display : 'alert' };

       if (jQuery.ja.isEmpty(param)) { return obj; }

        for (var i = 0; i < count; i++) {
          var pattern = param[i].split('=');
          var filter = pattern[0];
          var value = pattern[1];

          switch (filter) {
            case 'message' : obj['message'] = value; break;
            case 'title' : obj['title'] = value; break;
            case 'display' : obj['display'] = value; break;
            default :
              obj['go'][i] = { filter : filter , value : value };
            break;
          }
        }

        return obj;
     }

    // ja sync
    , _checkbox : function(filter,value) {
      var ele_checked = this.target.attr('checked');
      switch (this.type) {
        case 'radio' :
        case 'checkbox' :
          if (filter == 'notnull') { if (ele_checked == false) { this.ja.error = false; } }
          if (filter == 'null') { if (ele_checked == true) { this.ja.error = false; } }
        break;
        default :
          if (filter == 'notnull') { if (!$.ja.isEmpty(value)) { this.ja.error = false; } }
          if (filter == 'null') { if ($.ja.isEmpty(value)) { this.ja.error = false; } }
        break;
      }
    }
    , _filter : function(filter,value) {
      var go_node = '';
      this.ja.error = !$.ja.isReg(value,this.value);
      if (value == 'notnull') { 

        switch (this.type)
        {
          case 'text' : this.ja.message = $.ja.regional.action.filter.notnull['#cdata']; break;
          default : this.ja.message = $.ja.regional.action.filter.select['#cdata']; break;
        }

      }
      else { this.ja.message = eval("$.ja.regional.action.filter." + value + "['#cdata']"); }
      this.ja.message = (this.ja.error) ? this.ja.message : '';
    }

    , _minSelected : function(filter,value) { // 최소 선택수 체크

      var is = (value != 0) ? $.ja.isSelected(this.target,'min',value) : true;

      if (!is) {
        this.ja.error = true;
        this.ja.message = $.ja.regional.action.filter.min_select['#cdata'];
        this.ja.message = this.ja.message.replace('{$min}',value);
      }

    }

    , _maxSelected : function(filter,value) { // 최대 선택수 체크

      var is = (value != 0) ? $.ja.isSelected(this.target,'max',value) : true;

      if (!is) {
        this.ja.error = true;
        this.ja.message = $.ja.regional.action.filter.max_select['#cdata'];
        this.ja.message = this.ja.message.replace('{$max}',value);
      }

    }

    , _selected : function(filter,value) { // 선택수 체크
      var reg = /^[0-9*]+,[0-9*]+$/;

      if (reg.test(value)) {
        var div_value = value.split(',');
        var min = div_value[0];
        var max = div_value[1];
      } else {
        var min = value;
        var max = 0;
      }

      var ret_min = (min != 0) ? $.ja.isSelected(this.target,'min',min) : true;

      reg = /^[0-1]{1}$/;
      var reg2 = /^[0-9]+$/;

      if (!ret_min) {
        this.ja.error = true;
        if (reg.test(value)) { this.ja.message = $.ja.regional.action.filter.select['#cdata']; }
        else if (reg2.test(value)) { // ~ {$num} 개를 선택하세요.
          this.ja.message = $.ja.regional.action.filter.num_select['#cdata']; 
          this.ja.message = this.ja.message.replace('{$num}',min); // 선택 수 치환
        }
        else if (value == '*,*') { this.ja.message = $.ja.regional.action.filter.all_select['#cdata']; }
        else { this.ja.message = $.ja.regional.action.filter.selected['#cdata']; }
      }

      var ret_max = (max != 0) ? $.ja.isSelected(this.target,'max',max) : true;

      if (ret_min && !ret_max) {
        this.ja.error = true;
        if (reg.test(value)) { this.ja.message = $.ja.regional.action.filter.over_select['#cdata']; }
        else if (value == '*,*') { this.ja.message = $.ja.regional.action.filter.all_select['#cdata']; }
        else { this.ja.message = $.ja.regional.action.filter.selected['#cdata']; }
      }

      this.ja.message = this.ja.message.replace('{$min}',min).replace('{$max}',max); // 선택 수 치환

    }
    , _length : function(filter,value) {
      var regx = /[0-9]+,[0-9]+$/;
      var flag = regx.test(value);

      if (flag) {
        var div_value = value.split(',');
        var min = parseInt(div_value[0]);
        var max = parseInt(div_value[1]);
      } else {
        var min = parseInt(value);
      }

      if (!isNaN(min)) {
        filter = 'min_length';
        this.ja.error = !$.ja.isCount(filter,min,this.value);
        if (this.ja.error) { value = min; }
      }

      if (!isNaN(max) && !this.ja.error) {
        filter = 'max_length';
        this.ja.error = !$.ja.isCount(filter,max,this.value);
        if (this.ja.error) { value = max; }

        this.ja.message = (this.ja.error) ? $.ja.regional.action.filter.length['#cdata'] : '';
      } else {
        if (flag) {
          this.ja.message = (this.ja.error) ? $.ja.regional.action.filter.length['#cdata'] : '';
        } else {
          this.ja.message = (this.ja.error) ? $.ja.regional.action.filter.num_length['#cdata'] : '';
        }
      }

      this.ja.message = this.ja.message.replace('{$min}',min).replace('{$max}',max).replace('{$num}',min);
    }

    , _minLength : function(filter,value) {
      this.ja.error = !$.ja.isCount(filter,value,this.value);
      this.ja.message = (this.ja.error) ? $.ja.regional.action.filter.min_length['#cdata'] : '';
      this.ja.message = this.ja.message.replace('{$min}',value);
    }

    , _maxLength : function(filter,value) {
      this.ja.error = !$.ja.isCount(filter,value,this.value);
      this.ja.message = (this.ja.error) ? $.ja.regional.action.filter.max_length['#cdata'] : '';
      this.ja.message = this.ja.message.replace('{$max}',value);
    }

    , _num : function(filter,value) { // 숫자 체크
      var div_value = value.split(',');
      var min = parseInt(div_value[0]);
      var max = parseInt(div_value[1]);
      
      if (isNaN(max)) { // 범위를 입력하지 않을 경우 최대값을 확인함.
        this.ja.error = (parseInt(this.value) <= min) ? false : true;
        this.ja.message = (this.ja.error) ? $.ja.regional.action.filter.max_num['#cdata'] : '';
        this.ja.message = this.ja.message.replace('{$max}',min);
      } else {
        this.ja.error = (parseInt(this.value) >= min && parseInt(this.value) <= max) ? false : true;
        this.ja.message = (this.ja.error) ? $.ja.regional.action.filter.num['#cdata'] : '';
        this.ja.message = this.ja.message.replace('{$min}',min).replace('{$max}',max);
      }
    }

    , _minNumber : function(filter,value) {
      var num = parseInt(this.value);
      var chk = parseInt(value);
      this.ja.error = (chk > num);
      this.ja.message = (this.ja.error) ? $.ja.regional.action.filter.min_num['#cdata'] : '';
      this.ja.message = this.ja.message.replace('{$min}',value);
    }

    , _maxNumber : function(filter,value) {
      var num = parseInt(this.value);
      var chk = parseInt(value);
      this.ja.error = (chk < num);
      this.ja.message = (this.ja.error) ? $.ja.regional.action.filter.max_num['#cdata'] : '';
      this.ja.message = this.ja.message.replace('{$max}',value);
    }

    , _value : function(filter,value) {
      var val = $.ja.getValue(this.target);
      if (val != value) {
        this.ja.error = true;
        this.ja.message = (this.ja.error) ? $.ja.regional.action.filter.notlike['#cdata'] : '';
      }
    }

    , _compare : function(filter,value) { // 값 비교
      if (this.form == null) { return; }

      var reg_first = /(^!)?(.*)/;
      var reg_second = /^!/;

      var val_first,val_second;

      if (reg_first.test(filter)) {
        reg_first.exec(filter);
        val_first = RegExp.$2;

        val_first = $(val_first,this.form).val();
      } else { val_first = filter; }

      if (reg_first.test(value)) {
        reg_first.exec(value);
        val_second = RegExp.$2;

        val_second = $(val_second,this.form).val();
      } else { val_second = value.replace(reg_second,''); }

      // ! 로 시작할 경우 두 값이 다를 경우 오류 발생
      if (reg_second.test(value)) {
        if (val_first != val_second) { this.ja.error = true; this.ja.message = $.ja.regional.action.filter.notlike['#cdata']; }
      } else {
        if (val_first == val_second) { this.ja.error = true; this.ja.message = $.ja.regional.action.filter.like['#cdata']; }
      }
    }

    , _filtering : function(target,params,message) {
      // 초기화
      this._reset();

      this.target = !$.ja.isEmpty(target) ? target : this.target;
      this.params = !$.ja.isEmpty(params) ? params : this.params;
      this.message = !$.ja.isEmpty(message) ? message : this.message;

      this.value = this.target.val();
      this.type = $.ja.getCrossType(this.target.attr('type'));

      var obj = this._params2json(this.params);

      // 타켓
      this.ja.target = this.target;
      var is_element = $(this.ja.target).length;
      if (is_element == 0) { return; }

      // 타이틀 변수
      this.ja.title = $.ja.defString(obj.title,$.ja.defString(this.target.attr('title'),''));

      // 메세지 출력
      this.ja.display = obj.display;
      // 엘리먼트를 체크하지 않아도 되는 경우 종료 (filter=notnull)
      var reg_pattern = /(filter=notnull|min_length=[0-9]+|length=[0-9,]+|selected=[0-9,]+|min_selected=[0-9]+)/;
      if (reg_pattern.test(this.params) == false) { if ($.ja.isReg('notnull',this.value) == false) { this.ja.error = false; return; } }

      var count = obj.go.length;
      var i = 0;

      // 필터 시작
      while (!this.ja.error && i < count) {
        var go_filter = obj.go[i].filter;
        var go_value = obj.go[i].value;

        switch (go_filter) {
          // what?
          case 'notnull' :
          case 'null' :
            this._checkbox(go_filter,go_value);
          break;
          case 'filter' : this._filter(go_filter,go_value); break;
          case 'selected' : this._selected(go_filter,go_value); break;
          case 'min_selected' : this._minSelected(go_filter,go_value); break;
          case 'max_selected' : this._maxSelected(go_filter,go_value); break;
          case 'min_length' : this._minLength(go_filter,go_value); break;
          case 'max_length' : this._maxLength(go_filter,go_value); break;
          case 'length' : this._length(go_filter,go_value); break;
          case 'num' : this._num(go_filter,go_value); break;
          case 'min_number' : this._minNumber(go_filter,go_value); break;
          case 'max_number' : this._maxNumber(go_filter,go_value); break;
          case 'value' : this._value(go_filter,go_value); break;
          default : this._compare(go_filter,go_value); break;
        }

        if (this.ja.error) {
          if (!$.ja.isEmpty(this.type)) { this.ja.action = 'focus'; }
          var reg = /^filter/g;
          
          // 메세지를 완성시킨다.
          switch (obj.message) {
            case 'title' : this.ja.message = this.ja.title; break;
            case 'no' : this.ja.message = ''; break;
            default : 
              var m = eval("$.ja.regional.action." + obj.message + "['#cdata']");
              if ($.ja.isEmpty(m)) { m = this.ja.message; }
              this.ja.message = this.ja.title + (!reg.test(obj.message) ? m : '');
            break;
          }

          break;
        }

        i++;
      }

      return this.ja;
    }

    , _reset : function() {
      this.ja = { message : '' , title : '' , display : '' , error : false , target : null , action : null , source : '' };
    }

    // settings
    , setDefaults : function(settings) {
      $.extend(true,this,settings);
      return this;
    }

    , _init : function() {
      // 설정된 메세지 저장
      var message = this.message;

      for (var i in this.filter) {
        this.target = $(this.filter[i].target,this.form);
        this.params = this.filter[i].params;

        this._filtering();
        
        // 동적 메시지가 있을 경우
        if ($.isFunction( this.filter[i].message ) ) {
          this.func_msg = this.filter[i].message;
        } else {
          this.func_msg = message;
        }

        if (this.ja.error) { return false; break; } // 에러가 발생한 경우 false
      }
    }

  };

  $.fn.jaFilter = function(options) {
    $.extend($.jaFilter,{ form : this },options);
    if ($.ja.isEmpty($.jaFilter.form) || $.ja.isEmpty($.jaFilter.filter)) { return alert('error jaFilter'); }
    if (!$.jaFilter._init()) {
      if ($.isFunction( $.jaFilter.func_msg )) {
        $.jaFilter.func_msg($.jaFilter.ja);
      } else {
        $.ja.result($.jaFilter.ja); 
      }

    }
    return $.jaFilter.ja;
  };

})(jQuery);
