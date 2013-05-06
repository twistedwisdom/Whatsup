$(document).ready(function() {
 $('.container').find('img').each(function(){
  var imgClass = (this.width/this.height > 1) ? 'wide' : 'tall';
  alert('test');
  $(this).addClass(imgClass);
 })
})