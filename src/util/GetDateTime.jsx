import { format } from 'date-fns';

const GetDateTime = () => format(new Date(), 'yyyy-MM-dd HH:mm:ss');

export default GetDateTime;
