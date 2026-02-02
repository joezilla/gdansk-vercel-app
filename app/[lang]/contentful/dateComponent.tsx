/** 
 * Formatted dates.
 */
import { format } from 'date-fns'
import { enUS, de } from 'date-fns/locale'


export function DateComponent({ dateString, locale } : { dateString: string , locale: string }) {
  const myLocale = locale == "de" ? de : enUS;
  return (
    <time dateTime={dateString}>
      {format(new Date(dateString), 'LLLL	d, yyyy', { locale: myLocale })}
    </time>
  )
}
