import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timedifference'
})
export class TimedifferencePipe implements PipeTransform {

  transform(dateTimeString: string): string {
    const notificationDate = new Date(dateTimeString);
    const currentDate = new Date();
    const differenceInSeconds = Math.floor((currentDate.getTime() - notificationDate.getTime()) / 1000);

    if (differenceInSeconds < 60) {
      return `${differenceInSeconds} second${differenceInSeconds !== 1 ? 's' : ''} ago`;
    } else if (differenceInSeconds < 3600) {
      const minutes = Math.floor(differenceInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (differenceInSeconds < 86400) {
      const hours = Math.floor(differenceInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if(differenceInSeconds <(86400 * 30)){
      const days = Math.floor(differenceInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
      // return dateTimeString;
    }else if (differenceInSeconds < 86400 * 365) { // Less than 365 days (1 year)
      const months = Math.floor(differenceInSeconds / (86400 * 30));
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(differenceInSeconds / (86400 * 365));
      return `${years} year${years !== 1 ? 's' : ''} ago`;
    }
  }




}
