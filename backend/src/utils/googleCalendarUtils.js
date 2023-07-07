const { google } = require('googleapis');

const GMAIL_ID = 'calendar@boxwood-academy-391920.iam.gserviceaccount.com';
const CALENDAR_AUTH_URL = 'https://www.googleapis.com/auth/calendar';

const PRIVATE_KEY =
  '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDZ9aGIdiaF09ml\nEjgkfqSFXvJmRCqZ8h7t8Nlge4wKk1WGWVhN6AAzFVM2aYl0+1sSbiF2SOlp8lmB\njcvziPc5EopQJ8MsCVW1erE34lcc2q37310tCwL3ZlUoVFIWUG/FDnh9XpH8DiN/\nWf73GrMf6CNEOJvQ3sFQdR7zeRWDtG6XRdOnqFfgwiKPWx7OXZuJHuvl8Z4PmW/4\n47fS8PZnYAo8V1Wc7euXafhQouYxhbowl23L+uUAMdXYI40UhGY1KpRTtGoveGBO\nJVm/HDzqg8jr5dQKQyHI+i3fwRKyoAsn9aCuSAgHbtAwmA2ir6pzVFoiK0pgaUYP\nNE35G29/AgMBAAECggEABKartERFLSzoo4+geBLlwtzUUl9ZA2D5zP0LPnZUdjNP\nq2bDriHpwy1M0cftwXvNpTaJa0NCC9s6kruqYv+EuwiMwAohLZLja9R67KTdVAXM\nmafaDqiB/zKFVa968vPzdqKI6q/2cIkCs+iBOtesg91Jx15n4MyoFmXxa6OlVGKe\nroxo6zOA7j7T4aItEPSYL94CtC+u6RpGJ2samo6dHoxlWEdt3sEo9xtLqgK2w5da\nTKZ0wiK04ELy4gxBFeH9Fv7BIu6jzkpIHHiokceleASbY5DboZjSJFRWMpW6Mirq\nF6i1TYHtwldZmJHg8yuHaxIUF9R8h5Xu1w5d+XFTIQKBgQD/vQLPVipeGuE7hLKc\nDy1kJja0dw37DfZEIsR/MpzegPYLhn/pgbQHkfn/fJZdQmKRZ2Bb3BcTYQ3kyaFI\nZska5/x9GxpdKwQLiq3rkq+b28K8SyE4L0FYHV3rSAgCBqem0zqrrJcPbx3VlHNX\nVc+FuRr06lDc7xaJkatB7zJeYQKBgQDaLrld5w+SBxb4tqBUC08gVCKY9usfy+Ch\nUkbBtCZjp4hPUDJfWbu6DaCF6AYrVoqDTigTkVltri7OjT+FXOZogF83Z4EcrmdC\nxyt0rubc+jz+UXXzi9hfvxwGv6Rrk7INRpSF2pEpmpWiquJCmglQdX0A6/aNR95T\n+A00thvZ3wKBgFjqXIm+CakCa4EIGBmOZVfGuYpxQlkhd5glBnC7JjNuXx2Ou/Zx\n9CgVpvgfVyBBroeji6skkJlaSzxapkrIAe/q7KyKudXe2N8yblnTfF8SP1i8PmaM\nd4mtXDQrrS0XJz8nfeSmczcYiSTzIk8hNK/ntemldkv6jLlz/jlEcxzBAoGAKQZu\nHoUK/XdNz3hvjz4NI9QOKVsMfQ8V7t+MpHGeYlCnJdq7jghObz6Ot38YYd/E7cmt\naXiEK0Z8UKRolEgSnwW8YauZsG3uxrSyrB8TE+wNufhRSHk8N0y1FWPFo+DCsxJZ\nbQ3bC8qgZlThdIqIQ9PDrH+x/YDNAlb7DLVNaVsCgYEA4LgTLABVxoV/BlQJ/v7n\nglzIcW6UDkajn7kj/iQ4ddz/TYWSgFS68IAO0RQ4ETKqADp0oPo0rOZE5FinkBuL\n3cNVPjr/vZYSdLbF20keuiBXCjR3puniiHLctsp7oL3nMbP2K/rAMeo4FNmNabAR\nCe5eSRHoDTGH/s3t2aITOcw=\n-----END PRIVATE KEY-----\n';

async function createGoogleCalendar(uuid) {
  try {
    const jwtClient = new google.auth.JWT(GMAIL_ID, null, PRIVATE_KEY, [
      CALENDAR_AUTH_URL,
    ]);

    await jwtClient.authorize();

    const calendar = google.calendar({ version: 'v3', auth: jwtClient });

    const newCalendar = {
      summary: uuid,
      timeZone: 'America/Sao_Paulo',
    };

    const response = await calendar.calendars.insert({
      resource: newCalendar,
    });

    return { calendarId: response.data.id };
  } catch (error) {
    console.error('Error on create a new calendar', error);
  }
}

async function listCalendars() {
  try {
    const jwtClient = new google.auth.JWT(GMAIL_ID, null, PRIVATE_KEY, [
      CALENDAR_AUTH_URL,
    ]);

    await jwtClient.authorize();

    const calendar = google.calendar({ version: 'v3', auth: jwtClient });

    const response = await calendar.calendarList.list();
    const calendars = response.data.items;

    return calendars;
  } catch (error) {
    console.error('Error on list calendar', error);
  }
}

async function listCalendarEvents(calendarId) {
  try {
    const jwtClient = new google.auth.JWT(GMAIL_ID, null, PRIVATE_KEY, [
      CALENDAR_AUTH_URL,
    ]);

    await jwtClient.authorize();

    const calendar = google.calendar({ version: 'v3', auth: jwtClient });

    const response = await calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items;

    return events;
  } catch (error) {
    console.error('Error on list calendar events', error);
  }
}

async function createEventInCalendar(calendarId, event) {
  try {
    const jwtClient = new google.auth.JWT(GMAIL_ID, null, PRIVATE_KEY, [
      CALENDAR_AUTH_URL,
    ]);

    await jwtClient.authorize();

    const calendar = google.calendar({ version: 'v3', auth: jwtClient });

    const response = await calendar.events.insert({
      calendarId,
      resource: {
        summary: event.summary,
        description: event.description,
        start: {
          dateTime: event.start,
          timeZone: 'America/Sao_Paulo',
        },
        end: {
          dateTime: event.end,
          timeZone: 'America/Sao_Paulo',
        },
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error on create a new calendar event', error);
  }
}

module.exports = {
  createEventInCalendar,
  listCalendarEvents,
  createGoogleCalendar,
  listCalendars,
};
