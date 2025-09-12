export default interface QuietBlock {
  id: string;
  userId: string;
  title: string;
  description: string;
  startsAt: Date;
  endsAt: Date;
  status: string;
  notification_sent: boolean;
}
