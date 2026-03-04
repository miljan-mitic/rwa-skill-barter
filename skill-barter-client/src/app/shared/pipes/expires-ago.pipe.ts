import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'expiresAgo',
  pure: true,
})
export class ExpiresAgoPipe implements PipeTransform {
  transform(seconds: number | undefined, ...args: any[]) {
    return this.formatExpiresAgo(seconds, args[0]);
  }

  formatExpiresAgo(seconds: number | undefined, description: string): string | void {
    if (!seconds) return;
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
      return `${description} in less than ${years} year${years > 1 ? 's' : ''} `;
    } else if (months > 0) {
      return `${description} in less than ${months} month${months > 1 ? 's' : ''} `;
    } else if (days > 0) {
      return `${description} in less than ${days} day${days > 1 ? 's' : ''} `;
    } else if (hours > 0) {
      return `${description} in less than ${hours} hour${hours > 1 ? 's' : ''} `;
    } else if (minutes > 0) {
      return `${description} in less than ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return `${description} in less than ${seconds} second${seconds > 1 ? 's' : ''}`;
    }
  }
}
