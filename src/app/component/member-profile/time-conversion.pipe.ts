import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeConversion'
})
export class TimeConversionPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      return 'NA';
    }
    const [hours, minutes] = value.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const convertedHours = hours % 12 || 12;
    return `${convertedHours}:${minutes < 10 ? '0' + minutes : minutes} ${period}`;
  }

}
