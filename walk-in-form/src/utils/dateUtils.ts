import dayjs, { Dayjs } from 'dayjs';

/**
 * Safely convert string date to dayjs object
 */
export function safeParseDate(dateStr?: string | null): Dayjs | null {
  if (!dateStr || dateStr.trim() === '') {
    return null;
  }

  try {
    const parsed = dayjs(dateStr);
    return parsed.isValid() ? parsed : null;
  } catch (error) {
    console.warn('Error parsing date:', error, 'for date:', dateStr);
    return null;
  }
}

/**
 * Convert dayjs object back to string for API submission
 */
export function formatDateForAPI(date?: Dayjs | string | null): string | undefined {
  if (!date) return undefined;
  
  try {
    if (typeof date === 'string') {
      return date;
    }
    
    if (dayjs.isDayjs(date)) {
      return date.format('YYYY-MM-DD');
    }
    
    return undefined;
  } catch (error) {
    console.warn('Error formatting date for API:', error);
    return undefined;
  }
}

/**
 * Convert form values with dates to API format
 */
export function convertFormDatesForAPI(formValues: any): any {
  const converted = { ...formValues };
  
  // Handle visitDate
  if (converted.visitDate) {
    converted.visitDate = formatDateForAPI(converted.visitDate);
  }
  
  // Handle any other date fields as needed
  if (converted.followUpDate) {
    converted.followUpDate = formatDateForAPI(converted.followUpDate);
  }
  
  return converted;
}