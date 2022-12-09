/** 
 * Formatted dates.
 */
import { format } from 'date-fns'

export function DateComponent({ dateString } : { dateString: string }) {
  return (
    <time dateTime={dateString}>
      {format(new Date(dateString), 'LLLL	d, yyyy')}
    </time>
  )
}
