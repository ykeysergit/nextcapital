(function($){
  $.isBlank = function(obj){
    return !obj || 
    ($.type(obj)==='object' &&  $.isEmptyObject(obj)) ||
    ($.type(obj)==='array' && obj.length==0) ||
    ($.isNumeric(obj) && obj==0) ||
    ($.type(obj)==='string' && $.trim(obj).length==0);
  };
})(jQuery);