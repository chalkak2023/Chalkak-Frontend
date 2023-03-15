import moment from 'moment-timezone';

export function formatDatetime(date) {
  return moment(date).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')
}