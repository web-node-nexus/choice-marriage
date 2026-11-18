export interface Notification {
    id?:number;
    notify_by_id: string;
    notify_to_id: string;
    notify_created_date_time: string;
    notify_status_view: boolean;
    notify_desc: string;
    notify_type:string,
    notify_url: string;
    notify_update_date_time: any;
    notify_expire_data_time:any,
    notify_action_taken:any
  }