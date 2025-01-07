import QRCode from 'qrcode';

interface TicketQRData {
  categoryId: string;
  customerId: string;
  eventName: string;
  organizerName: string;
}

export async function generateTicketQR(data: TicketQRData): Promise<string> {
  const qrData = JSON.stringify(data);
  return QRCode.toDataURL(qrData);
}