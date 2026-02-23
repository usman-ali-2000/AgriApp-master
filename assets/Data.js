export const BaseUrl = 'https://agri-api-master.vercel.app';
// export const BaseUrl = 'http://192.168.2.6:3000';


export function toBackendFormat(calendarDate) {
  const [year, month, day] = calendarDate.split('-');

  const dayNum = Number(day);
  const monthNum = Number(month);

  return `${dayNum}/${monthNum}/${year}`; // "19/2/2026"
}
