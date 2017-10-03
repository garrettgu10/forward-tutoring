//returns a string representing the difference btween two times
export default function TimeDiff(date){
  var now = new Date();
  var seconds = Math.floor((now.getTime()-date.getTime())/1000);
  if(seconds < 45){
    return 'a few seconds ago';
  }
  if(seconds < 90){
    return 'a minute ago';
  }
  var minutes = Math.round(seconds/60);
  if(minutes < 45){
    return minutes + " minutes ago";
  }
  if(minutes < 90) {
    return 'an hour ago';
  }
  var hours = Math.round(minutes/60);
  if(hours < 22){
    return hours + ' hours ago';
  }
  if(hours < 36){
    return 'a day ago';
  }
  var days = Math.round(hours/24);
  if(days < 26){
    return days + ' days ago';
  }
  if(days < 46){
    return 'a month ago';
  }
  var months = Math.round(days/30);
  if(days < 320){
    return months + ' months ago';
  }
  if(days < 548){
    return 'a year ago';
  }
  var years = Math.round(months/12);
  return years + ' years ago';
}