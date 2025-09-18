/**
 * Utility functions for event date/time handling
 */

/**
 * Get the exact start date and time of an event
 * @param {Object} event - Event object with date and optional time
 * @returns {Date} - The exact start datetime of the event
 */
export const getEventDateTime = (event) => {
  if (!event || !event.date) {
    return new Date();
  }

  const eventDate = new Date(event.date);
  
  if (event.time) {
    // Parse the time string (e.g., "10:00 AM", "2:30 PM")
    const [time, period] = event.time.split(' ');
    const [hours, minutes] = time.split(':');
    let hour24 = parseInt(hours);
    
    // Convert to 24-hour format
    if (period?.toLowerCase() === 'pm' && hour24 !== 12) {
      hour24 += 12;
    } else if (period?.toLowerCase() === 'am' && hour24 === 12) {
      hour24 = 0;
    }
    
    eventDate.setHours(hour24, parseInt(minutes) || 0, 0, 0);
  } else {
    // If no time specified, consider the event starts at beginning of the day
    eventDate.setHours(0, 0, 0, 0);
  }
  
  return eventDate;
};

/**
 * Check if an event is upcoming (has not started yet)
 * @param {Object} event - Event object with date and optional time
 * @returns {boolean} - True if the event is upcoming, false if it's past
 */
export const isEventUpcoming = (event) => {
  return getEventDateTime(event) > new Date();
};

/**
 * Check if an event is in the past (has already started)
 * @param {Object} event - Event object with date and optional time
 * @returns {boolean} - True if the event is past, false if it's upcoming
 */
export const isEventPast = (event) => {
  return getEventDateTime(event) <= new Date();
};
