// Request synchronously from the user's click, while converting browser security exceptions into a result.
export function requestNotificationPermission():Promise<NotificationPermission|null>{
 if(!('Notification' in window))return Promise.resolve(null);
 try{return Notification.requestPermission().catch(()=>null);}catch{return Promise.resolve(null);}
}
